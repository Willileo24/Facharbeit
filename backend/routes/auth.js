const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/login', passport.authenticate('openidconnect'));

router.get('/oidc/callback', passport.authenticate('openidconnect'), (req, res) => {
    res.redirect('/')
});

module.exports = router;