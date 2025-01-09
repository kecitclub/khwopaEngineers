const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const routes = require('./routes.js');

dotenv.config();

const DB = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use('/api/traffic', routes);

const startServer = async () => {
    try {
        // Await the connection check to ensure it's connected
        const [rows, fields] = await DB.query('SELECT 1'); // Simple query to check connection
        console.log(`Database Connected`);

        app.listen(PORT, () => {
            console.log(`Server Started on port ${PORT}`);
        });
    } catch (err) {
        console.error("Database Connection Error:", err);
    }
};

startServer();
