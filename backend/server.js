const express = require('express');
const expressSession = require('express-session');
const log4js = require('log4js');
const passport = require('passport');
const path = require('path');
const { ensureAuthenticated } = require('./auth/authenticate');

require('dotenv').config();
require('./database');
require('./auth/openidConnect');

// Setup logging
log4js.configure({
    appenders: {
        console: { type: "console" },
        file: { type: "file", filename: "logs/logs.log" }
    },
    categories: {
        default: { appenders: ["console", "file"], level: "info" }
    }
});

const logger = log4js.getLogger("default");

// Check .env configuration
if (!process.env.PORT) {
    logger.fatal("No server port defined in .env file!");
    return;
}

// Setup server
const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(log4js.connectLogger(logger, { level: "auto" }));
app.use(expressSession({
    secret: "jwur09gjehpehjpeh",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/students', ensureAuthenticated, require('./routes/students'));
app.use('/api/system', ensureAuthenticated, require('./routes/system'));
app.use('/api/nfc', require('./routes/nfc').router);
app.use('/auth', require('./routes/auth'));
app.use('/public', require('./routes/public'));

// Serve frontend
app.use('/', ensureAuthenticated, express.static(path.join(__dirname, 'frontendBuild')));
app.use('/*', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontendBuild', 'index.html'));
});

let server = app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.port}`);
});

require('./routes/nfc').websocket(server);