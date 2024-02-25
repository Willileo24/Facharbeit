const express = require('express');
const { hasPermission, getUsers, setUserPermissions, getGroups, setGroupPermissions, getApps, addApp, deleteApp, setAppPermissions } = require('../auth/userData');

const router = express.Router();

router.get('/getUsers', async (req, res) => {
    if (!hasPermission(req.user.permissions, "admin.users")) {
        res.sendStatus(403);
        return;
    }

    res.json(await getUsers());
});

router.get('/getGroups', async (req, res) => {
    if (!hasPermission(req.user.permissions, "admin.users")) {
        res.sendStatus(403);
        return;
    }

    res.json(await getGroups());
});

router.post('/setUserPermissions', async (req, res) => {
    if (!hasPermission(req.user.permissions, "admin.users")) {
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
    if (!hasPermission(req.user.permissions, "admin.users")) {
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

router.get('/getApps', async (req, res) => {
    if (!hasPermission(req.user.permissions, "admin.applications")) {
        res.sendStatus(403);
        return;
    }

    res.json(await getApps());
});

router.post('/addApp', async (req, res) => {
    if (!hasPermission(req.user.permissions, "admin.applications")) {
        res.sendStatus(403);
        return;
    }

    if (req.body.name && req.body.secret) {
        res.json(await addApp(req.body.name, req.body.secret));
    } else {
        res.sendStatus(400);
    }
});

router.post('/deleteApp', async (req, res) => {
    if (!hasPermission(req.user.permissions, "admin.applications")) {
        res.sendStatus(403);
        return;
    }

    if (req.body.id) {
        await deleteApp(req.body.id);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

router.post('/setAppPermissions', async (req, res) => {
    if (!hasPermission(req.user.permissions, "admin.applications")) {
        res.sendStatus(403);
        return;
    }

    if (req.body.id && req.body.permissions) {
        await setAppPermissions(req.body.id, req.body.permissions);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;