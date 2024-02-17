const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');

let wsServer;

const router = express.Router();

function websocket(server) {
    wsServer = new WebSocketServer({server: server, path: '/api/nfc'});
}

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'static', 'nfc.html'));
});

router.post('/readNfc', (req, res) => {
    console.log(req.body);
    if (req.body.sessionId && req.body.nfcId) {
        wsServer.clients.forEach((client) => {
            client.send(JSON.stringify({sessionId: req.body.sessionId, nfcId: parseInt(req.body.nfcId)}));
        });
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

module.exports = {router, websocket};