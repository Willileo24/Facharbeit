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

module.exports = router;