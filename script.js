const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake1 = [{ x: 10, y: 10 }];
let snake2 = [{ x: 30, y: 10 }]; // Second snake
let food = {};
let direction1 = 'right';
let direction2 = 'left'; // Initial direction for second snake
let score1 = 0;
let score2 = 0;
let gameOver = false;
let gameInterval;

const score1Display = document.getElementById('score1');
const score2Display = document.getElementById('score2');

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Snake 1
    ctx.fillStyle = 'green';
    snake1.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw Snake 2
    ctx.fillStyle = 'blue';
    snake2.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw Food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
    if (gameOver) return;

    // Update Snake 1
    const head1 = { x: snake1[0].x, y: snake1[0].y };
    switch (direction1) {
        case 'up': head1.y--; break;
        case 'down': head1.y++; break;
        case 'left': head1.x--; break;
        case 'right': head1.x++; break;
    }

    // Update Snake 2
    const head2 = { x: snake2[0].x, y: snake2[0].y };
    switch (direction2) {
        case 'up': head2.y--; break;
        case 'down': head2.y++; break;
        case 'left': head2.x--; break;
        case 'right': head2.x++; break;
    }

    // Check for collisions for Snake 1
    if (head1.x < 0 || head1.x >= canvas.width / gridSize ||
        head1.y < 0 || head1.y >= canvas.height / gridSize ||
        checkCollision(head1, snake1.slice(1)) ||
        checkCollision(head1, snake2)) { // Collision with other snake
        gameOver = true;
        clearInterval(gameInterval);
        alert('Game Over! Player 2 Wins!');
        return;
    }

    // Check for collisions for Snake 2
    if (head2.x < 0 || head2.x >= canvas.width / gridSize ||
        head2.y < 0 || head2.y >= canvas.height / gridSize ||
        checkCollision(head2, snake2.slice(1)) ||
        checkCollision(head2, snake1)) { // Collision with other snake
        gameOver = true;
        clearInterval(gameInterval);
        alert('Game Over! Player 1 Wins!');
        return;
    }

    snake1.unshift(head1);
    snake2.unshift(head2);

    // Check if Snake 1 eats food
    if (head1.x === food.x && head1.y === food.y) {
        score1++;
        score1Display.textContent = `Player 1: ${score1}`;
        generateFood();
    } else {
        snake1.pop();
    }

    // Check if Snake 2 eats food
    if (head2.x === food.x && head2.y === food.y) {
        score2++;
        score2Display.textContent = `Player 2: ${score2}`;
        generateFood();
    } else {
        snake2.pop();
    }

    draw();
}

function checkCollision(head, array) {
    return array.some(segment => segment.x === head.x && segment.y === head.y);
}

document.addEventListener('keydown', e => {
    // Player 1 controls (WASD)
    if (e.key === 'w' && direction1 !== 'down') direction1 = 'up';
    if (e.key === 's' && direction1 !== 'up') direction1 = 'down';
    if (e.key === 'a' && direction1 !== 'right') direction1 = 'left';
    if (e.key === 'd' && direction1 !== 'left') direction1 = 'right';

    // Player 2 controls (Arrow Keys)
    if (e.key === 'ArrowUp' && direction2 !== 'down') direction2 = 'up';
    if (e.key === 'ArrowDown' && direction2 !== 'up') direction2 = 'down';
    if (e.key === 'ArrowLeft' && direction2 !== 'right') direction2 = 'left';
    if (e.key === 'ArrowRight' && direction2 !== 'left') direction2 = 'right';
});

function startGame() {
    snake1 = [{ x: 10, y: 10 }];
    snake2 = [{ x: 30, y: 10 }];
    direction1 = 'right';
    direction2 = 'left';
    score1 = 0;
    score2 = 0;
    gameOver = false;
    score1Display.textContent = `Player 1: ${score1}`;
    score2Display.textContent = `Player 2: ${score2}`;
    generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(update, 100);
}

startGame();