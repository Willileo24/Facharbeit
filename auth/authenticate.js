function ensureAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect("/auth/login");
    }
}

function forwardAuthenticated(req, res, next) {
    if (req.user) {
        res.redirect('/');
    } else {
        next();
    }
}

module.exports = {
    ensureAuthenticated,
    forwardAuthenticated
}