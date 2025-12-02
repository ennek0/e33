// ===== POKER GAME - TEXAS HOLD'EM =====

// ===== GAME STATE =====
let deck = [];
let playerHand = [];
let ai1Hand = [];
let ai2Hand = [];
let communityCards = [];
let playerChips = 1000;
let ai1Chips = 1000;
let ai2Chips = 1000;
let pot = 0;
let currentBet = 0;
let ai1Bet = 0;
let ai2Bet = 0;
let gamePhase = 'preflop'; // preflop, flop, turn, river, showdown
let currentPlayerTurn = 0; // 0: player, 1: ai1, 2: ai2
let activePlayers = [true, true, true]; // player, ai1, ai2 active status

// ===== CARD DEFINITIONS =====
const suits = ['♠️', '♥️', '♦️', '♣️'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const rankValues = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

// ===== DOM ELEMENTS =====
const playerCardsEl = document.getElementById('player-cards');
const ai1CardsEl = document.getElementById('ai1-cards');
const ai2CardsEl = document.getElementById('ai2-cards');
const communityCardsEl = document.getElementById('community-cards');
const playerChipsEl = document.getElementById('player-chips');
const ai1ChipsEl = document.getElementById('ai1-chips');
const ai2ChipsEl = document.getElementById('ai2-chips');
const potAmountEl = document.getElementById('pot-amount');
const playerHandEl = document.getElementById('player-hand');
const ai1HandEl = document.getElementById('ai1-hand');
const ai2HandEl = document.getElementById('ai2-hand');

const dealBtn = document.getElementById('deal-btn');
const betControlsEl = document.getElementById('bet-controls');
const foldBtn = document.getElementById('fold-btn');
const checkBtn = document.getElementById('check-btn');
const callBtn = document.getElementById('call-btn');
const raiseBtn = document.getElementById('raise-btn');
const raiseSlider = document.getElementById('raise-slider');
const callAmountEl = document.getElementById('call-amount');
const raiseAmountEl = document.getElementById('raise-amount');

const messageOverlay = document.getElementById('message-overlay');
const messageIcon = document.getElementById('message-icon');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const continueBtn = document.getElementById('continue-btn');

// ===== INITIALIZATION =====
function initGame() {
    updateChipsDisplay();
    updatePotDisplay();

    dealBtn.addEventListener('click', startNewRound);
    foldBtn.addEventListener('click', fold);
    checkBtn.addEventListener('click', check);
    callBtn.addEventListener('click', call);
    raiseBtn.addEventListener('click', raise);
    continueBtn.addEventListener('click', hideMessage);

    raiseSlider.addEventListener('input', (e) => {
        raiseAmountEl.textContent = e.target.value;
    });
}

// ===== DECK MANAGEMENT =====
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ rank, suit, value: rankValues[rank] });
        }
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCard() {
    return deck.pop();
}

// ===== GAME FLOW =====
function startNewRound() {
    if (playerChips < 20 || ai1Chips < 20 || ai2Chips < 20) {
        showMessage('💸', 'Out of Chips!', 'One or more players need at least 20 chips to play.');
        dealBtn.disabled = true;
        return;
    }

    // Reset game state
    createDeck();
    playerHand = [];
    ai1Hand = [];
    ai2Hand = [];
    communityCards = [];
    pot = 0;
    currentBet = 0;
    ai1Bet = 0;
    ai2Bet = 0;
    gamePhase = 'preflop';
    currentPlayerTurn = 0;
    activePlayers = [true, true, true];

    // Clear displays
    playerCardsEl.innerHTML = '';
    ai1CardsEl.innerHTML = '';
    ai2CardsEl.innerHTML = '';
    communityCardsEl.innerHTML = '';
    playerHandEl.textContent = '';
    ai1HandEl.textContent = '';
    ai2HandEl.textContent = '';

    // Ante (small blind)
    const ante = 10;
    playerChips -= ante;
    ai1Chips -= ante;
    ai2Chips -= ante;
    pot += ante * 3;
    currentBet = ante;

    updateChipsDisplay();
    updatePotDisplay();

    // Deal cards
    setTimeout(() => {
        playerHand.push(dealCard(), dealCard());
        ai1Hand.push(dealCard(), dealCard());
        ai2Hand.push(dealCard(), dealCard());
        renderCards();

        dealBtn.style.display = 'none';
        betControlsEl.classList.add('active');

        updateCallAmount();
    }, 300);
}

function nextPhase() {
    // Reset bets for new betting round
    currentBet = 0;
    ai1Bet = 0;
    ai2Bet = 0;
    currentPlayerTurn = 0;
    
    switch (gamePhase) {
        case 'preflop':
            // Deal flop (3 cards)
            gamePhase = 'flop';
            communityCards.push(dealCard(), dealCard(), dealCard());
            renderCommunityCards();
            ai1Action();
            ai2Action();
            break;
        case 'flop':
            // Deal turn (1 card)
            gamePhase = 'turn';
            communityCards.push(dealCard());
            renderCommunityCards();
            ai1Action();
            ai2Action();
            break;
        case 'turn':
            // Deal river (1 card)
            gamePhase = 'river';
            communityCards.push(dealCard());
            renderCommunityCards();
            ai1Action();
            ai2Action();
            break;
        case 'river':
            // Showdown
            showdown();
            break;
    }
}

function ai1Action() {
    if (!activePlayers[1]) return;
    
    // Simple AI: 50% check, 30% bet small, 20% bet big
    const action = Math.random();

    if (action < 0.5) {
        // AI1 checks
        updateCallAmount();
    } else if (action < 0.8) {
        // AI1 bets small
        const bet = 20;
        if (ai1Chips >= bet) {
            ai1Bet = bet;
            ai1Chips -= bet;
            pot += bet;
            currentBet = bet;
            updateChipsDisplay();
            updatePotDisplay();
            updateCallAmount();
        }
    } else {
        // AI1 bets big
        const bet = 50;
        if (ai1Chips >= bet) {
            ai1Bet = bet;
            ai1Chips -= bet;
            pot += bet;
            currentBet = bet;
            updateChipsDisplay();
            updatePotDisplay();
            updateCallAmount();
        }
    }
}

function ai2Action() {
    if (!activePlayers[2]) return;
    
    // Simple AI: 50% check, 30% bet small, 20% bet big
    const action = Math.random();

    if (action < 0.5) {
        // AI2 checks
        updateCallAmount();
    } else if (action < 0.8) {
        // AI2 bets small
        const bet = 20;
        if (ai2Chips >= bet) {
            ai2Bet = bet;
            ai2Chips -= bet;
            pot += bet;
            currentBet = bet;
            updateChipsDisplay();
            updatePotDisplay();
            updateCallAmount();
        }
    } else {
        // AI2 bets big
        const bet = 50;
        if (ai2Chips >= bet) {
            ai2Bet = bet;
            ai2Chips -= bet;
            pot += bet;
            currentBet = bet;
            updateChipsDisplay();
            updatePotDisplay();
            updateCallAmount();
        }
    }
}

// ===== PLAYER ACTIONS =====
function fold() {
    activePlayers[0] = false;
    showMessage('😔', 'You Folded', 'You are out of this round.');
    
    // Check if only one player left
    const activeCount = activePlayers.filter(p => p).length;
    if (activeCount === 1) {
        // Find the winner
        if (activePlayers[1]) {
            ai1Chips += pot;
            showMessage('🎉', 'AI Player 1 Wins!', `AI Player 1 wins ${pot} chips!`);
        } else if (activePlayers[2]) {
            ai2Chips += pot;
            showMessage('🎉', 'AI Player 2 Wins!', `AI Player 2 wins ${pot} chips!`);
        }
        updateChipsDisplay();
        endRound();
    } else {
        // Continue with remaining players
        nextPhase();
    }
}

function check() {
    if (currentBet > 0) {
        return; // Can't check if there's a bet
    }
    nextPhase();
}

function call() {
    const callAmount = currentBet;
    if (playerChips < callAmount) {
        showMessage('💸', 'Not Enough Chips!', 'You cannot afford to call.');
        return;
    }

    playerChips -= callAmount;
    pot += callAmount;
    updateChipsDisplay();
    updatePotDisplay();

    nextPhase();
}

function raise() {
    const raiseAmount = parseInt(raiseSlider.value);
    if (playerChips < raiseAmount) {
        showMessage('💸', 'Not Enough Chips!', 'You cannot afford to raise that much.');
        return;
    }

    playerChips -= raiseAmount;
    pot += raiseAmount;
    currentBet = raiseAmount;
    updateChipsDisplay();
    updatePotDisplay();

    // AI players respond to raise
    const ai1Response = Math.random();
    if (ai1Response < 0.3) {
        // AI1 folds
        activePlayers[1] = false;
        showMessage('🤖', 'AI Player 1 Folds!', 'AI Player 1 is out of this round.');
    } else if (ai1Response < 0.7 && ai1Chips >= raiseAmount) {
        // AI1 calls
        ai1Chips -= raiseAmount;
        pot += raiseAmount;
        ai1Bet = raiseAmount;
        updateChipsDisplay();
        updatePotDisplay();
    }
    
    const ai2Response = Math.random();
    if (ai2Response < 0.3) {
        // AI2 folds
        activePlayers[2] = false;
        showMessage('🤖', 'AI Player 2 Folds!', 'AI Player 2 is out of this round.');
    } else if (ai2Response < 0.7 && ai2Chips >= raiseAmount) {
        // AI2 calls
        ai2Chips -= raiseAmount;
        pot += raiseAmount;
        ai2Bet = raiseAmount;
        updateChipsDisplay();
        updatePotDisplay();
    }
    
    // Check if only one player left
    const activeCount = activePlayers.filter(p => p).length;
    if (activeCount === 1) {
        if (activePlayers[0]) {
            playerChips += pot;
            showMessage('🎉', 'You Win!', `You win ${pot} chips!`);
        } else if (activePlayers[1]) {
            ai1Chips += pot;
            showMessage('🎉', 'AI Player 1 Wins!', `AI Player 1 wins ${pot} chips!`);
        } else if (activePlayers[2]) {
            ai2Chips += pot;
            showMessage('🎉', 'AI Player 2 Wins!', `AI Player 2 wins ${pot} chips!`);
        }
        updateChipsDisplay();
        endRound();
    } else {
        nextPhase();
    }
}

// ===== SHOWDOWN =====
function showdown() {
    betControlsEl.classList.remove('active');

    // Reveal all cards
    renderCards(true);

    // Evaluate hands for active players
    const hands = [];
    if (activePlayers[0]) {
        hands.push({ player: 0, name: 'You', hand: evaluateHand([...playerHand, ...communityCards]) });
    }
    if (activePlayers[1]) {
        hands.push({ player: 1, name: 'AI Player 1', hand: evaluateHand([...ai1Hand, ...communityCards]) });
    }
    if (activePlayers[2]) {
        hands.push({ player: 2, name: 'AI Player 2', hand: evaluateHand([...ai2Hand, ...communityCards]) });
    }

    // Sort by hand rank (highest first)
    hands.sort((a, b) => b.hand.rank - a.hand.rank);

    // Update hand displays
    if (activePlayers[0]) playerHandEl.textContent = hands.find(h => h.player === 0).hand.name;
    if (activePlayers[1]) ai1HandEl.textContent = hands.find(h => h.player === 1).hand.name;
    if (activePlayers[2]) ai2HandEl.textContent = hands.find(h => h.player === 2).hand.name;

    setTimeout(() => {
        const winner = hands[0];
        const winnerChips = [playerChips, ai1Chips, ai2Chips][winner.player];
        
        showMessage('🎉', `${winner.name} Wins!`, `${winner.hand.name} wins the pot!`);
        
        // Award pot to winner
        if (winner.player === 0) {
            playerChips += pot;
        } else if (winner.player === 1) {
            ai1Chips += pot;
        } else if (winner.player === 2) {
            ai2Chips += pot;
        }
        
        updateChipsDisplay();
        endRound();
    }, 1000);
}

// ===== HAND EVALUATION =====
function evaluateHand(cards) {
    // Sort cards by value
    cards.sort((a, b) => b.value - a.value);

    const isFlush = checkFlush(cards);
    const isStraight = checkStraight(cards);
    const counts = countRanks(cards);

    // Royal Flush
    if (isFlush && isStraight && cards[0].rank === 'A') {
        return { rank: 10, name: 'Royal Flush' };
    }

    // Straight Flush
    if (isFlush && isStraight) {
        return { rank: 9, name: 'Straight Flush' };
    }

    // Four of a Kind
    if (counts.some(c => c === 4)) {
        return { rank: 8, name: 'Four of a Kind' };
    }

    // Full House
    if (counts.includes(3) && counts.includes(2)) {
        return { rank: 7, name: 'Full House' };
    }

    // Flush
    if (isFlush) {
        return { rank: 6, name: 'Flush' };
    }

    // Straight
    if (isStraight) {
        return { rank: 5, name: 'Straight' };
    }

    // Three of a Kind
    if (counts.includes(3)) {
        return { rank: 4, name: 'Three of a Kind' };
    }

    // Two Pair
    if (counts.filter(c => c === 2).length >= 2) {
        return { rank: 3, name: 'Two Pair' };
    }

    // One Pair
    if (counts.includes(2)) {
        return { rank: 2, name: 'One Pair' };
    }

    // High Card
    return { rank: 1, name: `High Card ${cards[0].rank}` };
}

function checkFlush(cards) {
    const suitCounts = {};
    cards.forEach(card => {
        suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    });
    return Object.values(suitCounts).some(count => count >= 5);
}

function checkStraight(cards) {
    const uniqueValues = [...new Set(cards.map(c => c.value))].sort((a, b) => b - a);

    for (let i = 0; i <= uniqueValues.length - 5; i++) {
        if (uniqueValues[i] - uniqueValues[i + 4] === 4) {
            return true;
        }
    }

    // Check for A-2-3-4-5 straight
    if (uniqueValues.includes(14) && uniqueValues.includes(2) && uniqueValues.includes(3) &&
        uniqueValues.includes(4) && uniqueValues.includes(5)) {
        return true;
    }

    return false;
}

function countRanks(cards) {
    const rankCounts = {};
    cards.forEach(card => {
        rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    });
    return Object.values(rankCounts);
}

// ===== RENDERING =====
function renderCards(reveal = false) {
    // Player cards
    playerCardsEl.innerHTML = '';
    playerHand.forEach(card => {
        const cardEl = createCardElement(card);
        playerCardsEl.appendChild(cardEl);
    });

    // AI1 cards (hidden unless reveal)
    ai1CardsEl.innerHTML = '';
    ai1Hand.forEach(card => {
        const cardEl = reveal ? createCardElement(card) : createCardBack();
        ai1CardsEl.appendChild(cardEl);
    });

    // AI2 cards (hidden unless reveal)
    ai2CardsEl.innerHTML = '';
    ai2Hand.forEach(card => {
        const cardEl = reveal ? createCardElement(card) : createCardBack();
        ai2CardsEl.appendChild(cardEl);
    });
}

function renderCommunityCards() {
    communityCardsEl.innerHTML = '';
    communityCards.forEach(card => {
        communityCardsEl.appendChild(createCardElement(card));
    });
}

function createCardElement(card) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.classList.add(card.suit === '♥️' || card.suit === '♦️' ? 'red' : 'black');

    const rankEl = document.createElement('div');
    rankEl.className = 'rank';
    rankEl.textContent = card.rank;

    const suitEl = document.createElement('div');
    suitEl.className = 'suit';
    suitEl.textContent = card.suit;

    cardEl.appendChild(rankEl);
    cardEl.appendChild(suitEl);

    return cardEl;
}

function createCardBack() {
    const cardEl = document.createElement('div');
    cardEl.className = 'card back';
    return cardEl;
}

// ===== UI UPDATES =====
function updateChipsDisplay() {
    playerChipsEl.textContent = playerChips;
    ai1ChipsEl.textContent = ai1Chips;
    ai2ChipsEl.textContent = ai2Chips;
}

function updatePotDisplay() {
    potAmountEl.textContent = pot;
}

function updateCallAmount() {
    const callAmount = currentBet;
    callAmountEl.textContent = callAmount;

    if (callAmount === 0) {
        callBtn.style.display = 'none';
        checkBtn.style.display = 'block';
    } else {
        callBtn.style.display = 'block';
        checkBtn.style.display = 'none';
    }
}

function showMessage(icon, title, text) {
    messageIcon.textContent = icon;
    messageTitle.textContent = title;
    messageText.textContent = text;
    messageOverlay.classList.add('active');
}

function hideMessage() {
    messageOverlay.classList.remove('active');
}

function endRound() {
    betControlsEl.classList.remove('active');
    dealBtn.style.display = 'block';

    // Update slider max based on chips
    raiseSlider.max = Math.min(playerChips, 200);
}

// ===== START GAME =====
initGame();
