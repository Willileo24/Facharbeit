const fs = require('fs');
const sqlite3 = require('sqlite3');
const logger = require('log4js').getLogger("default");

var db = new sqlite3.Database('./data/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        if (err.code == "SQLITE_CANTOPEN") {
            createDatabase();
            return;
        } else {
            logger.error(err);
            return;
        }
    }
});

function createDatabase() {
    if (!fs.existsSync('./data/')) {
        fs.mkdirSync('./data/');
    }
    var newdb  = new sqlite3.Database('./data/database.db', (err) => {
        if (err) {
            logger.error(err);
            return;
        }
        newdb.exec(`
        CREATE TABLE students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            firstName TEXT,
            birthDate INTEGER,
            address TEXT,
            studentEmail TEXT,
            class VARCHAR(10),
            lockerID INTEGER,
            cardID INTEGER,
            cardLocked BOOLEAN
        );`);
        newdb.exec(`
        CREATE TABLE parentEmails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentID INTEGER,
            email TEXT,
            description TEXT
        );`);
        newdb.exec(`
        CREATE TABLE phoneNumbers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentID INTEGER,
            phoneNumber TEXT,
            description TEXT
        );`);
    });
    db = newdb;
}

function query(query) {
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) {
                logger.error(err);
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

async function getStudentById(id) {
    let rows = await query(`SELECT * FROM students WHERE id=${id};`);
    if (rows.length == 0) {
        return null;
    }
    let student = rows[0];

    let parentEmails = await query(`SELECT id, email, description FROM parentEmails WHERE studentID=${student.id};`);
    student.parentEmails = parentEmails;

    let phoneNumbers = await query(`SELECT id, phoneNumber, description FROM phoneNumbers WHERE studentID=${student.id};`);
    student.phoneNumbers = phoneNumbers;

    return student;
}

async function getStudentByCardId(cardId) {
    let rows = await query(`SELECT * FROM students WHERE cardID = ${cardId};`);
    if (rows.length == 0) {
        return null;
    }
    let student = rows[0];

    let parentEmails = await query(`SELECT id, email, description FROM parentEmails WHERE studentID = ${student.id};`);
    student.parentEmails = parentEmails;

    let phoneNumbers = await query(`SELECT id, phoneNumber, description FROM phoneNumbers WHERE studentID = ${student.id};`);
    student.phoneNumbers = phoneNumbers;

    return student;
}

async function getStudentsByName(name) {
    let rows = await query(`SELECT id, name, firstName, class FROM students WHERE name LIKE '${name}%' OR firstName LIKE '${name}%';`);
    return rows;
}

async function insertStudent(name, firstName, birthDate, address, studentEmail, studentClass) {
    let result = await query(`INSERT INTO students (name, firstName, birthDate, address, studentEmail, class) VALUES ('${name}', '${firstName}', ${Date.parse(birthDate)}, '${address}', '${studentEmail}', '${studentClass}') RETURNING id;`);
    return result[0].id;
}



module.exports = {
    getStudentById,
    getStudentByCardId,
    getStudentsByName,
    insertStudent
}