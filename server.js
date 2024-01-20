const express = require('express');
const log4js = require('log4js');
require('dotenv').config();

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
app.use(log4js.connectLogger(logger, { level: "auto" }));


app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.port}`);
});