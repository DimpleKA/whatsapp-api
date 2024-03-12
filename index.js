const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');

const app = express();
const client = new Client();
const PORT = 3000;
const AUTH_TOKEN = 'Dimple999'; // Your authentication token

app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static('public'));

client.on('qr', async (qr) => {
    console.log('QR Code generated!');

    try {
        // Generate QR code as data URL
        const qrImage = await qrcode.toFile('./qr.png', qr, { errorCorrectionLevel: 'low' });
        console.log('QR Code saved as qr.png');
    } catch (err) {
        console.error('Error generating QR code:', err);
    }
});

client.on('ready', () => {
    console.log('Client is ready!');
});

app.post('/send-message', (req, res) => {
    const { authToken, number, message } = req.body;

    // Check if authToken matches
    if (authToken !== AUTH_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
    }

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

// Serve index.html when the root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
