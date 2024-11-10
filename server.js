const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword', // Update with your actual password
    database: 'flappy_bird'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for serving the main game page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle score submissions
app.post('/submit-score', (req, res) => {
    const { username, score } = req.body;
    if (!username || !score) {
        return res.status(400).send({ message: 'Username and score are required' });
    }
    db.query('INSERT INTO scores (username, score) VALUES (?, ?)', [username, score], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Score saved!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
