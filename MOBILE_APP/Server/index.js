const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const routes = require('./routes.js');
const WebSocket = require('ws');

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
app.use('/api', routes);

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
// const fetchTrackingsAndSend = async (ws) => {
//     try {
//         const [rows] = await DB.query('SELECT * FROM trackings');
//         ws.send(JSON.stringify(rows));
//     } catch (err) {
//         console.error("Database Error:", err);
//     }
// };

// // Simulate tracking data updates and broadcast to all connected WebSocket clients


wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');

    // Send current trackings to the client when they connect
    fetchTrackingsAndSend(ws);

    // Listen for any incoming messages from the client
    ws.on('message', (message) => {
        console.log('Received from client:', message);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed.');
    });
});

const fetchTrackingsAndSend = async (ws) => {
    try {
        // Fetch trackings with alert information
        const [rows] = await DB.query(`
            SELECT t.*, a.alert_type, a.acknowledged 
            FROM trackings t 
            LEFT JOIN alerts a ON t.number_plate = a.number_plate
        `);
        ws.send(JSON.stringify({ type: 'trackings', trackings: rows }));
    } catch (err) {
        console.error("Database Error:", err);
    }
};

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


// Monitor alerts table for changes
const monitorAlerts = async () => {
    try {
        const [alerts] = await DB.query(`
            SELECT a.*, t.description 
            FROM alerts a 
            JOIN trackings t ON a.number_plate = t.number_plate 
            WHERE a.acknowledged = FALSE
        `);

        // Broadcast alerts to relevant clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                alerts.forEach((alert) => {
                    client.send(JSON.stringify({
                        type: 'alert',
                        alert: alert
                    }));
                });
            }
        });

        // Also send updated tracking list
        const [trackings] = await DB.query(`
            SELECT t.*, a.alert_type, a.acknowledged 
            FROM trackings t 
            LEFT JOIN alerts a ON t.number_plate = a.number_plate
        `);

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'trackings',
                    trackings: trackings
                }));
            }
        });
    } catch (err) {
        console.error("Error monitoring alerts:", err);
    }
};

setInterval(simulateTrackingChange, 1000);
setInterval(monitorAlerts, 1000);

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
