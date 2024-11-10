const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'flappy_bird'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

app.use(express.json());

app.post('/submit-score', (req, res) => {
    const { username, score } = req.body;
    db.query('INSERT INTO scores (username, score) VALUES (?, ?)', [username, score], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Score saved!' });
    });
});

app.get('/leaderboard', (req, res) => {
    db.query('SELECT * FROM scores ORDER BY score DESC LIMIT 10', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));

