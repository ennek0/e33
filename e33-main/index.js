// Game Hub - Main Menu JavaScript

// Data Structure for Categories and Games
const categories = {
    'e33': {
        title: 'E33',
        section: 'Classroom Games',
        gradient: 'linear-gradient(135deg, #1967d2, #1557b0)', // Blue Gradient
        games: [
            {
                id: 'snake',
                title: 'Snake Game',
                path: './snake/index.html',
                section: 'Packet Tracer Edition',
                gradient: 'linear-gradient(135deg, #1e8e3e, #137333)' // Green Gradient
            },
            {
                id: 'tictactoe',
                title: 'Tic-Tac-Toe',
                path: './tictactoe/index.html',
                section: 'Strategy & AI',
                gradient: 'linear-gradient(135deg, #1967d2, #1557b0)' // Blue Gradient
            }
        ]
    },
    '1v1': {
        title: '1v1',
        section: 'Competitive',
        gradient: 'linear-gradient(135deg, #d93025, #b31412)', // Red Gradient
        games: [
            {
                id: '1v1lol',
                title: '1v1.LOL',
                path: './1v1-lol-main/index.html',
                section: 'Action & Building',
                gradient: 'linear-gradient(135deg, #e37400, #c26401)' // Orange Gradient
            }
        ]
    },
    'cars': {
        title: 'Car Games',
        section: 'Racing & Driving',
        gradient: 'linear-gradient(135deg, #188038, #0f5c2e)', // Dark Green Gradient
        games: [
            // Placeholder for future car games
        ]
    }
};

// DOM Elements
let categoriesView;
let gamesView;
let gamesGrid;
let categoryTitle;
let backButton;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    categoriesView = document.getElementById('categories-view');
    gamesView = document.getElementById('games-view');
    gamesGrid = document.getElementById('games-grid');
    categoryTitle = document.getElementById('category-title');
    backButton = document.getElementById('back-button');

    setupEventListeners();
    renderCategories();
});

function setupEventListeners() {
    backButton.addEventListener('click', showCategories);
}

/**
 * Render the main categories view
 */
function renderCategories() {
    categoriesView.innerHTML = '';

    for (const [key, category] of Object.entries(categories)) {
        const card = createCard({
            title: category.title,
            section: category.section,
            gradient: category.gradient,
            onClick: () => showCategory(key)
        });
        categoriesView.appendChild(card);
    }
}

/**
 * Show a specific category and its games
 * @param {string} categoryId 
 */
function showCategory(categoryId) {
    const category = categories[categoryId];
    if (!category) return;

    // Update Header
    categoryTitle.textContent = category.title;

    // Render Games
    gamesGrid.innerHTML = '';

    if (category.games.length === 0) {
        gamesGrid.innerHTML = '<div style="padding: 20px; color: #5f6368;">No games available in this category yet.</div>';
    } else {
        category.games.forEach(game => {
            const card = createCard({
                title: game.title,
                section: game.section,
                gradient: game.gradient,
                onClick: () => window.location.href = game.path
            });
            gamesGrid.appendChild(card);
        });
    }

    // Switch Views
    categoriesView.style.display = 'none';
    gamesView.style.display = 'flex';
    gamesView.style.flexDirection = 'column';
}

/**
 * Return to the categories view
 */
function showCategories() {
    gamesView.style.display = 'none';
    categoriesView.style.display = 'flex';
}

/**
 * Create a Classroom-style card element
 * @param {Object} data - Card data
 */
function createCard(data) {
    const card = document.createElement('div');
    card.className = 'class-card';
    card.onclick = data.onClick;

    // Use gradient for background to ensure visibility
    const headerStyle = `background: ${data.gradient};`;

    card.innerHTML = `
        <div class="card-header" style="${headerStyle}">
            <div class="card-title-group">
                <h2 class="class-title">${data.title}</h2>
                <div class="class-section">${data.section}</div>
            </div>
            <button class="icon-button card-menu">
                <svg viewBox="0 0 24 24" focusable="false" width="24" height="24" fill="white">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
            </button>
        </div>
        <div class="card-body">
            <div class="card-placeholder"></div>
        </div>
        <div class="card-footer">
            <button class="icon-button folder-button" title="Open folder">
                <svg viewBox="0 0 24 24" focusable="false" width="24" height="24" fill="currentColor">
                    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"></path>
                </svg>
            </button>
            <button class="icon-button trend-button" title="Open gradebook">
                <svg viewBox="0 0 24 24" focusable="false" width="24" height="24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5zm2-2h10v-2H7v2zm0-4h10v-2H7v2zm0-4h10V7H7v2z"></path>
                </svg>
            </button>
        </div>
    `;

    return card;
}
