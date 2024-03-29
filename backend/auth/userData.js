const fs = require('fs');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
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
        newdb.exec(`
        CREATE TABLE apps (
            id INTEGER PRIMARY KEY,
            name TEXT,
            secret TEXT,
            permissions TEXT
        )`);

        newdb.exec(`INSERT INTO users (id, permissions) VALUES ('${process.env.INITIAL_ADMIN_USER_ID}', '*');`);
        newdb.exec(`INSERT INTO apps (name, permissions) VALUES ('public', '')`);
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
    await query(`UPDATE users SET displayName = '${user.displayName}', username = '${user.username}' WHERE id = '${user.id}';`);
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
    for (var i = 0; i < user._json.groups.length; i++) {
        let perms = await getGroupPermissions(user._json.groups[i]);
        perms.forEach((perm) => {
            if (!permissions.includes(perm)) {
                permissions.push(perm);
            }
        });
    }
    return permissions;
}

function hasPermission(permissions, permission) {
    if (permissions.includes(permission)) {
        return true;
    }
    while (permission != "*") {
        permission = permission.replace(/\w+(\.\*)?$/, "*");
        if (permissions.includes(permission)) {
            return true;
        }
    }
    return false;
}

async function getUsers() {
    let rows = await query(`SELECT id, displayName, permissions FROM users;`);
    return rows.map((row) => {
        return {
            ...row,
            permissions: row.permissions.split(",")
        }
    });
}

async function setUserPermissions(id, permissions) {
    await query(`UPDATE users SET permissions = '${permissions.join(',')}' WHERE id = '${id}';`)
}

async function getGroups() {
    let rows = await query(`SELECT groupName, permissions FROM groups;`);
    return rows.map((row) => {
        return {
            ...row,
            permissions: row.permissions.split(",")
        }
    });
}

async function setGroupPermissions(groupName, permissions) {
    await query(`UPDATE groups SET permissions = '${permissions.join(',')}' WHERE groupName = '${groupName}';`)
}

async function getApps() {
    let rows = await query(`SELECT id, name, permissions FROM apps;`);
    return rows.map((row) => {
        return {
            ...row,
            permissions: row.permissions.split(",")
        }
    });
}

async function addApp(name, secret) {
    let hash = await bcrypt.hashSync(secret, 10);
    let rows = await query(`INSERT INTO apps (name, secret, permissions) VALUES ('${name}', '${hash}', '') RETURNING id;`);
    return rows[0].id;
}

async function deleteApp(id) {
    await query(`DELETE FROM apps WHERE id = ${id};`);
}

async function setAppPermissions(id, permissions) {
    await query(`UPDATE apps SET permissions = '${permissions.join(',')}' WHERE id = '${id}';`);
}

async function getAppPermissions(name) {
    let rows = await query(`SELECT permissions FROM apps WHERE name = '${name}';`);
    return rows[0].permissions.split(",");
}

async function checkAppSecret(name, secret) {
    let rows = await query(`SELECT * FROM apps WHERE name = '${name}';`);
    if (rows.length == 1) {
        if (await bcrypt.compareSync(secret, rows[0].secret)) {
            return rows[0];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

module.exports = {
    updateUserData,
    getPermissions,
    hasPermission,
    getUsers,
    setUserPermissions,
    getGroups,
    setGroupPermissions,
    getApps,
    addApp,
    deleteApp,
    setAppPermissions,
    getAppPermissions,
    checkAppSecret
}