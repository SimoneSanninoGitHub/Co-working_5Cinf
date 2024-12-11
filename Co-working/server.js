// Importazione delle librerie necessarie
require('dotenv').config(); // Carica le variabili d'ambiente dal file .env
const express = require('express'); // Framework per creare il server
const { Pool } = require('pg'); // Libreria per connettersi a PostgreSQL
const path = require('path'); // Per gestire i percorsi dei file statici

// Inizializzazione dell'applicazione Express
const app = express();

// Configurazione del database PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test della connessione al database
pool.connect()
    .then(() => console.log('Connesso al database PostgreSQL!'))
    .catch((err) => console.error('Errore di connessione al database:', err));

// Middleware per gestire i dati in formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servire file statici (HTML, CSS, JS) dalla cartella "public"
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint API per ottenere tutti gli spazi di lavoro dal database
app.get('/api/spaces', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM coworking_spaces');
        res.json(result.rows);
    } catch (err) {
        console.error('Errore nel recupero degli spazi di lavoro:', err);
        res.status(500).json({ error: 'Errore durante il recupero degli spazi di lavoro' });
    }
});

// Endpoint API per aggiungere un nuovo spazio di lavoro
app.post('/api/spaces', async (req, res) => {
    const { name, location, capacity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO coworking_spaces (name, location, capacity) VALUES ($1, $2, $3) RETURNING *',
            [name, location, capacity]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Errore durante l\'aggiunta di uno spazio di lavoro:', err);
        res.status(500).json({ error: 'Errore durante l\'aggiunta dello spazio di lavoro' });
    }
});

// Endpoint API per eliminare uno spazio di lavoro
app.delete('/api/spaces/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM coworking_spaces WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Errore durante l\'eliminazione dello spazio di lavoro:', err);
        res.status(500).json({ error: 'Errore durante l\'eliminazione dello spazio di lavoro' });
    }
});

// Configurazione della porta
const PORT = process.env.PORT || 3000;

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});
