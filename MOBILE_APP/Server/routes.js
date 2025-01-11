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

router.post('/auth/login', async (req, res) => {
    const { station_id, passkey } = req.body;

    if (!station_id || !passkey) {
        return res.status(400).json({
            message: 'Station ID and passkey required'
        });
    }

    try {
        const [stations] = await DB.query(
            'SELECT * FROM users WHERE username = ?',
            [station_id]
        );

        if (stations.length === 0) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const station = stations[0];
        const isValid = passkey === 'Test@123';

        if (!isValid) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        res.json({
            message: 'Login successful',
            station_id: station.username
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/traffic/trackings', async (req, res) => {
    try {
        const [rows] = await DB.query('SELECT * FROM trackings');
        res.json(rows);
    } catch (err) {
        console.error("Database Connection Error:", err);
        res.status(500).json({ error: 'Database Connection Error' });
    }
});

router.get('/traffic/logs', async (req, res) => {
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
router.post('/traffic/simulateTrackingChange', async (req, res) => {
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

router.post('/traffic/acknowledge-alert', async (req, res) => {
    const { station_id, number_plate } = req.body;

    try {
        await DB.query(
            'UPDATE alerts SET is_acknowledged = TRUE WHERE station_id = ? AND number_plate = ?',
            [station_id, number_plate]
        );
        res.json({ message: 'Alert acknowledged successfully' });
    } catch (err) {
        console.error("Error acknowledging alert:", err);
        res.status(500).json({ error: 'Failed to acknowledge alert' });
    }
});

module.exports = router;
