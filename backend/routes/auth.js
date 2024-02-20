const express = require('express');
const passport = require('passport');
const { ensureAuthenticated } = require('../auth/authenticate');

const router = express.Router();

router.get('/login', passport.authenticate('openidconnect'));

router.get('/oidc/callback', passport.authenticate('openidconnect'), (req, res) => {
    res.redirect('/')
});

router.get('/userInfo', (req, res) => {
    res.json(req.user);
});

module.exports = router;