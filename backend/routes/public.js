const express = require('express');
const database = require('../database');
const userData = require('../auth/userData');

const router = express.Router();

router.use(express.static("public"));

router.get('/student/:cardID', async (req, res) => {
    let student = await database.getStudentByCardId(req.params.cardID);
    let permissions = await userData.getAppPermissions("public");
    if (student && student.cardLocked != true && userData.hasPermission(permissions, "application.active")) {
        let data = {};
        Object.keys(student).forEach((key) => {
            if (userData.hasPermission(permissions, "students.data." + key)) {
                data[key] = student[key];
            }
        });
        res.render("viewStudent", {student: data});
    } else {
        res.render("invalid");
    }
});

router.get('/api/getStudent', async (req, res) => {
    if (req.query.appName && req.query.appSecret) {
        let app = await userData.checkAppSecret(req.query.appName, req.query.appSecret);
        if (app != null && userData.hasPermission(app.permissions, "application.active")) {
            if (req.query.cardID) {
                let student = await database.getStudentByCardId(req.query.cardID);
                if (student != null) {
                    let data = {};
                    Object.keys(student).forEach((key) => {
                        if (userData.hasPermission(app.permissions, "students.data." + key)) {
                            data[key] = student[key];
                        }
                    });
                    res.json(data);
                } else {
                    res.json({error: "Student not found"});
                }
            } else {
                res.json({error: "No studend given"});
            }
        } else {
            res.json({error: "Forbidden"});
        }
    } else {
        res.json({error: "No credentials given"});
    }
});

module.exports = router;