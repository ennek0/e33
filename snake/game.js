// Game Configuration
const LEVEL_CONFIGS = {
    1: { gridSize: 15, tileSize: 40, canvasSize: 600 },
    2: { gridSize: 20, tileSize: 30, canvasSize: 600 },
    3: { gridSize: 25, tileSize: 24, canvasSize: 600 }
};

const CONFIG = {
    gridSize: 20,
    tileSize: 30,
    initialSpeed: 150,
    speedIncrease: 5,
    minSpeed: 50
};

// Game State
const gameState = {
    snake: [],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 0, y: 0 },
    score: 0,
    highScore: 0,
    isPlaying: false,
    isPaused: false,
    gameSpeed: CONFIG.initialSpeed,
    lastUpdateTime: 0,
    currentLevel: 2
};

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const overlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const explosionOverlay = document.getElementById('explosionOverlay');
const simTimeElement = document.getElementById('simTime');
const gameTimeElement = document.getElementById('gameTime');

// Time tracking
let gameStartTime = 0;
let elapsedTime = 0;

// Load Images
const packetTracerLogo = new Image();
const switchImage = new Image();
let imagesLoaded = 0;

packetTracerLogo.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) initGame();
};

switchImage.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) initGame();
};

// Update image paths to use relative paths
packetTracerLogo.src = 'packet tracer.png';
switchImage.src = 'switch.jpg';

// Initialize Game
function initGame() {
    // Load high score from localStorage
    gameState.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
    highScoreElement.textContent = gameState.highScore;

    // Apply level configuration
    applyLevelConfig(gameState.currentLevel);

    // Initialize snake
    resetSnake();

    // Spawn initial food
    spawnFood();

    // Draw initial state
    draw();

    // Show start overlay
    showOverlay('Network Snake', 'Press SPACE to start');
}

// Apply Level Configuration
function applyLevelConfig(level) {
    const levelConfig = LEVEL_CONFIGS[level];
    CONFIG.gridSize = levelConfig.gridSize;
    CONFIG.tileSize = levelConfig.tileSize;
    canvas.width = levelConfig.canvasSize;
    canvas.height = levelConfig.canvasSize;
}

// Reset Snake
function resetSnake() {
    gameState.snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    gameState.direction = { x: 1, y: 0 };
    gameState.nextDirection = { x: 1, y: 0 };
    gameState.score = 0;
    gameState.gameSpeed = CONFIG.initialSpeed;
    scoreElement.textContent = gameState.score;
}

// Spawn Food
function spawnFood() {
    let validPosition = false;

    while (!validPosition) {
        gameState.food = {
            x: Math.floor(Math.random() * CONFIG.gridSize),
            y: Math.floor(Math.random() * CONFIG.gridSize)
        };

        // Check if food spawns on snake
        validPosition = !gameState.snake.some(segment =>
            segment.x === gameState.food.x && segment.y === gameState.food.y
        );
    }
}

// Game Loop
let animationId;

function gameLoop(currentTime) {
    if (!gameState.isPlaying || gameState.isPaused) {
        return;
    }

    // Update elapsed time
    if (gameStartTime === 0) {
        gameStartTime = currentTime;
    }
    elapsedTime = Math.floor((currentTime - gameStartTime) / 1000);
    updateTimeDisplays();

    const deltaTime = currentTime - gameState.lastUpdateTime;

    if (deltaTime >= gameState.gameSpeed) {
        update();
        draw(); // Draw only on update for step-based movement
        // Update time after processing to maintain consistent timing
        gameState.lastUpdateTime = currentTime - (deltaTime % gameState.gameSpeed);
    }

    animationId = requestAnimationFrame(gameLoop);
}

// Format time as HH:MM:SS
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update time displays
function updateTimeDisplays() {
    if (simTimeElement) {
        simTimeElement.textContent = formatTime(elapsedTime);
    }
    if (gameTimeElement) {
        gameTimeElement.textContent = formatTime(elapsedTime);
    }
}

// Update Game State
function update() {
    // Update direction
    gameState.direction = { ...gameState.nextDirection };

    // Calculate new head position
    const head = { ...gameState.snake[0] };
    head.x += gameState.direction.x;
    head.y += gameState.direction.y;

    // Check wall collision
    if (head.x < 0 || head.x >= CONFIG.gridSize || head.y < 0 || head.y >= CONFIG.gridSize) {
        gameOver();
        return;
    }

    // Check self collision
    if (gameState.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Add new head
    gameState.snake.unshift(head);

    // Check food collision
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        // Increase score
        gameState.score++;
        scoreElement.textContent = gameState.score;
        scoreElement.parentElement.classList.add('pulse');
        setTimeout(() => scoreElement.parentElement.classList.remove('pulse'), 300);

        // Update high score
        if (gameState.score > gameState.highScore) {
            gameState.highScore = gameState.score;
            highScoreElement.textContent = gameState.highScore;
            localStorage.setItem('snakeHighScore', gameState.highScore);
        }

        // Increase speed
        if (gameState.gameSpeed > CONFIG.minSpeed) {
            gameState.gameSpeed = Math.max(CONFIG.minSpeed, gameState.gameSpeed - CONFIG.speedIncrease);
        }

        // Spawn new food
        spawnFood();
    } else {
        // Remove tail if no food eaten
        gameState.snake.pop();
    }
}

// Draw Game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CONFIG.gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CONFIG.tileSize, 0);
        ctx.lineTo(i * CONFIG.tileSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * CONFIG.tileSize);
        ctx.lineTo(canvas.width, i * CONFIG.tileSize);
        ctx.stroke();
    }

    // Draw snake body (classic green rectangles)
    for (let i = 1; i < gameState.snake.length; i++) {
        const segment = gameState.snake[i];
        const x = segment.x * CONFIG.tileSize;
        const y = segment.y * CONFIG.tileSize;

        // Classic green snake body
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(x + 2, y + 2, CONFIG.tileSize - 4, CONFIG.tileSize - 4);

        // Dark border for definition
        ctx.strokeStyle = '#008800';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, CONFIG.tileSize - 4, CONFIG.tileSize - 4);
    }

    // Draw snake head (Packet Tracer logo)
    if (gameState.snake.length > 0) {
        const head = gameState.snake[0];
        const x = head.x * CONFIG.tileSize;
        const y = head.y * CONFIG.tileSize;

        ctx.drawImage(packetTracerLogo, x + 2, y + 2, CONFIG.tileSize - 4, CONFIG.tileSize - 4);
    }

    // Draw food (Network Switch)
    const foodX = gameState.food.x * CONFIG.tileSize;
    const foodY = gameState.food.y * CONFIG.tileSize;

    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff006e';
    ctx.drawImage(switchImage, foodX + 2, foodY + 2, CONFIG.tileSize - 4, CONFIG.tileSize - 4);
    ctx.restore();
}

// Game Over
function gameOver() {
    gameState.isPlaying = false;
    cancelAnimationFrame(animationId);

    // Show explosion animation
    explosionOverlay.classList.add('active');

    // After explosion animation completes (2 seconds), show game over overlay
    setTimeout(() => {
        explosionOverlay.classList.remove('active');

        // Check if new high score was achieved
        if (gameState.score === gameState.highScore && gameState.score > 0) {
            showOverlay('Successful!', `New Record: ${gameState.score} | Press SPACE to restart`);
        } else {
            showOverlay('Failed!', `Score: ${gameState.score} | Press SPACE to restart`);
        }
    }, 2000);

    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Show Overlay
function showOverlay(title, message) {
    overlayTitle.textContent = title;
    overlayMessage.textContent = message;
    overlay.classList.add('active');
}

// Hide Overlay
function hideOverlay() {
    overlay.classList.remove('active');
}

// Start Game
function startGame() {
    if (gameState.isPlaying) return;

    resetSnake();
    spawnFood();
    gameState.isPlaying = true;
    gameState.isPaused = false;
    gameState.lastUpdateTime = performance.now();

    // Reset timer
    gameStartTime = 0;
    elapsedTime = 0;
    updateTimeDisplays();

    hideOverlay();

    startBtn.disabled = true;
    pauseBtn.disabled = false;

    animationId = requestAnimationFrame(gameLoop);
}

// Pause Game
function pauseGame() {
    if (!gameState.isPlaying) return;

    gameState.isPaused = !gameState.isPaused;

    if (gameState.isPaused) {
        pauseBtn.textContent = 'Resume';
        showOverlay('Paused', 'Press SPACE to resume');
    } else {
        pauseBtn.textContent = 'Pause';
        hideOverlay();
        gameState.lastUpdateTime = performance.now();
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Restart Game
function restartGame() {
    cancelAnimationFrame(animationId);
    gameState.isPlaying = false;
    gameState.isPaused = false;
    resetSnake();
    spawnFood();
    draw();
    showOverlay('Network Snake', 'Press SPACE to start');

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
}

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    // Prevent default arrow key behavior
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }

    // Direction controls
    if (e.key === 'ArrowUp' && gameState.direction.y === 0) {
        gameState.nextDirection = { x: 0, y: -1 };
    } else if (e.key === 'ArrowDown' && gameState.direction.y === 0) {
        gameState.nextDirection = { x: 0, y: 1 };
    } else if (e.key === 'ArrowLeft' && gameState.direction.x === 0) {
        gameState.nextDirection = { x: -1, y: 0 };
    } else if (e.key === 'ArrowRight' && gameState.direction.x === 0) {
        gameState.nextDirection = { x: 1, y: 0 };
    }

    // Space to start/pause
    if (e.key === ' ') {
        if (!gameState.isPlaying) {
            startGame();
        } else {
            pauseGame();
        }
    }
});

// Button Event Listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', restartGame);

// Level Change Function
function changeLevel(level) {
    if (gameState.isPlaying) return; // Don't allow level change during game

    gameState.currentLevel = level;
    applyLevelConfig(level);
    resetSnake();
    spawnFood();
    draw();
}

// Level Select Event Listener
const levelSelect = document.getElementById('levelSelect');
if (levelSelect) {
    levelSelect.addEventListener('change', (e) => {
        changeLevel(parseInt(e.target.value));
    });
}

// Start initialization
// Note: initGame is called by image onload handlers
