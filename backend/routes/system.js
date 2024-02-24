const express = require('express');
const { hasPermission, getUsers, setUserPermissions, getGroups, setGroupPermissions } = require('../auth/userData');

const router = express.Router();

router.get('/getUsers', async (req, res) => {
    if (!hasPermission(req.user, "admin.users")) {
        res.sendStatus(403);
        return;
    }

    res.json(await getUsers());
});

router.get('/getGroups', async (req, res) => {
    if (!hasPermission(req.user, "admin.users")) {
        res.sendStatus(403);
        return;
    }

    res.json(await getGroups());
});

router.post('/setUserPermissions', async (req, res) => {
    if (!hasPermission(req.user, "admin.users")) {
        res.sendStatus(403);
        return;
    }

    if (req.body.id && req.body.permissions) {
        await setUserPermissions(req.body.id, req.body.permissions);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

router.post('/setGroupPermissions', async (req, res) => {
    if (!hasPermission(req.user, "admin.users")) {
        res.sendStatus(403);
        return;
    }

    if (req.body.id && req.body.permissions) {
        await setGroupPermissions(req.body.id, req.body.permissions);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;