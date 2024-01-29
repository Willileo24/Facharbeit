const express = require('express');
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

router.get('/getStudents', async (req, res) => {
    if (req.query.name) {
        res.json(await database.getStudentsByName(req.query.name));
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;