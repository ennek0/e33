// ===== GOOGLE CLASSROOM INTERFACE =====
// Complete JavaScript for section view with assignments

// ===== DATA STRUCTURE =====
const categories = {
    'e33': {
        title: 'E33',
        section: 'Creator\'s Games',
        backgroundImage: 'fondos/clase1.jpg',
        assignments: [
            {
                id: 'snake-game',
                title: 'Snake Game',
                type: 'Game',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './snake/index.html'
            },
            {
                id: 'tictactoe-game',
                title: 'Tic-Tac-Toe',
                type: 'Strategy Game',
                dueDate: 'No due date',
                icon: 'grid_on',
                path: './tictactoe/index.html'
            },
            {
                id: 'impostor-game',
                title: 'The Impostor',
                type: 'Social Deduction Game',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './impostor/index.html'
            },
            {
                id: 'subway-surfers-newyork',
                title: 'Subway Surfers New York',
                type: 'Running Game',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './subway-surfers-newyork-main/index.html'
            },
            {
                id: 'bitlife',
                title: 'BitLife',
                type: 'Life Simulator',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './bitlife-main/index.html'
            }
        ]
    },
    'gambling': {
        title: 'Gambling Games',
        section: 'Casino & Card Games',
        backgroundImage: 'fondos/clase4.jpg',
        assignments: [
            {
                id: 'poker',
                title: 'Classroom Poker',
                type: 'Texas Hold\'em',
                dueDate: 'No due date',
                icon: 'casino',
                path: './poker/index.html'
            },
            {
                id: 'blackjack',
                title: 'Blackjack',
                type: 'Card Game',
                dueDate: 'No due date',
                icon: 'casino',
                path: './black jack/index.html'
            }
        ]
    },
    'cars': {
        title: 'Car Games',
        section: 'Racing',
        backgroundImage: 'fondos/clase2.jpg',
        assignments: [
            {
                id: 'drift-hunters',
                title: 'Drift Hunters',
                type: 'Racing Game',
                dueDate: 'No due date',
                icon: 'directions_car',
                path: './drift-hunters-main/index.html'
            },
            {
                id: 'moto-x3m',
                title: 'Moto X3M',
                type: 'Motorcycle Racing',
                dueDate: 'No due date',
                icon: 'directions_car',
                path: './moto-x3m-main/index.html'
            },
            {
                id: 'classroom',
                title: 'Highway Traffic',
                type: 'Traffic Game',
                dueDate: 'No due date',
                icon: 'directions_car',
                path: './highway-traffic-main/index.html'
            }
        ]
    },
    '1v1': {
        title: '1v1',
        section: 'Multiplayer Games',
        backgroundImage: 'fondos/clase3.jpg',
        assignments: [
            {
                id: '1v1-lol',
                title: '1v1.LOL',
                type: 'Battle Game',
                dueDate: 'No due date',
                icon: 'sports_kabaddi',
                path: './1v1-lol-main/index.html'
            },
            {
                id: 'rooftop-snipers',
                title: 'Rooftop Snipers',
                type: 'Shooting Game',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './rooftop-snipers-main/index.html'
            }
        ]
    },
    'football': {
        title: 'Football Games',
        section: 'Soccer & Sports',
        backgroundImage: 'fondos/clase6.jpg',
        assignments: [
            {
                id: 'penalty-shooters-2',
                title: 'Penalty Shooters 2',
                type: 'Soccer Game',
                dueDate: 'No due date',
                icon: 'sports_soccer',
                path: './penalty-shooters-2-main/index.html'
            },
            {
                id: 'football-masters',
                title: 'Football Master',
                type: 'Soccer Game',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './football-masters-main/index.html'
            }
        ]
    }
};

// ===== DOM ELEMENTS =====
let categoriesView;
let gamesView;
let courseTitle;
let courseDescription;
let assignmentList;
let backButton;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    applyCardBackgrounds();
    setupEventListeners();
});

function applyCardBackgrounds() {
    // Apply background images to cards
    const homepageCards = document.querySelectorAll('.homepage-card');
    console.log('Applying backgrounds to', homepageCards.length, 'cards');

    homepageCards.forEach(card => {
        const courseId = card.getAttribute('data-course');
        const category = categories[courseId];
        if (category && category.backgroundImage) {
            const cardHeader = card.querySelector('.card-header-home');
            if (cardHeader) {
                cardHeader.style.backgroundImage = `url('${category.backgroundImage}')`;
                cardHeader.style.backgroundSize = 'cover';
                cardHeader.style.backgroundPosition = 'center';
                console.log(`Applied background to ${courseId}:`, category.backgroundImage);
            } else {
                console.error(`Card header not found for ${courseId}`);
            }
        } else {
            console.log(`No background image for ${courseId}`);
        }
    });
}

function initializeElements() {
    categoriesView = document.getElementById('categories-view');
    gamesView = document.getElementById('course-view');
    courseTitle = document.getElementById('course-title');
    courseDescription = document.getElementById('course-description');
    assignmentList = document.querySelector('.assignment-list');
    backButton = document.getElementById('header-menu-toggle');

    // Debug: Log if elements are found
    console.log('Elements initialized:', {
        categoriesView: !!categoriesView,
        gamesView: !!gamesView,
        courseTitle: !!courseTitle,
        courseDescription: !!courseDescription,
        assignmentList: !!assignmentList
    });
}

function setupEventListeners() {
    // Homepage Cards: Click to navigate to section
    const homepageCards = document.querySelectorAll('.homepage-card');
    homepageCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking the menu button
            if (e.target.closest('.card-menu-home')) {
                return;
            }
            const courseId = card.getAttribute('data-course');
            if (courseId) {
                showSection(courseId);
            }
        });
    });

    // Menu Toggle: Show/hide sidebar with mobile overlay
    const menuToggles = document.querySelectorAll('.menu-button');
    const leftSidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    menuToggles.forEach(menuToggle => {
        if (menuToggle && leftSidebar) {
            menuToggle.addEventListener('click', () => {
                console.log('Menu toggle clicked');
                const isOpen = leftSidebar.classList.toggle('open');
                
                // Show/hide overlay on mobile
                if (sidebarOverlay) {
                    if (window.innerWidth <= 768) {
                        sidebarOverlay.classList.toggle('active', isOpen);
                    }
                }
            });
        }
    });

    // Sidebar overlay click to close
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            leftSidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
        });
    }

    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && leftSidebar && leftSidebar.classList.contains('open')) {
            leftSidebar.classList.remove('open');
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Reset sidebar state on desktop
            leftSidebar.classList.remove('open');
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
            }
        }
    });

    // Sidebar: Expand/Collapse Courses
    const coursesHeader = document.getElementById('courses-header');
    const coursesArrow = document.getElementById('courses-arrow');
    const coursesList = document.getElementById('courses-list');

    if (coursesHeader) {
        // Expand courses list by default
        if (coursesList) {
            coursesList.classList.add('expanded');
            if (coursesArrow) {
                coursesArrow.style.transform = 'rotate(180deg)';
            }
        }

        coursesHeader.addEventListener('click', () => {
            coursesList.classList.toggle('expanded');
            // Update the SVG icon rotation
            if (coursesArrow) {
                if (coursesList.classList.contains('expanded')) {
                    coursesArrow.style.transform = 'rotate(180deg)';
                } else {
                    coursesArrow.style.transform = 'rotate(0deg)';
                }
            }
        });
    }

    // Sidebar: Home Navigation
    const navHome = document.getElementById('nav-home');
    if (navHome) {
        navHome.addEventListener('click', showHomepage);
    }

    // Sidebar: Course Items
    const courseItems = document.querySelectorAll('.course-item[data-course]');
    courseItems.forEach(item => {
        item.addEventListener('click', () => {
            const courseId = item.getAttribute('data-course');
            if (courseId) {
                showSection(courseId);
            }
        });
    });

    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-nav-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all tabs
            tabButtons.forEach(tab => tab.classList.remove('active'));
            // Add active to clicked tab
            button.classList.add('active');
        });
    });

    // Topic Selector
    const topicSelector = document.querySelector('.topic-selector');
    if (topicSelector) {
        topicSelector.addEventListener('click', () => {
            // Could add dropdown functionality here
            console.log('Topic selector clicked');
        });
    }
}

// ===== SHOW SECTION =====
function showSection(courseId) {
    const category = categories[courseId];
    if (!category) {
        console.error('Category not found:', courseId);
        return;
    }

    console.log('Showing section:', courseId, category);

    // Update course info
    if (courseTitle) courseTitle.textContent = category.title;
    if (courseDescription) courseDescription.textContent = category.section;

    // Render assignments
    renderAssignments(category.assignments);

    // Switch views
    if (categoriesView) categoriesView.style.display = 'none';
    if (gamesView) {
        gamesView.style.display = 'flex';
        gamesView.classList.add('active');
    }
}

// ===== RENDER ASSIGNMENTS =====
function renderAssignments(assignments) {
    assignmentList.innerHTML = '';

    if (assignments.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.style.cssText = 'padding: 40px 20px; color: #5f6368; text-align: center; font-size: 16px;';
        emptyMessage.textContent = 'No assignments available yet.';
        assignmentList.appendChild(emptyMessage);
    } else {
        assignments.forEach(assignment => {
            const assignmentElement = createAssignmentElement(assignment);
            assignmentList.appendChild(assignmentElement);
        });
    }
}

// ===== CREATE ASSIGNMENT ELEMENT =====
function createAssignmentElement(assignment) {
    const element = document.createElement('div');
    element.className = 'assignment-item';
    element.onclick = () => navigateToAssignment(assignment);

    const iconSvg = getIconSvg(assignment.icon);

    element.innerHTML = `
        <div class="assignment-left">
            <div class="assignment-icon">
                ${iconSvg}
            </div>
            <div class="assignment-info">
                <h3 class="assignment-title">${escapeHtml(assignment.title)}</h3>
                <p class="assignment-subtitle">${escapeHtml(assignment.type)}</p>
            </div>
        </div>
        <div class="assignment-right">
            <span class="assignment-due">${escapeHtml(assignment.dueDate)}</span>
            <button class="assignment-menu" onclick="event.stopPropagation();" aria-label="More options">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
            </button>
        </div>
    `;

    return element;
}

// ===== GET ICON SVG =====
function getIconSvg(iconType) {
    const icons = {
        'sports_esports': '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></svg>',
        'grid_on': '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"></path></svg>',
        'casino': '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z"></path></svg>',
        'directions_car': '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"></path></svg>',
        'sports_kabaddi': '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7 7.5c0-.83-.67-1.5-1.5-1.5S16 8.67 16 9.5 16.67 11 17.5 11s1.5-.67 1.5-1.5zm-2.99 4.5L14 17.5V23h2v-5l1-3 2 2v4h2v-5l-2.5-2.5c-.5-.5-1.17-.5-1.67 0L14 16l-1.5-1.5c-.5-.5-1.17-.5-1.67 0L8.5 17 7 16l-1.5 1.5L7 19l2.5-2.5L11 18l1-1.5 1.5 1.5L15 16.5l-1.5-1.5 1.51-1zM7.5 8C6.67 8 6 8.67 6 9.5S6.67 11 7.5 11 9 10.33 9 9.5 8.33 8 7.5 8z"></path></svg>',
        'sports_soccer': '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>'
    };

    return icons[iconType] || '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></svg>';
}

// ===== SHOW HOMEPAGE =====
function showHomepage() {
    console.log('Showing homepage');
    if (gamesView) {
        gamesView.classList.remove('active');
        gamesView.style.display = 'none';
    }
    if (categoriesView) {
        categoriesView.style.display = 'grid';
    }
}

// ===== NAVIGATE TO ASSIGNMENT =====
function navigateToAssignment(assignment) {
    if (assignment.path && assignment.path !== '#') {
        window.location.href = assignment.path;
    } else {
        console.log('Assignment clicked:', assignment.title);
    }
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // ESC key to go back to homepage
    if (e.key === 'Escape' && gamesView && gamesView.classList.contains('active')) {
        showHomepage();
    }
});
