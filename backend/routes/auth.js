const express = require('express');
const passport = require('passport');
const path = require('path');

const router = express.Router();

router.get('/login', passport.authenticate('openidconnect'));

router.get('/logout', (req, res) => {
    if (req.user) {
        req.logout(() => {
            res.sendFile(path.join(__dirname, '..', 'static', 'logout.html'));
        });
    } else {
        res.sendFile(path.join(__dirname, '..', 'static', 'logout.html'));
    }
});

router.get('/oidc/callback', passport.authenticate('openidconnect'), (req, res) => {
    res.redirect('/')
});

router.get('/userInfo', (req, res) => {
    res.json(req.user);
});

module.exports = router;