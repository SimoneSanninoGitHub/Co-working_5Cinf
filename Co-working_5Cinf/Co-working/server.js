require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// Configurazione del database
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: Aggiungere una prenotazione
app.post('/api/booking', async (req, res) => {
    const { spaceId, userId, date } = req.body;

    if (!spaceId || !userId || !date) {
        return res.status(400).json({ error: 'Tutti i campi sono obbligatori: spaceId, userId, date.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO bookings (space_id, user_id, booking_date) VALUES ($1, $2, $3) RETURNING *',
            [spaceId, userId, date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Errore durante la prenotazione:', err.message);
        res.status(500).json({ error: 'Errore durante la prenotazione dello spazio di lavoro.' });
    }
});

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});
