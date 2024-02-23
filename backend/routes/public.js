const express = require('express');
const database = require('../database');

const router = express.Router();

router.use(express.static("public"));

router.get('/student/:cardID', async (req, res) => {
    let student = await database.getStudentByCardId(req.params.cardID);
    if (student && student.cardLocked != true) {
        res.render("viewStudent", {student});
    } else {
        res.render("invalid");
    }
});

module.exports = router;