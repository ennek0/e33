// ===== GAME STATE =====
const gameState = {
    players: [],
    currentWord: '',
    impostorIndex: -1,
    impostorSynonym: '',
    gameMode: '', // 'with-hints' or 'without-hints'
    currentPlayerIndex: 0,
    cardRevealed: false,
    currentVoterIndex: 0,
    votes: {}, // Track votes for each player
    eliminatedPlayers: [], // Track eliminated players
    timerInterval: null,
    timeRemaining: 300, // 5 minutes in seconds
    selectedVote: null,
    touchStartX: 0,
    touchStartY: 0,
    isMobile: false
};

// ===== WORD BANK =====
const wordBank = [
    { word: 'Pizza', synonym: 'Comida Italiana' },
    { word: 'Guitarra', synonym: 'Instrumento Musical' },
    { word: 'Montaña', synonym: 'Altura' },
    { word: 'Café', synonym: 'Postre' },
    { word: 'Baloncesto', synonym: 'Deporte' },
    { word: 'Avión', synonym: 'Volar' },
    { word: 'Teléfono', synonym: 'Comunicacion' },
    { word: 'Arcoíris', synonym: 'Color' },
    { word: 'Mariposa', synonym: 'Insecto' },
    { word: 'Chocolate', synonym: 'Dulce' },
    { word: 'Fuegos Artificiales', synonym: 'Espectáculo' },
    { word: 'Atardecer', synonym: 'Sol' },
    { word: 'Cámara', synonym: 'Dispositivo Fotográfico' },
    { word: 'Bicicleta', synonym: 'Deporte de dos ruedas' },
    { word: 'Faro', synonym: 'Barcos' },
    { word: 'Telescopio', synonym: 'Estrellas' },
    { word: 'Volcán', synonym: 'Montaña' },
    { word: 'Cascada', synonym: 'Rio' },
    { word: 'Castillo', synonym: 'Medieval' },
    { word: 'Helado', synonym: 'Postre' },
    { word: 'Gato', synonym: 'Mascota' },
    { word: 'Playa', synonym: 'Verano' },
    { word: 'Libro', synonym: 'Paginas' },
    { word: 'Reloj', synonym: 'Agujas' },
    { word: 'Tren', synonym: 'Transporte' },
    { word: 'Sombrero', synonym: 'Cabeza' },
    { word: 'Estrella', synonym: 'Cielo' },
    { word: 'Lago', synonym: 'Charco grande' },
    { word: 'Pintura', synonym: 'Arte Visual' },
    { word: 'Perro', synonym: 'Fiel' },
    { word: 'Puente', synonym: 'Conexión/Estructura' },
    { word: 'Avión de Papel', synonym: 'Manualidad' },
    { word: 'Globos', synonym: 'Inflable' },
    { word: 'Caracol', synonym: 'Casa en la espalda' },
    { word: 'Maratón', synonym: 'Carrera' },
    { word: 'Farol', synonym: 'Luz' },
    { word: 'Piano', synonym: 'Teclas' },
    { word: 'Barco', synonym: 'Mar' },
    { word: 'Luna', synonym: 'Luz nocturna' },
    { word: 'Jirafa', synonym: 'Animal Alto' },
    { word: 'Helicóptero', synonym: 'Vuelo Vertical' },
    { word: 'Nube', synonym: 'Gris' },
    { word: 'Torre', synonym: 'Estructura Alta' },
    { word: 'Carretera', synonym: 'Coches' },
    { word: 'Camión', synonym: 'Transporte Pesado' },
    { word: 'Parque', synonym: 'Niños/as' },
    { word: 'Isla', synonym: 'Tierra Rodeada' },
    { word: 'Sombrilla', synonym: 'Playa' },
    { word: 'Cueva', synonym: 'Prehistoria' },
    { word: 'Coche de Carreras', synonym: 'Deporte' },
    { word: 'Trineo', synonym: 'Deslizamiento' },
    { word: 'Castor', synonym: 'Dientes' },
    { word: 'Puerta', synonym: 'Casa' },
    { word: 'Ventana', synonym: 'Cristal' },
    { word: 'Espada', synonym: 'Afilado' },
    { word: 'Sombrero de Copa', synonym: 'Estilo Formal' },
    { word: 'Molino', synonym: 'Viento' },
    { word: 'Cinturón', synonym: 'Accesorio' },
    { word: 'Pirámide', synonym: 'Egipto' },
    { word: 'Balón', synonym: 'Deportes' },
    { word: 'Gafas', synonym: 'Cristal' },
    { word: 'Espejo', synonym: 'Reflejo' },
    { word: 'Mapa', synonym: 'Mundo' },
    { word: 'Linterna', synonym: 'Luz' },
    { word: 'Fósil', synonym: 'Antiguos' },
    { word: 'Paracaídas', synonym: 'Salto aereo' },
    { word: 'Termómetro', synonym: 'Mide Temperatura' }
    
];

// ===== DOM ELEMENTS =====
let setupScreen, modeSelectionScreen, cardRevealScreen, gameRoundScreen, votingScreen, resultScreen;
let playerNameInput, addPlayerBtn, startGameBtn, playersListDiv, playerCountDiv, errorMessageDiv;
let currentPlayerCard, currentPlayerInstruction, nextPlayerBtn, continueToRoundBtn;
let currentPlayerNumberSpan, totalPlayersRevealSpan;
let currentVoterInstruction, votersCountSpan, totalVotersSpan, nextVoterBtn, finishVotingBtn;
let timerDisplay, timerProgress, endRoundBtn;
let votingCardsContainer, submitVoteBtn;
let resultIcon, resultTitle, resultMessage, resultActionBtn;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
    detectMobileDevice();
    setupTouchGestures();
});

function initializeElements() {
    // Screens
    setupScreen = document.getElementById('setup-screen');
    modeSelectionScreen = document.getElementById('mode-selection-screen');
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
    currentPlayerCard = document.getElementById('current-player-card');
    currentPlayerInstruction = document.getElementById('current-player-instruction');
    nextPlayerBtn = document.getElementById('next-player-btn');
    continueToRoundBtn = document.getElementById('continue-to-round-btn');
    currentPlayerNumberSpan = document.getElementById('current-player-number');
    totalPlayersRevealSpan = document.getElementById('total-players-reveal');

    // Game Round Screen
    timerDisplay = document.getElementById('timer-display');
    timerProgress = document.getElementById('timer-progress');
    endRoundBtn = document.getElementById('end-round-btn');

    // Voting Screen
    currentVoterInstruction = document.getElementById('current-voter-instruction');
    votersCountSpan = document.getElementById('voters-count');
    totalVotersSpan = document.getElementById('total-voters');
    nextVoterBtn = document.getElementById('next-voter-btn');
    finishVotingBtn = document.getElementById('finish-voting-btn');
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
    startGameBtn.addEventListener('click', showModeSelection);

    // Mode Selection Screen
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', () => selectGameMode(card.dataset.mode));
        
        // Add touch event for mobile compatibility
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            selectGameMode(card.dataset.mode);
        }, { passive: false });
    });

    // Card Reveal Screen
    nextPlayerBtn.addEventListener('click', showNextPlayer);
    continueToRoundBtn.addEventListener('click', startRound);

    // Game Round Screen
    endRoundBtn.addEventListener('click', endRound);

    // Voting Screen
    nextVoterBtn.addEventListener('click', showNextVoter);
    finishVotingBtn.addEventListener('click', finishVoting);
    submitVoteBtn.addEventListener('click', submitVote);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
}

function detectMobileDevice() {
    const userAgent = navigator.userAgent;
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(userAgent);
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    
    gameState.isMobile = isMobileDevice || (hasTouchScreen && isSmallScreen);
}

function setupTouchGestures() {
    if (gameState.isMobile) {
        document.addEventListener('touchstart', (e) => {
            gameState.touchStartX = e.touches[0].clientX;
            gameState.touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchmove', (e) => {
            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;

            const distanceX = Math.abs(touchEndX - gameState.touchStartX);
            const distanceY = Math.abs(touchEndY - gameState.touchStartY);

            if (distanceX > distanceY && distanceX > 50) {
                if (touchEndX < gameState.touchStartX) {
                    // Swipe left
                    handleSwipeLeft();
                } else {
                    // Swipe right
                    handleSwipeRight();
                }
            }
        });
    }
}

function handleKeyPress(e) {
    if (e.key === 'ArrowLeft') {
        handleSwipeLeft();
    } else if (e.key === 'ArrowRight') {
        handleSwipeRight();
    }
}

function handleSwipeLeft() {
    // Navigate to next player or next voter
    if (cardRevealScreen.classList.contains('active') && nextPlayerBtn.style.display !== 'none') {
        showNextPlayer();
    } else if (votingScreen.classList.contains('active') && nextVoterBtn.style.display !== 'none') {
        showNextVoter();
    }
}

function handleSwipeRight() {
    // Navigate back (if implemented in future)
    // For now, this can be used for undo functionality
}

function triggerHapticFeedback() {
    if (gameState.isMobile && navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// ===== PLAYER MANAGEMENT =====
function addPlayer() {
    const name = playerNameInput.value.trim();
    errorMessageDiv.textContent = '';

    if (!name) {
        showError('Por favor ingresa un nombre de jugador');
        return;
    }

    if (gameState.players.includes(name)) {
        showError('El nombre del jugador ya existe');
        return;
    }

    if (gameState.players.length >= 25) {
        showError('Máximo 25 jugadores permitidos');
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
    playerCountDiv.textContent = `Jugadores: ${gameState.players.length}/25`;
}

function checkStartButton() {
    if (gameState.players.length >= 3 && gameState.players.length <= 25) {
        startGameBtn.disabled = false;
        errorMessageDiv.textContent = '';
    } else {
        startGameBtn.disabled = true;
        if (gameState.players.length > 0 && gameState.players.length < 3) {
            showError('Mínimo 3 jugadores requeridos');
        }
    }
}

function showError(message) {
    errorMessageDiv.textContent = message;
}

// ===== GAME MODE SELECTION =====
function showModeSelection() {
    switchScreen(modeSelectionScreen);
}

function selectGameMode(mode) {
    gameState.gameMode = mode;
    triggerHapticFeedback();
    startGame();
}

// ===== GAME START =====
function startGame() {
    // Reset eliminated players for new game
    gameState.eliminatedPlayers = [];
    
    // Select random word
    const wordPair = wordBank[Math.floor(Math.random() * wordBank.length)];
    gameState.currentWord = wordPair.word;
    gameState.impostorSynonym = wordPair.synonym;

    // Select random impostor
    gameState.impostorIndex = Math.floor(Math.random() * gameState.players.length);

    // Reset card reveal state
    gameState.currentPlayerIndex = 0;
    gameState.cardRevealed = false;

    // Start sequential card reveal
    showCurrentPlayerCard();
    switchScreen(cardRevealScreen);
}

// ===== SEQUENTIAL CARD REVEAL =====
function showCurrentPlayerCard() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isImpostor = gameState.currentPlayerIndex === gameState.impostorIndex;
    
    // Update progress display
    currentPlayerNumberSpan.textContent = gameState.currentPlayerIndex + 1;
    totalPlayersRevealSpan.textContent = gameState.players.length;
    
    // Update instruction
    currentPlayerInstruction.textContent = `${currentPlayer}, haz clic en tu carta para ver tu palabra`;
    
    // Create card for current player
    currentPlayerCard.innerHTML = `
        <div class="card" id="player-card">
            <div class="card-face card-front">
                <div class="card-icon">🎴</div>
                <div class="card-player-name">${escapeHtml(currentPlayer)}</div>
            </div>
            <div class="card-face card-back">
                <div class="card-player-name">${escapeHtml(currentPlayer)}</div>
                <div class="card-word ${isImpostor ? 'impostor' : ''}">${isImpostor ? 'IMPOSTOR' : escapeHtml(gameState.currentWord)}</div>
                ${isImpostor && gameState.gameMode === 'with-hints' ? `<div class="card-hint">Pista: ${escapeHtml(gameState.impostorSynonym)}</div>` : ''}
                <button class="btn btn-primary card-ready-btn" onclick="markCardRevealed()">Verificado</button>
            </div>
        </div>
    `;
    
    // Reset card state
    gameState.cardRevealed = false;
    nextPlayerBtn.style.display = 'none';
    continueToRoundBtn.style.display = 'none';
    
    // Add click and touch to flip with proper mobile handling
    const card = currentPlayerCard.querySelector('.card');
    
    // Handle both click and touch events for mobile compatibility
    const flipCard = (e) => {
        e.preventDefault();
        if (!card.classList.contains('flipped') && !gameState.cardRevealed) {
            card.classList.add('flipped');
            triggerHapticFeedback();
        }
    };
    
    // Add click event for desktop
    card.addEventListener('click', flipCard);
    
    // Add touch events for mobile with proper handling
    card.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!card.classList.contains('flipped') && !gameState.cardRevealed) {
            card.classList.add('flipped');
            triggerHapticFeedback();
        }
    }, { passive: false });
}

function markCardRevealed() {
    event.stopPropagation();
    
    if (gameState.cardRevealed) return;
    
    gameState.cardRevealed = true;
    triggerHapticFeedback();
    
    // Flip card back
    const card = currentPlayerCard.querySelector('.card');
    card.classList.remove('flipped');
    card.style.pointerEvents = 'none';
    
    // Show appropriate navigation button
    if (gameState.currentPlayerIndex < gameState.players.length - 1) {
        nextPlayerBtn.style.display = 'block';
    } else {
        continueToRoundBtn.style.display = 'block';
    }
}

function showNextPlayer() {
    gameState.currentPlayerIndex++;
    showCurrentPlayerCard();
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
    // Check if game should end (impostor wins if only 2 players left)
    const activePlayers = gameState.players.filter((_, index) => !gameState.eliminatedPlayers.includes(index));
    
    if (activePlayers.length <= 2) {
        // Impostor wins by default
        resultIcon.className = 'result-icon failure';
        resultTitle.textContent = '¡El Impostor Gana!';
        resultMessage.textContent = 'No quedan suficientes jugadores para continuar.';
        resultActionBtn.textContent = 'Jugar de Nuevo';
        resultActionBtn.onclick = resetGame;
        switchScreen(resultScreen);
        return;
    }
    
    // Reset voting state
    gameState.currentVoterIndex = 0;
    gameState.votes = {};
    gameState.selectedVote = null;
    
    // Initialize votes for all active players
    gameState.players.forEach((player, index) => {
        if (!gameState.eliminatedPlayers.includes(index)) {
            gameState.votes[index] = 0;
        }
    });
    
    // Show first voter
    showCurrentVoter();
    switchScreen(votingScreen);
}

function showCurrentVoter() {
    // Find next valid voter (skip eliminated players)
    while (gameState.eliminatedPlayers.includes(gameState.currentVoterIndex) && 
           gameState.currentVoterIndex < gameState.players.length) {
        gameState.currentVoterIndex++;
    }
    
    // Check if we've run out of voters
    if (gameState.currentVoterIndex >= gameState.players.length) {
        finishVoting();
        return;
    }
    
    const currentVoter = gameState.players[gameState.currentVoterIndex];
    
    // Update progress display
    const votedCount = gameState.currentVoterIndex - gameState.eliminatedPlayers.filter(index => index < gameState.currentVoterIndex).length;
    const activeCount = gameState.players.filter((_, index) => !gameState.eliminatedPlayers.includes(index)).length;
    
    votersCountSpan.textContent = votedCount;
    totalVotersSpan.textContent = activeCount;
    
    // Update instruction
    currentVoterInstruction.textContent = `${currentVoter}, haz clic en el jugador que crees que es el impostor`;
    
    // Create voting cards for active players
    votingCardsContainer.innerHTML = '';
    gameState.selectedVote = null;
    
    gameState.players.forEach((player, index) => {
        // Skip eliminated players
        if (gameState.eliminatedPlayers.includes(index)) return;
        
        // Skip self-voting
        if (index === gameState.currentVoterIndex) return;
        
        const card = document.createElement('div');
        card.className = 'voting-card';
        card.innerHTML = `
            <div class="voting-card-name">${escapeHtml(player)}</div>
        `;
        
        card.addEventListener('click', () => selectVote(index, card));
        
        // Add touch event for mobile compatibility
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            selectVote(index, card);
        }, { passive: false });
        
        votingCardsContainer.appendChild(card);
    });
    
    // Hide navigation buttons initially
    nextVoterBtn.style.display = 'none';
    finishVotingBtn.style.display = 'none';
}

function selectVote(playerIndex, cardElement) {
    // Remove previous selection
    document.querySelectorAll('.voting-card').forEach(c => c.classList.remove('selected'));
    
    // Add new selection
    cardElement.classList.add('selected');
    gameState.selectedVote = playerIndex;
    triggerHapticFeedback();
    
    // Show appropriate navigation button
    const remainingVoters = gameState.players.filter((_, index) => 
        !gameState.eliminatedPlayers.includes(index) && index > gameState.currentVoterIndex
    ).length;
    
    if (remainingVoters > 0) {
        nextVoterBtn.style.display = 'block';
    } else {
        finishVotingBtn.style.display = 'block';
    }
}

function showNextVoter() {
    // Record the vote
    if (gameState.selectedVote !== null) {
        gameState.votes[gameState.selectedVote] = (gameState.votes[gameState.selectedVote] || 0) + 1;
    }
    
    // Move to next voter
    gameState.currentVoterIndex++;
    
    // Skip eliminated players
    while (gameState.eliminatedPlayers.includes(gameState.currentVoterIndex) && 
           gameState.currentVoterIndex < gameState.players.length) {
        gameState.currentVoterIndex++;
    }
    
    if (gameState.currentVoterIndex < gameState.players.length) {
        showCurrentVoter();
    }
}

function finishVoting() {
    // Record the final vote
    if (gameState.selectedVote !== null) {
        gameState.votes[gameState.selectedVote] = (gameState.votes[gameState.selectedVote] || 0) + 1;
    }
    
    // Find player with most votes
    let maxVotes = 0;
    let eliminatedPlayerIndex = -1;
    
    for (const [playerIndex, voteCount] of Object.entries(gameState.votes)) {
        if (voteCount > maxVotes) {
            maxVotes = voteCount;
            eliminatedPlayerIndex = parseInt(playerIndex);
        }
    }
    
    // Eliminate the player with most votes
    if (eliminatedPlayerIndex !== -1) {
        gameState.eliminatedPlayers.push(eliminatedPlayerIndex);
        
        const eliminatedPlayer = gameState.players[eliminatedPlayerIndex];
        const wasImpostor = eliminatedPlayerIndex === gameState.impostorIndex;
        
        showEliminationResult(wasImpostor, eliminatedPlayer);
    }
}

function showEliminationResult(wasImpostor, eliminatedPlayer) {
    if (wasImpostor) {
        resultIcon.className = 'result-icon success';
        resultTitle.textContent = '¡Correcto!';
        resultMessage.textContent = `¡${eliminatedPlayer} era el Impostor! ¡Los jugadores ganan!`;
        resultActionBtn.textContent = 'Jugar de Nuevo';
        resultActionBtn.onclick = resetGame;
    } else {
        resultIcon.className = 'result-icon failure';
        resultTitle.textContent = '¡Incorrecto!';
        resultMessage.textContent = `${eliminatedPlayer} no era el Impostor. ¡El juego continúa!`;
        resultActionBtn.textContent = 'Siguiente Ronda';
        resultActionBtn.onclick = startNextRound;
    }
    
    switchScreen(resultScreen);
}

function startNextRound() {
    // Keep the same word and same impostor when elimination is wrong
    // Only change when starting a completely new game or when impostor is found
    
    // Reset card reveal state for new round
    gameState.currentPlayerIndex = 0;
    gameState.cardRevealed = false;

    // Start sequential card reveal for new round with same word and impostor
    showCurrentPlayerCard();
    switchScreen(cardRevealScreen);
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

function resetGame() {
    gameState.players = [];
    gameState.gameMode = '';
    gameState.currentPlayerIndex = 0;
    gameState.cardRevealed = false;
    gameState.currentVoterIndex = 0;
    gameState.votes = {};
    gameState.eliminatedPlayers = [];
    gameState.selectedVote = null;

    playersListDiv.innerHTML = '';
    updatePlayerCount();
    checkStartButton();
    playerNameInput.value = '';
    errorMessageDiv.textContent = '';

    switchScreen(setupScreen);
}

// Make removePlayer available globally
window.removePlayer = removePlayer;
window.markCardRevealed = markCardRevealed;
