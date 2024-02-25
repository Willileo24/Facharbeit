const fs = require('fs');
const sqlite3 = require('sqlite3');
const logger = require('log4js').getLogger("default");

const EDITABLE_FIELDS = ["name", "firstName", "birthDate", "address", "studentEmail", "class", "lockerID", "cardID", "cardLocked", "untisID", "mensaID"];

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
            cardLocked BOOLEAN,
            untisID INTEGER,
            mensaID TEXT
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
    let result = await query(`INSERT INTO students (name, firstName, birthDate, address, studentEmail, class, cardLocked) VALUES ('${name}', '${firstName}', ${Date.parse(birthDate)}, '${address}', '${studentEmail}', '${studentClass}', false) RETURNING id;`);
    return result[0].id;
}

async function deleteStudent(id) {
    await query(`DELETE FROM students WHERE id = ${id};`);
    await query(`DELETE FROM parentEmails WHERE studentID = ${id};`);
    await query(`DELETE FROM phoneNumbers WHERE studentID = ${id};`)
}

async function editStudent(id, options) {
    var req = "UPDATE students SET ";
    var doRequest = false;
    Object.keys(options).forEach((key) => {
        if (EDITABLE_FIELDS.includes(key)) {
            req += `${key} = ${(key == "birthDate" ? Date.parse(options[key]) : "'" + options[key] + "'")}, `;
            doRequest = true;
        }
    });
    req = req.replace(/, $/, "");
    req += `WHERE id = ${id} RETURNING *;`;
    if (doRequest) {
        await query(req);
    }
    if (options.parentEmails) {
        await editParentEmails(id, options.parentEmails);
    }
    if (options.phoneNumbers) {
        await editPhoneNumbers(id, options.phoneNumbers);
    }
    return getStudentById(id);
}

async function editParentEmails(studentId, emails) {
    emails.forEach(async (email) => {
        switch (email.action) {
            case "new":
                await query(`INSERT INTO parentEmails (studentID, email, description) VALUES (${studentId}, '${email.email}', '${email.description}');`);
                break;
            case "remove":
                await query(`DELETE FROM parentEmails WHERE studentID = ${studentId} AND id = ${email.id};`);
                break;
        }
    });
}

async function editPhoneNumbers(studentId, numbers) {
    numbers.forEach(async (number) => {
        switch (number.action) {
            case "new":
                await query(`INSERT INTO phoneNumbers (studentID, phoneNumber, description) VALUES (${studentId}, '${number.phoneNumber}', '${number.description}');`);
                break;
            case "remove":
                await query(`DELETE FROM phoneNumbers WHERE studentID = ${studentId} AND id = ${number.id};`);
                break;
        }
    });
}


module.exports = {
    getStudentById,
    getStudentByCardId,
    getStudentsByName,
    insertStudent,
    deleteStudent,
    editStudent
}