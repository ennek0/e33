// Game State
const gameState = {
    balance: 500,
    currentBet: 0,
    deck: [],
    playerHand: [],
    dealerHand: [],
    gameActive: false,
    dealerRevealed: false
};

// Card suits and values
const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// DOM Elements
const elements = {
    balance: document.getElementById('balance'),
    currentBet: document.getElementById('current-bet'),
    betInput: document.getElementById('bet-input'),
    dealBtn: document.getElementById('deal-btn'),
    hitBtn: document.getElementById('hit-btn'),
    standBtn: document.getElementById('stand-btn'),
    doubleBtn: document.getElementById('double-btn'),
    newGameBtn: document.getElementById('new-game-btn'),
    bettingSection: document.getElementById('betting-section'),
    gameActions: document.getElementById('game-actions'),
    newGameSection: document.getElementById('new-game-section'),
    playerCards: document.getElementById('player-cards'),
    dealerCards: document.getElementById('dealer-cards'),
    playerValue: document.getElementById('player-value'),
    dealerValue: document.getElementById('dealer-value'),
    messageContainer: document.getElementById('message-container'),
    quickBetBtns: document.querySelectorAll('.quick-bet-btn')
};

// Initialize game
function init() {
    updateDisplay();
    attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
    elements.dealBtn.addEventListener('click', startGame);
    elements.hitBtn.addEventListener('click', hit);
    elements.standBtn.addEventListener('click', stand);
    elements.doubleBtn.addEventListener('click', doubleDown);
    elements.newGameBtn.addEventListener('click', resetGame);

    // Quick bet buttons
    elements.quickBetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.dataset.amount);
            elements.betInput.value = amount;
        });
    });

    // Enter key to deal
    elements.betInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !gameState.gameActive) {
            startGame();
        }
    });
}

// Create and shuffle deck
function createDeck() {
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return shuffleDeck(deck);
}

// Shuffle deck using Fisher-Yates algorithm
function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Calculate hand value
function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;

    for (let card of hand) {
        if (card.value === 'A') {
            aces++;
            value += 11;
        } else if (['J', 'Q', 'K'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }

    // Adjust for aces
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }

    return value;
}

// Check if hand is blackjack
function isBlackjack(hand) {
    return hand.length === 2 && calculateHandValue(hand) === 21;
}

// Start game
function startGame() {
    const betAmount = parseInt(elements.betInput.value);

    // Validate bet
    if (!betAmount || betAmount < 1) {
        showMessage('Minimum bet is €1', 'error');
        return;
    }

    if (betAmount > 10000) {
        showMessage('Maximum bet is €10,000', 'error');
        return;
    }

    if (betAmount > gameState.balance) {
        showMessage('Insufficient balance!', 'error');
        return;
    }

    // Initialize game
    gameState.currentBet = betAmount;
    gameState.balance -= betAmount;
    gameState.deck = createDeck();
    gameState.playerHand = [];
    gameState.dealerHand = [];
    gameState.gameActive = true;
    gameState.dealerRevealed = false;

    // Clear previous cards
    elements.playerCards.innerHTML = '';
    elements.dealerCards.innerHTML = '';
    elements.messageContainer.innerHTML = '';

    // Deal initial cards
    dealCard(gameState.playerHand, elements.playerCards);
    dealCard(gameState.dealerHand, elements.dealerCards, true); // Dealer's first card hidden
    dealCard(gameState.playerHand, elements.playerCards);
    dealCard(gameState.dealerHand, elements.dealerCards);

    // Update UI
    updateDisplay();
    elements.bettingSection.classList.add('hidden');
    elements.gameActions.classList.remove('hidden');
    elements.playerValue.classList.remove('hidden');

    // Check for immediate blackjack
    if (isBlackjack(gameState.playerHand)) {
        revealDealerCard();
        if (isBlackjack(gameState.dealerHand)) {
            endGame('push');
        } else {
            endGame('blackjack');
        }
    }
}

// Deal a card
function dealCard(hand, container, hidden = false) {
    const card = gameState.deck.pop();
    hand.push(card);

    const cardElement = createCardElement(card, hidden);
    container.appendChild(cardElement);

    if (!hidden) {
        updateHandValue(hand === gameState.playerHand ? 'player' : 'dealer');
    }
}

// Create card element
function createCardElement(card, hidden = false) {
    const cardDiv = document.createElement('div');

    if (hidden) {
        cardDiv.className = 'card-back';
        cardDiv.id = 'hidden-card';
    } else {
        const color = (card.suit === '♥' || card.suit === '♦') ? 'red' : 'black';
        cardDiv.className = `card ${color}`;
        cardDiv.innerHTML = `
      <div>${card.value}</div>
      <div>${card.suit}</div>
    `;
    }

    return cardDiv;
}

// Update hand value display
function updateHandValue(player) {
    if (player === 'player') {
        const value = calculateHandValue(gameState.playerHand);
        elements.playerValue.textContent = value;
    } else {
        if (gameState.dealerRevealed) {
            const value = calculateHandValue(gameState.dealerHand);
            elements.dealerValue.textContent = value;
            elements.dealerValue.classList.remove('hidden');
        }
    }
}

// Reveal dealer's hidden card
function revealDealerCard() {
    gameState.dealerRevealed = true;
    const hiddenCard = document.getElementById('hidden-card');

    if (hiddenCard) {
        const card = gameState.dealerHand[0];
        const color = (card.suit === '♥' || card.suit === '♦') ? 'red' : 'black';
        hiddenCard.className = `card ${color}`;
        hiddenCard.innerHTML = `
      <div>${card.value}</div>
      <div>${card.suit}</div>
    `;
        hiddenCard.id = '';
    }

    updateHandValue('dealer');
}

// Player hits
function hit() {
    if (!gameState.gameActive) return;

    dealCard(gameState.playerHand, elements.playerCards);

    const playerValue = calculateHandValue(gameState.playerHand);
    if (playerValue > 21) {
        revealDealerCard();
        endGame('bust');
    }
}

// Player stands
function stand() {
    if (!gameState.gameActive) return;

    revealDealerCard();
    dealerPlay();
}

// Double down
function doubleDown() {
    if (!gameState.gameActive) return;

    // Check if player has enough balance
    if (gameState.currentBet > gameState.balance) {
        showMessage('Insufficient balance to double down!', 'error');
        return;
    }

    // Double the bet
    gameState.balance -= gameState.currentBet;
    gameState.currentBet *= 2;
    updateDisplay();

    // Deal one card and stand
    dealCard(gameState.playerHand, elements.playerCards);

    const playerValue = calculateHandValue(gameState.playerHand);
    if (playerValue > 21) {
        revealDealerCard();
        endGame('bust');
    } else {
        revealDealerCard();
        dealerPlay();
    }
}

// Dealer plays
function dealerPlay() {
    const dealerValue = calculateHandValue(gameState.dealerHand);

    // Dealer hits on 16 or less, stands on 17 or more
    if (dealerValue < 17) {
        setTimeout(() => {
            dealCard(gameState.dealerHand, elements.dealerCards);
            const newValue = calculateHandValue(gameState.dealerHand);

            if (newValue > 21) {
                endGame('dealer-bust');
            } else if (newValue < 17) {
                dealerPlay();
            } else {
                determineWinner();
            }
        }, 800);
    } else {
        determineWinner();
    }
}

// Determine winner
function determineWinner() {
    const playerValue = calculateHandValue(gameState.playerHand);
    const dealerValue = calculateHandValue(gameState.dealerHand);

    if (playerValue > dealerValue) {
        endGame('win');
    } else if (playerValue < dealerValue) {
        endGame('lose');
    } else {
        endGame('push');
    }
}

// End game
function endGame(result) {
    gameState.gameActive = false;
    elements.gameActions.classList.add('hidden');
    elements.newGameSection.classList.remove('hidden');

    let message = '';
    let messageType = 'info';

    switch (result) {
        case 'blackjack':
            // Blackjack pays 3:2
            const blackjackPayout = Math.floor(gameState.currentBet * 2.5);
            gameState.balance += blackjackPayout;
            message = `🎉 BLACKJACK! You win €${blackjackPayout}!`;
            messageType = 'success';
            break;

        case 'win':
            // Regular win pays 1:1
            const winPayout = gameState.currentBet * 2;
            gameState.balance += winPayout;
            message = `🎊 You win €${winPayout}!`;
            messageType = 'success';
            break;

        case 'dealer-bust':
            const dealerBustPayout = gameState.currentBet * 2;
            gameState.balance += dealerBustPayout;
            message = `💥 Dealer busts! You win €${dealerBustPayout}!`;
            messageType = 'success';
            break;

        case 'lose':
            message = `😔 Dealer wins. You lose €${gameState.currentBet}.`;
            messageType = 'error';
            break;

        case 'bust':
            message = `💥 Bust! You lose €${gameState.currentBet}.`;
            messageType = 'error';
            break;

        case 'push':
            // Return bet on push
            gameState.balance += gameState.currentBet;
            message = `🤝 Push! Your bet of €${gameState.currentBet} is returned.`;
            messageType = 'warning';
            break;
    }

    showMessage(message, messageType);
    updateDisplay();

    // Check if player is out of money
    if (gameState.balance < 1) {
        setTimeout(() => {
            showMessage('💸 Game Over! You\'re out of money. Resetting balance to €500.', 'info');
            gameState.balance = 500;
            updateDisplay();
        }, 2000);
    }
}

// Reset game for new round
function resetGame() {
    gameState.currentBet = 0;
    gameState.playerHand = [];
    gameState.dealerHand = [];
    gameState.gameActive = false;
    gameState.dealerRevealed = false;

    elements.playerCards.innerHTML = '';
    elements.dealerCards.innerHTML = '';
    elements.messageContainer.innerHTML = '';
    elements.playerValue.classList.add('hidden');
    elements.dealerValue.classList.add('hidden');
    elements.bettingSection.classList.remove('hidden');
    elements.newGameSection.classList.add('hidden');

    updateDisplay();
}

// Show message
function showMessage(text, type = 'info') {
    elements.messageContainer.innerHTML = `
    <div class="message ${type}">${text}</div>
  `;
}

// Update display
function updateDisplay() {
    elements.balance.textContent = `€${gameState.balance.toLocaleString()}`;
    elements.currentBet.textContent = `€${gameState.currentBet.toLocaleString()}`;

    // Update bet input max to current balance
    elements.betInput.max = Math.min(gameState.balance, 10000);
}

// Initialize game on page load
init();
