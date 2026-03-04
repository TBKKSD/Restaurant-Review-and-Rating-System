const express = require('express');
const { connectMongoDB } = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json())

connectMongoDB();

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await require('./db').mysqlPool.query('SELECT 1 + 1 AS result');
        res.json({ message: 'MySQL is working!', data: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});