const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const routes = require('./routes.js');
const WebSocket = require('ws');  // Import WebSocket library

dotenv.config();

const DB = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

const PORT = process.env.PORT;
const app = express();

// Initialize HTTP server
const server = require('http').createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use('/api/traffic', routes);

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');

    // Send current trackings to the client when they connect
    fetchTrackingsAndSend(ws);

    // Listen for any incoming messages from the client (optional)
    ws.on('message', (message) => {
        console.log('Received from client:', message);
    });

    // Handle WebSocket close event
    ws.on('close', () => {
        console.log('WebSocket connection closed.');
    });
});

// Fetch tracking data and send it to the WebSocket client
const fetchTrackingsAndSend = async (ws) => {
    try {
        const [rows] = await DB.query('SELECT * FROM trackings');
        ws.send(JSON.stringify(rows));
    } catch (err) {
        console.error("Database Error:", err);
    }
};

// Simulate tracking data updates and broadcast to all connected WebSocket clients
const simulateTrackingChange = async () => {
    try {
        const [updatedTrackings] = await DB.query('SELECT * FROM trackings');
        // Broadcast the updated data to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(updatedTrackings));
            }
        });
    } catch (err) {
        console.error("Error fetching updated trackings:", err);
    }
};


setInterval(simulateTrackingChange, 5000);

// Start the server
const startServer = async () => {
    try {
        const [rows, fields] = await DB.query('SELECT 1'); // Simple query to check connection
        console.log(`Database Connected`);

        // Start the HTTP and WebSocket server
        server.listen(PORT, () => {
            console.log(`Server Started on port ${PORT}`);
        });
    } catch (err) {
        console.error("Database Connection Error:", err);
    }
};

startServer();
