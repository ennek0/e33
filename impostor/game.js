// ===== GAME STATE =====
const gameState = {
    players: [],
    currentWord: '',
    impostorIndex: -1,
    impostorSynonym: '',
    readyPlayers: new Set(),
    timerInterval: null,
    timeRemaining: 300, // 5 minutes in seconds
    selectedVote: null
};

// ===== WORD BANK =====
const wordBank = [
    { word: 'Pizza', synonym: 'Italian Food' },
    { word: 'Guitar', synonym: 'Musical Instrument' },
    { word: 'Ocean', synonym: 'Large Body of Water' },
    { word: 'Mountain', synonym: 'High Elevation' },
    { word: 'Coffee', synonym: 'Hot Beverage' },
    { word: 'Basketball', synonym: 'Sports Equipment' },
    { word: 'Airplane', synonym: 'Flying Vehicle' },
    { word: 'Smartphone', synonym: 'Mobile Device' },
    { word: 'Rainbow', synonym: 'Colorful Arc' },
    { word: 'Butterfly', synonym: 'Flying Insect' },
    { word: 'Chocolate', synonym: 'Sweet Treat' },
    { word: 'Fireworks', synonym: 'Explosive Display' },
    { word: 'Sunset', synonym: 'Evening Sky' },
    { word: 'Camera', synonym: 'Photo Device' },
    { word: 'Bicycle', synonym: 'Two-Wheeled Transport' },
    { word: 'Lighthouse', synonym: 'Coastal Tower' },
    { word: 'Telescope', synonym: 'Viewing Instrument' },
    { word: 'Volcano', synonym: 'Erupting Mountain' },
    { word: 'Waterfall', synonym: 'Cascading Water' },
    { word: 'Castle', synonym: 'Medieval Fortress' }
];

// ===== DOM ELEMENTS =====
let setupScreen, cardRevealScreen, gameRoundScreen, votingScreen, resultScreen;
let playerNameInput, addPlayerBtn, startGameBtn, playersListDiv, playerCountDiv, errorMessageDiv;
let cardsContainer, readyCountSpan, totalPlayersSpan, continueBtn;
let timerDisplay, timerProgress, endRoundBtn;
let votingCardsContainer, submitVoteBtn;
let resultIcon, resultTitle, resultMessage, resultActionBtn;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
});

function initializeElements() {
    // Screens
    setupScreen = document.getElementById('setup-screen');
    cardRevealScreen = document.getElementById('card-reveal-screen');
    gameRoundScreen = document.getElementById('game-round-screen');
    votingScreen = document.getElementById('voting-screen');
    resultScreen = document.getElementById('result-screen');

    // Setup Screen
    playerNameInput = document.getElementById('player-name-input');
    addPlayerBtn = document.getElementById('add-player-btn');
    startGameBtn = document.getElementById('start-game-btn');
    playersListDiv = document.getElementById('players-list');
    playerCountDiv = document.getElementById('player-count');
    errorMessageDiv = document.getElementById('error-message');

    // Card Reveal Screen
    cardsContainer = document.getElementById('cards-container');
    readyCountSpan = document.getElementById('ready-count');
    totalPlayersSpan = document.getElementById('total-players');
    continueBtn = document.getElementById('continue-btn');

    // Game Round Screen
    timerDisplay = document.getElementById('timer-display');
    timerProgress = document.getElementById('timer-progress');
    endRoundBtn = document.getElementById('end-round-btn');

    // Voting Screen
    votingCardsContainer = document.getElementById('voting-cards-container');
    submitVoteBtn = document.getElementById('submit-vote-btn');

    // Result Screen
    resultIcon = document.getElementById('result-icon');
    resultTitle = document.getElementById('result-title');
    resultMessage = document.getElementById('result-message');
    resultActionBtn = document.getElementById('result-action-btn');
}

function setupEventListeners() {
    // Setup Screen
    addPlayerBtn.addEventListener('click', addPlayer);
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });
    startGameBtn.addEventListener('click', startGame);

    // Card Reveal Screen
    continueBtn.addEventListener('click', startRound);

    // Game Round Screen
    endRoundBtn.addEventListener('click', endRound);

    // Voting Screen
    submitVoteBtn.addEventListener('click', submitVote);
}

// ===== PLAYER MANAGEMENT =====
function addPlayer() {
    const name = playerNameInput.value.trim();
    errorMessageDiv.textContent = '';

    if (!name) {
        showError('Please enter a player name');
        return;
    }

    if (gameState.players.includes(name)) {
        showError('Player name already exists');
        return;
    }

    if (gameState.players.length >= 25) {
        showError('Maximum 25 players allowed');
        return;
    }

    gameState.players.push(name);
    playerNameInput.value = '';
    updatePlayersList();
    updatePlayerCount();
    checkStartButton();
}

function removePlayer(index) {
    gameState.players.splice(index, 1);
    updatePlayersList();
    updatePlayerCount();
    checkStartButton();
}

function updatePlayersList() {
    playersListDiv.innerHTML = '';
    gameState.players.forEach((player, index) => {
        const tag = document.createElement('div');
        tag.className = 'player-tag';
        tag.innerHTML = `
            <span>${escapeHtml(player)}</span>
            <button class="remove-btn" onclick="removePlayer(${index})">×</button>
        `;
        playersListDiv.appendChild(tag);
    });
}

function updatePlayerCount() {
    playerCountDiv.textContent = `Players: ${gameState.players.length}/25`;
}

function checkStartButton() {
    if (gameState.players.length >= 3 && gameState.players.length <= 25) {
        startGameBtn.disabled = false;
        errorMessageDiv.textContent = '';
    } else {
        startGameBtn.disabled = true;
        if (gameState.players.length > 0 && gameState.players.length < 3) {
            showError('Minimum 3 players required');
        }
    }
}

function showError(message) {
    errorMessageDiv.textContent = message;
}

// ===== GAME START =====
function startGame() {
    // Select random word
    const wordPair = wordBank[Math.floor(Math.random() * wordBank.length)];
    gameState.currentWord = wordPair.word;
    gameState.impostorSynonym = wordPair.synonym;

    // Select random impostor
    gameState.impostorIndex = Math.floor(Math.random() * gameState.players.length);

    // Reset ready players
    gameState.readyPlayers.clear();

    // Create cards
    createCards();

    // Switch to card reveal screen
    switchScreen(cardRevealScreen);
}

function createCards() {
    cardsContainer.innerHTML = '';
    totalPlayersSpan.textContent = gameState.players.length;
    readyCountSpan.textContent = '0';

    gameState.players.forEach((player, index) => {
        const isImpostor = index === gameState.impostorIndex;
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'card-wrapper';

        cardWrapper.innerHTML = `
            <div class="card" data-player-index="${index}">
                <div class="card-face card-front">
                    <div class="card-icon">🎴</div>
                    <div class="card-player-name">${escapeHtml(player)}</div>
                </div>
                <div class="card-face card-back">
                    <div class="card-player-name">${escapeHtml(player)}</div>
                    <div class="card-word ${isImpostor ? 'impostor' : ''}">${isImpostor ? 'IMPOSTOR' : escapeHtml(gameState.currentWord)}</div>
                    ${isImpostor ? `<div class="card-hint">Hint: ${escapeHtml(gameState.impostorSynonym)}</div>` : ''}
                    <button class="btn btn-primary card-ready-btn" onclick="markReady(${index})">Ready</button>
                </div>
            </div>
        `;

        cardsContainer.appendChild(cardWrapper);

        // Add click to flip
        const card = cardWrapper.querySelector('.card');
        card.addEventListener('click', (e) => {
            if (!card.classList.contains('flipped') && !gameState.readyPlayers.has(index)) {
                card.classList.add('flipped');
            }
        });
    });
}

function markReady(playerIndex) {
    event.stopPropagation();

    if (gameState.readyPlayers.has(playerIndex)) return;

    gameState.readyPlayers.add(playerIndex);

    // Flip card back
    const card = document.querySelector(`[data-player-index="${playerIndex}"]`);
    card.classList.remove('flipped');
    card.style.pointerEvents = 'none';

    // Update ready count
    readyCountSpan.textContent = gameState.readyPlayers.size;

    // Check if all ready
    if (gameState.readyPlayers.size === gameState.players.length) {
        continueBtn.disabled = false;
    }
}

// ===== GAME ROUND =====
function startRound() {
    gameState.timeRemaining = 300; // 5 minutes
    updateTimerDisplay();

    switchScreen(gameRoundScreen);

    // Start timer
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();

        if (gameState.timeRemaining <= 0) {
            endRound();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Update progress circle
    const circumference = 2 * Math.PI * 90;
    const progress = (gameState.timeRemaining / 300) * circumference;
    timerProgress.style.strokeDashoffset = circumference - progress;
}

function endRound() {
    clearInterval(gameState.timerInterval);
    showVotingScreen();
}

// ===== VOTING =====
function showVotingScreen() {
    votingCardsContainer.innerHTML = '';
    gameState.selectedVote = null;
    submitVoteBtn.disabled = true;

    gameState.players.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'voting-card';
        card.innerHTML = `
            <div class="voting-card-name">${escapeHtml(player)}</div>
        `;

        card.addEventListener('click', () => selectVote(index, card));
        votingCardsContainer.appendChild(card);
    });

    switchScreen(votingScreen);
}

function selectVote(playerIndex, cardElement) {
    // Remove previous selection
    document.querySelectorAll('.voting-card').forEach(c => c.classList.remove('selected'));

    // Add new selection
    cardElement.classList.add('selected');
    gameState.selectedVote = playerIndex;
    submitVoteBtn.disabled = false;
}

function submitVote() {
    if (gameState.selectedVote === null) return;

    const votedPlayer = gameState.players[gameState.selectedVote];
    const isCorrect = gameState.selectedVote === gameState.impostorIndex;

    showResult(isCorrect, votedPlayer);
}

// ===== RESULT =====
function showResult(isCorrect, votedPlayer) {
    if (isCorrect) {
        resultIcon.className = 'result-icon success';
        resultTitle.textContent = 'Correct!';
        resultMessage.textContent = `${votedPlayer} was the Impostor!`;
        resultActionBtn.textContent = 'Play Again';
        resultActionBtn.onclick = resetGame;
    } else {
        resultIcon.className = 'result-icon failure';
        resultTitle.textContent = 'Wrong!';
        resultMessage.textContent = `${votedPlayer} was not the Impostor!`;
        resultActionBtn.textContent = 'Next Round';
        resultActionBtn.onclick = startNextRound;
    }

    switchScreen(resultScreen);
}

function startNextRound() {
    // Keep the same word AND same impostor - players get another chance
    gameState.readyPlayers.clear();

    // Create new cards with same word and same impostor
    createCards();
    switchScreen(cardRevealScreen);
}

function resetGame() {
    gameState.players = [];
    gameState.readyPlayers.clear();
    gameState.selectedVote = null;

    playersListDiv.innerHTML = '';
    updatePlayerCount();
    checkStartButton();
    playerNameInput.value = '';
    errorMessageDiv.textContent = '';

    switchScreen(setupScreen);
}

// ===== UTILITY FUNCTIONS =====
function switchScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make removePlayer available globally
window.removePlayer = removePlayer;
window.markReady = markReady;
