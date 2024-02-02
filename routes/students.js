const express = require('express');
const { WebUntisSecretAuth, WebUntisElementType } = require('webuntis');
const database = require('../database');

const router = express.Router();

router.get('/getStudent', async (req, res) => {
    let student;
    if (req.query.id) {
        student = await database.getStudentById(req.query.id);
    } else if (req.query.cardId) {
        student = await database.getStudentByCardId(req.query.cardId);
    } else {
        res.sendStatus(400);
    }
    res.json(student);
});

router.get('/getStudentTimetable', async (req, res) => {
    if (req.query.id) {
        let student = await database.getStudentById(req.query.id);
        if (student.untisID) {
            let untis = new WebUntisSecretAuth(process.env.UNTIS_SCHOOL, process.env.UNTIS_USERNAME, process.env.UNTIS_SECRET, process.env.UNTIS_SERVER);
            await untis.login();
            let timetable = await untis.getOwnTimetableFor(new Date(), student.untisID, WebUntisElementType.STUDENT);
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
    if (req.query.name) {
        res.json(await database.getStudentsByName(req.query.name));
    } else {
        res.sendStatus(400);
    }
});

router.post('/addStudent', async (req, res) => {
    if (req.body.name && req.body.firstName && req.body.birthDate && req.body.address && req.body.email) {
        res.json({
            id: await database.insertStudent(req.body.name, req.body.firstName, req.body.birthDate, req.body.address, req.body.email, req.body.class)
        });
    } else {
        res.sendStatus(400);
    }
});

router.get('/deleteStudent', async (req, res) => {
    if (req.query.id) {
        database.deleteStudent(req.query.id);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

router.post('/editStudent', async (req, res) => {
    if (req.body.id) {
        res.json(await database.editStudent(req.body.id, req.body));
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;