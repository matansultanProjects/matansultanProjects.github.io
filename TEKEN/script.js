const player = document.getElementById('player');
const computer = document.getElementById('computer');
const playerLife = document.getElementById('player-life');
const computerLife = document.getElementById('computer-life');
const bulletCountDisplay = document.getElementById('bullet-count');

let playerLifeValue = 100;
let computerLifeValue = 100;
let playerPosition = 50;
let playerBullets = 10;
let isJumping = false;
let currentLevel = 1;
let opponents = [
    { name: 'Shadow Bot', speed: 2000, bullets: 5, image: 'https://discourse.disneyheroesgame.com/uploads/default/original/3X/f/0/f0f02f2fef99390c43fe5c9d55442d89012fe2ff.gif' },
    { name: 'Steel Strike', speed: 1800, bullets: 7, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwA0arxER622ApCaLW4H-xxIaBfmHkY4J83Q&s' },
    { name: 'Inferno Blaze', speed: 1500, bullets: 9, image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2405e910-090b-45f2-bcdc-63329b446d3a/dazozv4-f3ccf332-2aff-4e7b-984c-0caf42e7f190.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI0MDVlOTEwLTA5MGItNDVmMi1iY2RjLTYzMzI5YjQ0NmQzYVwvZGF6b3p2NC1mM2NjZjMzMi0yYWZmLTRlN2ItOTg0Yy0wY2FmNDJlN2YxOTAuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.WAtw-2wUplA6BJ7hdfztiW0JUbUmO4dfNYSweUrJlUk' },
    { name: 'Cyber Fury', speed: 1200, bullets: 12, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDkOZ2IR-7x2a4vi-Cs_KBMXn1reqo0tCUeg&s' },
    { name: 'Terminus Reaper', speed: 1000, bullets: 15, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjRe1fFHckDb6T-i72Nzic3AfFvnw2ZTAEYg&s' }
];

let currentOpponent = opponents[currentLevel - 1];
showIntroAnimation(currentOpponent.name);
updateEnemyImage(currentOpponent.image);
let shootingInterval = startShooting();

// Replenish bullets every 30 seconds
setInterval(() => {
    playerBullets = Math.min(playerBullets + 10, 30);
    updateBulletCount();
}, 30000);

// Heal the player by 10% every 60 seconds
setInterval(() => {
    playerLifeValue = Math.min(playerLifeValue + 10, 100);
    playerLife.style.width = `${playerLifeValue}%`;
}, 60000);

// Listen for player actions: movement and jumping
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            movePlayer(-10);
            break;
        case 'ArrowRight':
            movePlayer(10);
            break;
        case ' ':
            jump();
            break;
    }
});

// Click to shoot bullets
document.addEventListener('click', () => {
    if (playerBullets > 0) {
        shootBullet(player, computer, true);
        playerBullets--;
        updateBulletCount();
    }
});

// Move player function
function movePlayer(distance) {
    playerPosition += distance;
    if (playerPosition < 0) playerPosition = 0;
    if (playerPosition > 720) playerPosition = 720;
    player.style.left = playerPosition + 'px';
}

// Function to update the bullet count display
function updateBulletCount() {
    bulletCountDisplay.textContent = `Bullets: ${playerBullets}`;
}

// Jump function with increased height
function jump() {
    if (!isJumping) {
        isJumping = true;
        player.style.bottom = '350px'; // Jump up
        setTimeout(() => {
            player.style.bottom = '0'; // Fall back down
            isJumping = false;
        }, 300);
    }
}

// Start shooting with increasing difficulty
function startShooting() {
    let shootingInterval = setInterval(() => {
        for (let i = 0; i < currentOpponent.bullets; i++) {
            setTimeout(() => shootBullet(computer, player, false), i * 400);
        }
    }, currentOpponent.speed);
    return shootingInterval;
}

// Function to create and animate bullets
function shootBullet(shooter, target, isPlayer) {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.bottom = `${shooter === player ? 100 : 100}px`;

    if (isPlayer) {
        bullet.style.left = `${player.offsetLeft + 80}px`;
        bullet.style.transition = 'left 1s linear';
        document.querySelector('.game-container').appendChild(bullet);

        setTimeout(() => {
            bullet.style.left = `${computer.offsetLeft}px`;
            bullet.addEventListener('transitionend', () => {
                checkHit(bullet, computer, isPlayer);
            });
        }, 10);
    } else {
        bullet.style.left = `${computer.offsetLeft}px`;
        bullet.style.transition = 'left 1s linear';
        document.querySelector('.game-container').appendChild(bullet);

        setTimeout(() => {
            bullet.style.left = `${player.offsetLeft}px`;
            bullet.addEventListener('transitionend', () => {
                checkHit(bullet, player, isPlayer);
            });
        }, 10);
    }
}

// Function to check if a bullet hits a target
function checkHit(bullet, target, isPlayer) {
    const bulletRect = bullet.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    if (
        bulletRect.left < targetRect.right &&
        bulletRect.right > targetRect.left &&
        bulletRect.bottom > targetRect.top &&
        bulletRect.top < targetRect.bottom
    ) {
        document.querySelector('.game-container').removeChild(bullet);
        if (isPlayer) {
            computerLifeValue -= 10;
            computerLife.style.width = `${computerLifeValue}%`;
            if (computerLifeValue <= 0) advanceLevel();
        } else {
            if (!isJumping) {
                playerLifeValue -= 10;
                playerLife.style.width = `${playerLifeValue}%`;
                if (playerLifeValue <= 0) showGameOver();
            }
        }
    } else {
        if (bullet.parentElement) {
            bullet.parentElement.removeChild(bullet);
        }
    }
}

// Function to handle level progression
function advanceLevel() {
    clearInterval(shootingInterval);
    currentLevel++;
    if (currentLevel > opponents.length) {
        showKOAnimation(true);
    } else {
        currentOpponent = opponents[currentLevel - 1];
        computerLifeValue = 100;
        computerLife.style.width = '100%';
        showIntroAnimation(currentOpponent.name);
        updateEnemyImage(currentOpponent.image);
        shootingInterval = startShooting();
    }
}

// Function to update the enemy's image
function updateEnemyImage(imageUrl) {
    computer.style.background = `url('${imageUrl}') no-repeat center/cover`;
}

// Function to show the opponent intro animation
function showIntroAnimation(opponentName) {
    const intro = document.createElement('div');
    intro.classList.add('intro-animation');
    intro.textContent = `Level ${currentLevel} - ${opponentName}`;
    document.body.appendChild(intro);
    setTimeout(() => {
        intro.classList.add('show');
        setTimeout(() => intro.classList.remove('show'), 3000);
        setTimeout(() => document.body.removeChild(intro), 4000);
    }, 100);
}

// Function to display KO animation
function showKOAnimation(win = false) {
    const koMessage = document.createElement('div');
    koMessage.classList.add('ko-message');
    koMessage.textContent = win ? 'Congratulations! KO!' : 'KO!';
    document.body.appendChild(koMessage);
    setTimeout(() => {
        koMessage.classList.add('show');
        setTimeout(() => document.body.removeChild(koMessage), 3000);
        resetGame();
    }, 100);
}

// Function to show the Game Over screen with KO message and Play Again button
function showGameOver() {
    const gameOverMessage = document.createElement('div');
    gameOverMessage.classList.add('game-over');
    gameOverMessage.textContent = 'GAME OVER\nKO!';
    document.body.appendChild(gameOverMessage);

    // Show Play Again button after 30 seconds
    setTimeout(() => {
        const playAgainButton = document.createElement('button');
        playAgainButton.classList.add('play-again');
        playAgainButton.textContent = 'Play Again';
        playAgainButton.onclick = resetGame;
        document.body.appendChild(playAgainButton);
        playAgainButton.classList.add('show');
    }, 30000);
}

// Reset the game to start over
function resetGame() {
    playerLifeValue = 100;
    computerLifeValue = 100;
    playerBullets = 10;
    playerLife.style.width = '100%';
    computerLife.style.width = '100%';
    playerPosition = 50;
    player.style.left = playerPosition + 'px';
    currentLevel = 1;
    currentOpponent = opponents[currentLevel - 1];
    showIntroAnimation(currentOpponent.name);
    updateEnemyImage(currentOpponent.image);
    updateBulletCount();
    clearInterval(shootingInterval);
    shootingInterval = startShooting();

    // Remove Game Over and Play Again elements if they exist
    const gameOverMessage = document.querySelector('.game-over');
    const playAgainButton = document.querySelector('.play-again');
    if (gameOverMessage) document.body.removeChild(gameOverMessage);
    if (playAgainButton) document.body.removeChild(playAgainButton);
}
