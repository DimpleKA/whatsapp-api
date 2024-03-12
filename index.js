const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const client = new Client();
const PORT = 3000;

app.use(bodyParser.json());

client.on('qr', (qr) => {
    console.log('QR Code generated! Scan it to login.');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

app.post('/send-message', (req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({ error: 'Both number and message are required' });
    }

    const chatId = number.substring(1) + "@c.us";

    client.sendMessage(chatId, message).then(() => {
        console.log('Message sent successfully!');
        res.status(200).json({ success: true });
    }).catch((err) => {
        console.error('Error in sending message:', err);
        res.status(500).json({ error: 'Internal server error' });
    });
});

client.initialize();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
