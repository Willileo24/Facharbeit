const express = require('express');
const ws = require('ws');

const wsServer = new ws.Server({ noServer: true });

const router = express.Router();

router.post('/readNfc', (req, res) => {
    if (req.body.sessionId && req.body.nfcId) {
        wsServer.clients.forEach((client) => {
            client.send(JSON.stringify({sessionId: req.body.sessionId, nfcId: req.body.nfcId}));
        });
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

module.exports = {router, wsServer};