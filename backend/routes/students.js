const express = require('express');
const { WebUntisSecretAuth, WebUntisElementType } = require('webuntis');
const { authenticator } = require('otplib');
const database = require('../database');
const { hasPermission } = require('../auth/userData');

const router = express.Router();

router.get('/getStudent', async (req, res) => {
    if (!hasPermission(req.user, "students.view")) {
        res.sendStatus(403);
        return;
    }

    let student;
    if (req.query.id) {
        student = await database.getStudentById(req.query.id);
    } else if (req.query.cardId) {
        student = await database.getStudentByCardId(req.query.cardId);
    } else {
        res.sendStatus(400);
    }
    let result = {};
    Object.keys(student).forEach((key) => {
        if (hasPermission(req.user, "students.data." + key)) {
            result[key] = student[key];
        }
    });
    res.send(result);
});

router.get('/getStudentTimetable', async (req, res) => {
    if (!hasPermission(req.user, "students.data.timetable")) {
        res.sendStatus(403);
        return;
    }

    if (req.query.id) {
        let student = await database.getStudentById(req.query.id);
        if (student.untisID) {
            let untis = new WebUntisSecretAuth(process.env.UNTIS_SCHOOL, process.env.UNTIS_USERNAME, process.env.UNTIS_SECRET, process.env.UNTIS_SERVER);
            const token = authenticator.generate(process.env.UNTIS_SECRET);
            const time = new Date().getTime();
            await untis._otpLogin(token, untis.username, time, true);
            let timetable = await untis.getTimetableFor(new Date(), student.untisID, WebUntisElementType.STUDENT);
            await untis.logout();
            res.json(timetable);
        } else {
            res.json([]);
        }
    } else {
        res.sendStatus(400);
    }
});

router.get('/getStudents', async (req, res) => {
    if (!hasPermission(req.user, "students.search")) {
        res.sendStatus(403);
        return;
    }

    if (req.query.name) {
        res.json(await database.getStudentsByName(req.query.name));
    } else {
        res.sendStatus(400);
    }
});

router.post('/addStudent', async (req, res) => {
    if (!hasPermission(req.user, "admin.students")) {
        res.sendStatus(403);
        return;
    }

    if (req.body.name && req.body.firstName && req.body.birthDate && req.body.address && req.body.studentEmail) {
        const id = await database.insertStudent(req.body.name, req.body.firstName, req.body.birthDate, req.body.address, req.body.studentEmail, req.body.class)
        res.json(await database.editStudent(id, req.body));
    } else {
        res.sendStatus(400);
    }
});

router.get('/deleteStudent', async (req, res) => {
    if (!hasPermission(req.user, "admin.students")) {
        res.sendStatus(403);
        return;
    }

    if (req.query.id) {
        database.deleteStudent(req.query.id);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

router.post('/editStudent', async (req, res) => {
    if (!hasPermission(req.user, "admin.students")) {
        res.sendStatus(403);
        return;
    }

    if (req.body.id) {
        res.json(await database.editStudent(req.body.id, req.body));
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;