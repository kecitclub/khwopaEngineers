const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();
const DB = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

router.get('api/traffic/trackings', async (req, res) => {
    try {
        const [rows] = await DB.query('SELECT * FROM trackings');
        res.json(rows);
    } catch (err) {
        console.error("Database Connection Error:", err);
        res.status(500).json({ error: 'Database Connection Error' });
    }
});

router.get('api/traffic/logs', async (req, res) => {
    const { number_plate } = req.body;

    if (!number_plate) {
        return res.status(400).json({ error: 'number_plate is required' });
    }

    try {
        const query = `
            SELECT 
                camera_info.longitude, 
                camera_info.latitude, 
                log_info.timestamp
            FROM log_info
            JOIN camera_info ON log_info.camid = camera_info.camid
            WHERE log_info.number_plate = ?
        `;
        const [rows] = await DB.query(query, [number_plate]);
        res.json(rows);
    } catch (err) {
        console.error("Database Connection Error:", err);
        res.status(500).json({ error: 'Database Connection Error' });
    }
});

// Endpoint to manually simulate data change and trigger WebSocket updates
router.post('api/traffic/simulateTrackingChange', async (req, res) => {
    try {
        const [updatedTrackings] = await DB.query('SELECT * FROM trackings');

        if (global.wsClients) {
            global.wsClients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(updatedTrackings));
                }
            });
        }
        res.status(200).json({ message: 'Simulated tracking change broadcasted to clients.' });
    } catch (err) {
        console.error("Error in simulateTrackingChange:", err);
        res.status(500).json({ error: 'Failed to simulate tracking change' });
    }
});

module.exports = router;
