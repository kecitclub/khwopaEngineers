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


router.get('/trackings', async (req, res) => {
    try {
        const [rows] = await DB.query('SELECT * FROM trackings'); // Simple query to check connection
        res.json(rows);
    } catch (err) {
        console.error("Database Connection Error:", err);
        res.status(500).json({ error: 'Database Connection Error' });
    }
});

router.get('/logs', async (req, res) => {
    const { number_plate } = req.body;
    console.log(req.body);

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


module.exports = router;
