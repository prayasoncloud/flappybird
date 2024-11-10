import FlappyBirdScene from './js/FlappyBirdScene.js';

window.onload = function() {
    var config = {
        type: Phaser.AUTO,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 600
                },
                debug: false
            }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            width: 288,
            height: 512
        },
        scene: [FlappyBirdScene]
    };

    var game = new Phaser.Game(config);
};

// ==================== NEW CODE STARTS HERE ====================

// Replace 'http://your-ec2-ip:3000' with your actual EC2 server IP address.
const BASE_URL = 'http://your-ec2-ip:3000';

// Function to submit the score to the backend server
function submitScore(username, score) {
    fetch(`${BASE_URL}/submit-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, score })
    })
    .then(response => response.json())
    .then(data => console.log('Score submitted:', data.message))
    .catch(error => console.error('Error submitting score:', error));
}

// Function to fetch the leaderboard
function getLeaderboard() {
    fetch(`${BASE_URL}/leaderboard`)
        .then(response => response.json())
        .then(data => {
            console.log('Leaderboard:', data);
            // Display leaderboard in your game (You can modify this part as needed)
            const leaderboardElement = document.getElementById('leaderboard');
            leaderboardElement.innerHTML = '';
            data.forEach((entry, index) => {
                leaderboardElement.innerHTML += `<p>${index + 1}. ${entry.username}: ${entry.score}</p>`;
            });
        })
        .catch(error => console.error('Error fetching leaderboard:', error));
}

// ==================== NEW CODE ENDS HERE ====================

// Example usage after the game ends
function gameOver(score) {
    const username = prompt("Enter your name:");
    submitScore(username, score);
    getLeaderboard();
}

