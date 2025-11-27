// ===== GAME STATE =====
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = null; // 'pvp' or 'pvc'
let difficulty = null; // 'easy', 'medium', 'impossible'
let isComputerTurn = false;
let scores = {
    X: 0,
    O: 0
};

// ===== WINNING COMBINATIONS =====
const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// ===== DOM ELEMENTS =====
const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const currentModeDisplay = document.getElementById('currentMode');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const labelX = document.getElementById('labelX');
const labelO = document.getElementById('labelO');
const resetBtn = document.getElementById('resetBtn');
const changeModeBtn = document.getElementById('changeModeBtn');
const clearScoreBtn = document.getElementById('clearScoreBtn');
const messageOverlay = document.getElementById('messageOverlay');
const messageTitle = document.getElementById('messageTitle');
const messageText = document.getElementById('messageText');
const playAgainBtn = document.getElementById('playAgainBtn');
const modeSelectionOverlay = document.getElementById('modeSelectionOverlay');
const pvpModeBtn = document.getElementById('pvpMode');
const pvcModeBtn = document.getElementById('pvcMode');
const difficultySelectionOverlay = document.getElementById('difficultySelectionOverlay');
const easyDifficultyBtn = document.getElementById('easyDifficulty');
const mediumDifficultyBtn = document.getElementById('mediumDifficulty');
const impossibleDifficultyBtn = document.getElementById('impossibleDifficulty');
const backToDifficultyBtn = document.getElementById('backToDifficulty');

// ===== INITIALIZE GAME =====
function initGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetBtn.addEventListener('click', resetGame);
    changeModeBtn.addEventListener('click', showModeSelection);
    clearScoreBtn.addEventListener('click', clearScores);
    playAgainBtn.addEventListener('click', () => {
        hideMessage();
        resetGame();
    });

    pvpModeBtn.addEventListener('click', () => selectMode('pvp'));
    pvcModeBtn.addEventListener('click', showDifficultySelection);

    easyDifficultyBtn.addEventListener('click', () => selectDifficulty('easy'));
    mediumDifficultyBtn.addEventListener('click', () => selectDifficulty('medium'));
    impossibleDifficultyBtn.addEventListener('click', () => selectDifficulty('impossible'));
    backToDifficultyBtn.addEventListener('click', () => {
        hideDifficultySelection();
        showModeSelection();
    });

    loadScores();
    updateScoreDisplay();
}

// ===== MODE SELECTION =====
function selectMode(mode) {
    gameMode = mode;
    hideModeSelection();

    if (mode === 'pvp') {
        currentModeDisplay.textContent = '1v1';
        labelX.textContent = 'Player X';
        labelO.textContent = 'Player O';
        difficulty = null;
    } else {
        const difficultyText = difficulty === 'easy' ? 'Easy' : difficulty === 'medium' ? 'Medium' : 'Impossible';
        currentModeDisplay.textContent = `vs AI (${difficultyText})`;
        labelX.textContent = 'You (X)';
        labelO.textContent = 'Computer';
    }

    resetGame();
}

function showModeSelection() {
    modeSelectionOverlay.classList.add('active');
    gameActive = false;
}

function hideModeSelection() {
    modeSelectionOverlay.classList.remove('active');
}

// ===== DIFFICULTY SELECTION =====
function showDifficultySelection() {
    hideModeSelection();
    difficultySelectionOverlay.classList.add('active');
    gameActive = false;
}

function hideDifficultySelection() {
    difficultySelectionOverlay.classList.remove('active');
}

function selectDifficulty(level) {
    difficulty = level;
    hideDifficultySelection();
    selectMode('pvc');
}

// ===== HANDLE CELL CLICK =====
function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));

    // Check if cell is already taken, game is not active, or it's computer's turn
    if (gameBoard[index] !== '' || !gameActive || isComputerTurn) {
        return;
    }

    // Update game state
    makeMove(index, currentPlayer);

    // Check for win or draw
    if (checkWin()) {
        handleWin();
    } else if (checkDraw()) {
        handleDraw();
    } else {
        switchPlayer();

        // If playing against computer and it's O's turn, trigger computer move
        if (gameMode === 'pvc' && currentPlayer === 'O') {
            isComputerTurn = true;
            setTimeout(computerMove, 600); // Delay for more natural feel
        }
    }
}

// ===== MAKE MOVE =====
function makeMove(index, player) {
    gameBoard[index] = player;
    const cell = cells[index];
    cell.textContent = player;
    cell.classList.add('taken', player.toLowerCase());

    // Add pop-in animation
    cell.style.animation = 'none';
    setTimeout(() => {
        cell.style.animation = '';
    }, 10);
}

// ===== COMPUTER MOVE (AI) =====
function computerMove() {
    if (!gameActive) {
        isComputerTurn = false;
        return;
    }

    const move = getBestMove();
    makeMove(move, 'O');

    isComputerTurn = false;

    // Check for win or draw
    if (checkWin()) {
        handleWin();
    } else if (checkDraw()) {
        handleDraw();
    } else {
        switchPlayer();
    }
}

// ===== AI LOGIC - GET BEST MOVE =====
function getBestMove() {
    if (difficulty === 'easy') {
        return getEasyMove();
    } else if (difficulty === 'medium') {
        return getMediumMove();
    } else {
        return getImpossibleMove();
    }
}

// ===== EASY AI - Mostly Random =====
function getEasyMove() {
    // 70% chance of random move, 30% chance of smart move
    if (Math.random() < 0.7) {
        const availableCells = gameBoard.map((cell, index) => cell === '' ? index : null).filter(i => i !== null);
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    } else {
        return getMediumMove();
    }
}

// ===== MEDIUM AI - Heuristic Strategy =====
function getMediumMove() {
    // 1. Check if computer can win
    const winMove = findWinningMove('O');
    if (winMove !== -1) return winMove;

    // 2. Block player from winning
    const blockMove = findWinningMove('X');
    if (blockMove !== -1) return blockMove;

    // 3. Take center if available
    if (gameBoard[4] === '') return 4;

    // 4. Take a corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameBoard[i] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // 5. Take any available edge
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(i => gameBoard[i] === '');
    if (availableEdges.length > 0) {
        return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    // Fallback: take any available cell
    const availableCells = gameBoard.map((cell, index) => cell === '' ? index : null).filter(i => i !== null);
    return availableCells[0];
}

// ===== IMPOSSIBLE AI - Minimax Algorithm =====
function getImpossibleMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

// ===== MINIMAX ALGORITHM =====
function minimax(board, depth, isMaximizing) {
    // Check terminal states
    const winner = checkWinnerForMinimax(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// ===== CHECK WINNER FOR MINIMAX =====
function checkWinnerForMinimax(board) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// ===== FIND WINNING MOVE =====
function findWinningMove(player) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        const values = [gameBoard[a], gameBoard[b], gameBoard[c]];

        // Check if two cells have the player's mark and one is empty
        if (values.filter(v => v === player).length === 2 && values.includes('')) {
            if (gameBoard[a] === '') return a;
            if (gameBoard[b] === '') return b;
            if (gameBoard[c] === '') return c;
        }
    }
    return -1;
}

// ===== CHECK FOR WIN =====
function checkWin() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            highlightWinningCells(combination);
            return true;
        }
        return false;
    });
}

// ===== HIGHLIGHT WINNING CELLS =====
function highlightWinningCells(combination) {
    combination.forEach(index => {
        cells[index].classList.add('winner');
    });
}

// ===== CHECK FOR DRAW =====
function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

// ===== HANDLE WIN =====
function handleWin() {
    gameActive = false;
    scores[currentPlayer]++;
    saveScores();
    updateScoreDisplay();

    setTimeout(() => {
        let winnerName = currentPlayer;
        if (gameMode === 'pvc') {
            winnerName = currentPlayer === 'X' ? 'You' : 'Computer';
        } else {
            winnerName = `Player ${currentPlayer}`;
        }

        showMessage(
            `${winnerName} Win${currentPlayer === 'X' && gameMode === 'pvc' ? '' : 's'}! 🎉`,
            `Congratulations! ${winnerName} ${currentPlayer === 'X' && gameMode === 'pvc' ? 'win' : 'wins'} this round.`
        );
    }, 500);
}

// ===== HANDLE DRAW =====
function handleDraw() {
    gameActive = false;

    setTimeout(() => {
        showMessage(
            "It's a Draw! 🤝",
            "Well played! No one wins this round."
        );
    }, 300);
}

// ===== SWITCH PLAYER =====
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateCurrentPlayerDisplay();
}

// ===== UPDATE CURRENT PLAYER DISPLAY =====
function updateCurrentPlayerDisplay() {
    if (gameMode === 'pvc' && currentPlayer === 'O') {
        currentPlayerDisplay.textContent = '🤖';
    } else {
        currentPlayerDisplay.textContent = currentPlayer;
    }

    currentPlayerDisplay.style.animation = 'none';
    setTimeout(() => {
        currentPlayerDisplay.style.animation = '';
    }, 10);
}

// ===== SHOW MESSAGE =====
function showMessage(title, text) {
    messageTitle.textContent = title;
    messageText.textContent = text;
    messageOverlay.classList.add('active');
}

// ===== HIDE MESSAGE =====
function hideMessage() {
    messageOverlay.classList.remove('active');
}

// ===== RESET GAME =====
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    isComputerTurn = false;
    updateCurrentPlayerDisplay();

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o', 'winner');
    });
}

// ===== CLEAR SCORES =====
function clearScores() {
    scores.X = 0;
    scores.O = 0;
    saveScores();
    updateScoreDisplay();
}

// ===== UPDATE SCORE DISPLAY =====
function updateScoreDisplay() {
    scoreXDisplay.textContent = scores.X;
    scoreODisplay.textContent = scores.O;

    // Add animation to score update
    scoreXDisplay.style.animation = 'none';
    scoreODisplay.style.animation = 'none';
    setTimeout(() => {
        scoreXDisplay.style.animation = '';
        scoreODisplay.style.animation = '';
    }, 10);
}

// ===== SAVE SCORES TO LOCAL STORAGE =====
function saveScores() {
    localStorage.setItem('tictactoe-scores', JSON.stringify(scores));
}

// ===== LOAD SCORES FROM LOCAL STORAGE =====
function loadScores() {
    const savedScores = localStorage.getItem('tictactoe-scores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
    }
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener('keydown', (event) => {
    // Press 'R' to reset game
    if (event.key.toLowerCase() === 'r' && !messageOverlay.classList.contains('active') && gameMode) {
        resetGame();
    }

    // Press 'Escape' to close message overlay or mode selection
    if (event.key === 'Escape') {
        if (messageOverlay.classList.contains('active')) {
            hideMessage();
            resetGame();
        } else if (modeSelectionOverlay.classList.contains('active')) {
            hideModeSelection();
        }
    }

    // Press number keys 1-9 to select cells
    const num = parseInt(event.key);
    if (num >= 1 && num <= 9 && gameActive && gameMode && !isComputerTurn) {
        const index = num - 1;
        const cell = cells[index];
        if (gameBoard[index] === '') {
            cell.click();
        }
    }
});

// ===== START GAME =====
initGame();
