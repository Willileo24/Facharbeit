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