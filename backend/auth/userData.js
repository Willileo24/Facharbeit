const fs = require('fs');
const sqlite3 = require('sqlite3');
const logger = require('log4js').getLogger("default");

var db = new sqlite3.Database('./data/users.db', sqlite3.OPEN_READWRITE, (err) => {
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
    var newdb  = new sqlite3.Database('./data/users.db', (err) => {
        if (err) {
            logger.error(err);
            return;
        }
        newdb.exec(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            displayName TEXT,
            username TEXT,
            permissions TEXT
        );`);
        newdb.exec(`
        CREATE TABLE groups (
            groupName TEXT PRIMARY KEY,
            permissions TEXT
        );`);

        newdb.exec(`INSERT INTO users (id, permissions) VALUES ('${process.env.INITIAL_ADMIN_USER_ID}', '*');`)
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

async function updateUserData(user) {
    await query(`INSERT OR IGNORE INTO users (id, permissions) VALUES ('${user.id}', '');`);
    await query(`UPDATE users SET displayName = '${user.displayName}', username = '${user.preferred_username}' WHERE id = '${user.id}';`);
    user._json.groups.forEach((group) => {
        query(`INSERT OR IGNORE INTO groups (groupName, permissions) VALUES ('${group}', '');`);
    });
}

async function getUserPermissions(userId) {
    let rows = await query(`SELECT permissions FROM users WHERE id = '${userId}';`);
    return rows[0].permissions.split(",");
}

async function getGroupPermissions(groupId) {
    let rows = await query(`SELECT permissions FROM groups WHERE groupName = '${groupId}';`);
    return rows[0].permissions.split(",");
}

async function getPermissions(user) {
    let permissions = await getUserPermissions(user.id);
    await user._json.groups.forEach(async (group) => {
        let perms = await getGroupPermissions(group);
        perms.forEach((perm) => {
            if (!permissions.includes(perm)) {
                permissions.push(perm);
            }
        });
    });
    return permissions;
}

function hasPermission(user, permission) {
    if (user.permissions.includes(permission)) {
        return true;
    }
    while (permission != "*") {
        permission = permission.replace(/\w+(\.\*)?$/, "*");
        if (user.permissions.includes(permission)) {
            return true;
        }
    }
    return false;
}

module.exports = {
    updateUserData,
    getPermissions,
    hasPermission
}