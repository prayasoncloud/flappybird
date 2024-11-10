const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'yourdatabase'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Route to serve the index.html file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to save a new score
app.post('/submit-score', (req, res) => {
    const { username, score } = req.body;
    if (!username || !score) {
        return res.status(400).send({ message: 'Username and score are required' });
    }

    const query = 'INSERT INTO scores (username, score) VALUES (?, ?)';
    db.query(query, [username, score], (err, result) => {
        if (err) {
            console.error('Error inserting score:', err);
            return res.status(500).send({ message: 'Database error' });
        }
        res.status(201).send({ message: 'Score saved successfully' });
    });
});

// Route to fetch leaderboard data
app.get('/leaderboard', (req, res) => {
    const query = 'SELECT username, score FROM scores ORDER BY score DESC LIMIT 10';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching leaderboard:', err);
            return res.status(500).send({ message: 'Database error' });
        }
        res.send(results);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

