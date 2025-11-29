// ===== GOOGLE CLASSROOM INTERFACE =====
// Complete JavaScript for section view with assignments

// ===== DATA STRUCTURE =====
const categories = {
    'e33': {
        title: 'E33',
        section: 'Creator\'s Games',
        gradient: 'linear-gradient(135deg, #1967d2 0%, #1557b0 100%)',
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
            }
        ]
    },
    'cars': {
        title: 'Car Games',
        section: 'Racing',
        gradient: 'linear-gradient(135deg, #00897b 0%, #00695c 100%)',
        assignments: [
            {
                id: 'drift-hunters',
                title: 'Drift Hunters',
                type: 'Racing Game',
                dueDate: 'No due date',
                icon: 'directions_car',
                path: './drift-hunters-main/index.html'
            }
        ]
    },
    '1v1': {
        title: '1v1',
        section: 'Battle Games / PvP',
        gradient: 'linear-gradient(135deg, #d93025 0%, #b31412 100%)',
        assignments: [
            {
                id: '1v1-lol',
                title: '1v1.LOL',
                type: 'Battle Game',
                dueDate: 'No due date',
                icon: 'sports_kabaddi',
                path: './1v1-lol-main/index.html'
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
    setupEventListeners();
});

function initializeElements() {
    categoriesView = document.getElementById('categories-view');
    gamesView = document.getElementById('games-view');
    courseTitle = document.getElementById('course-title');
    courseDescription = document.getElementById('course-description');
    assignmentList = document.querySelector('.assignment-list');
    backButton = document.getElementById('menu-toggle');
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

    // Menu Toggle: Show/hide sidebar
    const menuToggles = document.querySelectorAll('#menu-toggle');
    const leftSidebar = document.querySelector('.left-sidebar');
    menuToggles.forEach(menuToggle => {
        if (menuToggle && leftSidebar) {
            menuToggle.addEventListener('click', () => {
                leftSidebar.classList.toggle('open');
            });
        }
    });

    // Sidebar: Expand/Collapse Courses
    const coursesHeader = document.getElementById('courses-header');
    const coursesArrow = document.getElementById('courses-arrow');
    const coursesList = document.getElementById('courses-list');

    if (coursesHeader) {
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
    if (!category) return;

    // Update course info
    courseTitle.textContent = category.title;
    courseDescription.textContent = category.section;

    // Render assignments
    renderAssignments(category.assignments);

    // Switch views
    categoriesView.style.display = 'none';
    gamesView.classList.add('active');
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
        'videogame_asset': '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></svg>',
        'directions_car': '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"></path></svg>',
        'local_parking': '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm-2.5 8c-.83 0-1.5-.67-1.5-1.5S9.67 8 10.5 8s1.5.67 1.5 1.5S11.33 11 10.5 11zm3.5 1c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path></svg>',
        'sports_kabaddi': '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></svg>',
        'gps_fixed': '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path></svg>'
    };
    return icons[iconType] || icons['sports_esports'];
}

// ===== SHOW HOMEPAGE =====
function showHomepage() {
    gamesView.classList.remove('active');
    categoriesView.style.display = 'grid';
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
    if (e.key === 'Escape' && gamesView.classList.contains('active')) {
        showHomepage();
    }
});
