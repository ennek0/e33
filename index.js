

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    const sidebarSearch = document.getElementById('sidebar-search');
    const courseSearch = document.getElementById('course-search');
    const headerSearch = document.getElementById('header-search');
    
    if (sidebarSearch) {
        sidebarSearch.addEventListener('input', (e) => {
            performGlobalSearch(e.target.value);
        });
    }
    
    if (courseSearch) {
        courseSearch.addEventListener('input', (e) => {
            performGlobalSearch(e.target.value);
        });
    }
    
    if (headerSearch) {
        headerSearch.addEventListener('input', (e) => {
            performGlobalSearch(e.target.value);
        });
    }
}

function performSearch(query) {
    // This function is now deprecated - use performGlobalSearch instead
    performGlobalSearch(query);
}

function performGlobalSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
        // Clear search - show all course items and reset current view
        if (categoriesView && categoriesView.style.display !== 'none') {
            const courseItems = document.querySelectorAll('.course-item');
            courseItems.forEach(item => {
                item.style.display = 'block';
            });
        } else if (courseView && courseView.style.display !== 'none') {
            // Reset to show all assignments in current course
            const currentCourseTitle = document.getElementById('course-title').textContent;
            Object.keys(categories).forEach(categoryId => {
                if (categories[categoryId].title === currentCourseTitle) {
                    renderAssignments(categories[categoryId].assignments);
                    return;
                }
            });
        }
        return;
    }
    
    // Find all matching games across all categories
    const allMatches = [];
    Object.keys(categories).forEach(categoryId => {
        const category = categories[categoryId];
        category.assignments.forEach(assignment => {
            if (assignment.title.toLowerCase().includes(searchTerm) ||
                assignment.type.toLowerCase().includes(searchTerm)) {
                allMatches.push({
                    ...assignment,
                    categoryName: category.title,
                    categoryId: categoryId
                });
            }
        });
    });
    
    if (allMatches.length === 0) {
        return; // No results
    }
    
    // Always show the category with the first match (even for single results)
    const firstMatch = allMatches[0];
    showSection(firstMatch.categoryId);
    
    // Then filter the assignments in that category to show only matches
    setTimeout(() => {
        const filteredAssignments = categories[firstMatch.categoryId].assignments.filter(assignment => 
            assignment.title.toLowerCase().includes(searchTerm) ||
            assignment.type.toLowerCase().includes(searchTerm)
        );
        renderAssignments(filteredAssignments);
    }, 100);
}

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
                path: './Juegos/snake/index.html'
            },
            {
                id: 'tictactoe-game',
                title: 'Tic-Tac-Toe',
                type: 'Strategy Game',
                dueDate: 'No due date',
                icon: 'grid_on',
                path: './Juegos/tictactoe/index.html'
            },
            {
                id: 'impostor-game',
                title: 'The Impostor',
                type: 'Social Deduction Game',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './Juegos/impostor/index.html'
            },
            {
                id: 'subway-surfers-newyork',
                title: 'Subway Surfers New York',
                type: 'Running Game',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './Juegos/subway-surfers-newyork-main/index.html'
            },
            {
                id: 'bitlife',
                title: 'BitLife',
                type: 'Life Simulator',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './Juegos/bitlife-main/index.html'
            },
            {
                id: 'slope',
                title: 'Slope',
                type: 'Endless Runner',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './Juegos/slope-main/index.html'
            },
            {
                id: 'temple-run-2',
                title: 'Temple Run 2',
                type: 'Endless Runner',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './Juegos/temple-run-2-main/index.html'
            }
        ]
    },
    'gambling': {
        title: 'Gambling Games',
        section: 'Casino & Card Games',
        backgroundImage: 'fondos/clase4.jpg',
        assignments: [
            {
                id: 'reta',
                title: 'Retabet - Sports Betting',
                type: 'Football Betting Platform',
                dueDate: 'No due date',
                icon: 'sports_soccer',
                path: './Juegos/reta/betting.html'
            },
            {
                id: 'poker',
                title: 'Classroom Poker',
                type: 'Texas Hold\'em',
                dueDate: 'No due date',
                icon: 'casino',
                path: './Juegos/poker/index.html'
            },
            {
                id: 'blackjack',
                title: 'Blackjack',
                type: 'Card Game',
                dueDate: 'No due date',
                icon: 'casino',
                path: './Juegos/black jack/index.html'
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
                path: './Juegos/drift-hunters-main/index.html'
            },
            {
                id: 'moto-x3m',
                title: 'Moto X3M',
                type: 'Motorcycle Racing',
                dueDate: 'No due date',
                icon: 'directions_car',
                path: './Juegos/moto-x3m-main/index.html'
            },
            {
                id: 'classroom',
                title: 'Highway Traffic',
                type: 'Traffic Game',
                dueDate: 'No due date',
                icon: 'directions_car',
                path: './Juegos/highway-traffic-main/index.html'
            },
            {
                id: 'rocket-soccer-derby',
                title: 'Rocket Soccer Derby',
                type: 'Soccer Racing',
                dueDate: 'No due date',
                icon: 'directions_car',
                path: './Juegos/rocket-soccer-derby-main/index.html'
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
                path: './Juegos/1v1-lol-main/index.html'
            },
            {
                id: 'rooftop-snipers',
                title: 'Rooftop Snipers',
                type: 'Shooting Game',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './Juegos/rooftop-snipers-main/index.html'
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
                path: './Juegos/penalty-shooters-2-main/index.html'
            },
            {
                id: 'football-masters',
                title: 'Football Master',
                type: 'Soccer Game',
                dueDate: 'No due date',
                icon: 'sports_esports',
                path: './Juegos/football-masters-main/index.html'
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

// ===== LOGIN AND USER MANAGEMENT =====
let currentUser = null;

function initializeLogin() {
    const accountBtn = document.getElementById('account-btn');
    const loginModal = document.getElementById('login-modal');
    const closeLoginBtn = document.getElementById('close-login');
    const loginForm = document.getElementById('login-form');
    const userInitials = document.getElementById('user-initials');
    const backBtn = document.getElementById('back-btn');

    console.log('Account button found:', !!accountBtn);

    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserDisplay();
    }

    // Account button click
    accountBtn.addEventListener('click', () => {
        console.log('Account button clicked!', currentUser);
        if (currentUser) {
            // User is logged in - show favorites
            showFavoritesModal();
        } else {
            // User is not logged in - show login modal
            loginModal.classList.add('active');
        }
    });

    // Close modal
    closeLoginBtn.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    // Close modal on outside click
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('login-name').value.trim();
        const surname = document.getElementById('login-surname').value.trim();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        
        if (name && surname && email && password) {
            // Create user object
            currentUser = {
                name: name,
                surname: surname,
                email: email,
                password: password, // In real app, this should be hashed
                initials: name.charAt(0).toUpperCase() + surname.charAt(0).toUpperCase(),
                favorites: JSON.parse(localStorage.getItem(`favorites_${email}`) || '[]')
            };
            
            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            updateUserDisplay();
            loginModal.classList.remove('active');
            loginForm.reset();
            
            // Load favorites for this user
            loadFavorites();
        }
    });

    // Back button click
    backBtn.addEventListener('click', () => {
        showHomepage();
    });

    // Zubiri logo button click - navigate to homepage
    const zubiriLogoBtn = document.getElementById('zubiri-logo-btn');
    if (zubiriLogoBtn) {
        zubiriLogoBtn.addEventListener('click', () => {
            showHomepage();
        });
    }

    // Euskadi logo button click - navigate to homepage
    const euskadiLogoBtn = document.getElementById('euskadi-logo-btn');
    if (euskadiLogoBtn) {
        euskadiLogoBtn.addEventListener('click', () => {
            showHomepage();
        });
    }
}

function updateUserDisplay() {
    const userInitials = document.getElementById('user-initials');
    if (currentUser) {
        const initials = currentUser.initials || 
            (currentUser.name.charAt(0).toUpperCase() + currentUser.surname.charAt(0).toUpperCase());
        userInitials.textContent = initials;
    } else {
        userInitials.textContent = '?';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserDisplay();
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Handle page navigation
            const page = link.getAttribute('data-page');
            handlePageNavigation(page);
        });
    });
}

function handlePageNavigation(page) {
    switch(page) {
        case 'home':
            showHomepage();
            setHeaderState(false, 'Página Principal');
            // Remove active class from all course items
            document.querySelectorAll('.course-item').forEach(item => {
                item.classList.remove('active');
            });
            break;
        case 'personal':
            // TODO: Implement personal area
            alert('Área personal - En desarrollo');
            break;
        case 'courses':
            // TODO: Implement courses page
            alert('Mis cursos - En desarrollo');
            break;
    }
}

function setHeaderState(isInSection, title) {
    const backBtn = document.getElementById('back-btn');
    const mainNav = document.getElementById('main-nav');
    const euskadiLogo = document.getElementById('euskadi-logo');
    const sectionTitle = document.getElementById('section-title');
    const mainHeader = document.querySelector('.main-header');
    
    if (isInSection) {
        // Show section view: back button + section title
        backBtn.style.display = 'flex';
        mainNav.style.display = 'none';
        euskadiLogo.style.display = 'none';
        sectionTitle.style.display = 'block';
        sectionTitle.textContent = title;
        // Add blue line to header
        mainHeader.classList.add('section-active');
    } else {
        // Show homepage view: navigation + logo
        backBtn.style.display = 'none';
        mainNav.style.display = 'flex';
        euskadiLogo.style.display = 'block';
        sectionTitle.style.display = 'none';
        // Remove blue line from header
        mainHeader.classList.remove('section-active');
    }
}

function showSection(courseId) {
    const category = categories[courseId];
    if (!category) {
        console.error('Category not found:', courseId);
        return;
    }

    // Update header state for section view
    setHeaderState(true, category.title);
    
    // Update page title
    updatePageTitle(courseId);
    
    // Hide homepage and show course view
    if (categoriesView) {
        categoriesView.style.display = 'none';
    }
    if (gamesView) {
        gamesView.style.display = 'flex';
    }
    
    // Update course information
    if (courseTitle) {
        courseTitle.textContent = category.title;
    }
    if (courseDescription) {
        courseDescription.textContent = category.section;
    }
    
    // Render assignments
    renderAssignments(category.assignments);
    
    // Set active state on course item
    document.querySelectorAll('.course-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeCourseItem = document.querySelector(`[data-course="${courseId}"]`);
    if (activeCourseItem) {
        activeCourseItem.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    applyCardBackgrounds();
    setupEventListeners();
    setupFavoritesListeners();
    initializeSearch();
    initializeLogin();
    initializeNavigation();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserDisplay();
        loadFavorites();
    }
});

function applyCardBackgrounds() {
    // No longer needed for list layout - course items don't have background images
    console.log('Background images disabled for list layout');
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
    // Homepage Course Items: Click to navigate to section
    const homepageCourseItems = document.querySelectorAll('.course-item');
    homepageCourseItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const courseId = item.getAttribute('data-course');
            if (courseId) {
                showSection(courseId);
            }
        });
    });

    // Initialize sidebar elements
    const leftSidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const mainContent = document.querySelector('.main-content');
    
    console.log('Sidebar elements found:', {
        leftSidebar: !!leftSidebar,
        sidebarOverlay: !!sidebarOverlay,
        mainContent: !!mainContent
    });
    
    // Ensure sidebar starts closed
    if (leftSidebar) {
        console.log('Initial sidebar state:', leftSidebar.classList.contains('open'));
        // Force remove open class and ensure proper initial state
        leftSidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        if (mainContent) mainContent.style.marginLeft = '0';
        
        // Double-check the sidebar is positioned correctly
        const computedStyle = window.getComputedStyle(leftSidebar);
        console.log('Sidebar left position:', computedStyle.left);
    }

    // Menu Toggle: Show/hide sidebar (header and course top bar)
    const menuToggles = document.querySelectorAll('.menu-button');
    console.log('Menu toggle buttons found:', menuToggles.length);
    menuToggles.forEach((menuToggle, index) => {
        console.log(`Menu button ${index}:`, menuToggle);
        if (menuToggle && leftSidebar) {
            menuToggle.addEventListener('click', () => {
                console.log('Menu toggle clicked');
                toggleSidebar();
            });
        }
    });
    
    // Overlay click to close sidebar
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            toggleSidebar();
        });
    }

    // Sidebar menu icon toggle
    const sidebarMenuIcon = document.querySelector('.sidebar-menu-icon');
    console.log('Sidebar menu icon found:', !!sidebarMenuIcon);
    if (sidebarMenuIcon) {
        sidebarMenuIcon.addEventListener('click', () => {
            console.log('Sidebar menu icon clicked');
            toggleSidebar();
        });
    } else {
        console.error('Sidebar menu icon not found');
    }

    // Helper function to toggle sidebar
    function toggleSidebar() {
        console.log('toggleSidebar called');
        if (!leftSidebar) {
            console.error('Sidebar element not found');
            return;
        }
        
        const isOpen = leftSidebar.classList.contains('open');
        console.log('Current sidebar state:', isOpen);
        
        if (isOpen) {
            // Close sidebar
            console.log('Closing sidebar');
            leftSidebar.classList.remove('open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            if (mainContent) mainContent.style.marginLeft = '0';
        } else {
            // Open sidebar
            console.log('Opening sidebar');
            leftSidebar.classList.add('open');
            if (sidebarOverlay) sidebarOverlay.classList.add('active');
            if (mainContent) mainContent.style.marginLeft = '280px';
        }
    }

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
            console.log('Courses header clicked');
            if (coursesList) {
                coursesList.classList.toggle('expanded');
                // Update the SVG icon rotation
                if (coursesArrow) {
                    if (coursesList.classList.contains('expanded')) {
                        coursesArrow.style.transform = 'rotate(180deg)';
                        console.log('Courses expanded');
                    } else {
                        coursesArrow.style.transform = 'rotate(0deg)';
                        console.log('Courses collapsed');
                    }
                }
            }
        });
    }

    // Sidebar: Home Navigation
    const navHome = document.getElementById('nav-home');
    if (navHome) {
        navHome.addEventListener('click', () => {
            // Remove active from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            // Add active to home
            navHome.classList.add('active');
            showHomepage();
            // Close sidebar after navigation
            toggleSidebar();
        });
    }

    // Sidebar: Course Items
    const courseItems = document.querySelectorAll('.course-item[data-course]');
    courseItems.forEach(item => {
        item.addEventListener('click', () => {
            const courseId = item.getAttribute('data-course');
            if (courseId) {
                // Remove active from all nav items
                document.querySelectorAll('.nav-item').forEach(navItem => {
                    navItem.classList.remove('active');
                });
                // Add active to calendar (since we're in a course section)
                const navCalendar = document.getElementById('nav-calendar');
                if (navCalendar) {
                    navCalendar.classList.add('active');
                }
                showSection(courseId);
                // Close sidebar after navigation
                toggleSidebar();
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

    // Contact Popup functionality
    const contactButtonHeader = document.getElementById('contact-button-header');
    const contactButtonCourse = document.getElementById('contact-button');
    const contactPopup = document.getElementById('contact-popup');
    const contactPopupClose = document.getElementById('contact-popup-close');

    // Handle both contact buttons
    [contactButtonHeader, contactButtonCourse].forEach(button => {
        if (button && contactPopup) {
            button.addEventListener('click', () => {
                console.log('Contact button clicked');
                contactPopup.classList.add('active');
            });
        }
    });

    if (contactPopupClose && contactPopup) {
        contactPopupClose.addEventListener('click', () => {
            console.log('Contact popup close clicked');
            contactPopup.classList.remove('active');
        });
    }

    // Close popup when clicking outside
    if (contactPopup) {
        contactPopup.addEventListener('click', (e) => {
            if (e.target === contactPopup) {
                contactPopup.classList.remove('active');
            }
        });
    }

    // Copy email to clipboard functionality
    const emailLink = document.querySelector('.email-link');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default mailto behavior
            const email = 'e33.classroom@gmail.com';
            
            // Copy to clipboard
            navigator.clipboard.writeText(email).then(() => {
                // Show temporary feedback
                const originalText = emailLink.textContent;
                emailLink.textContent = '¡Copiado!';
                emailLink.style.color = 'var(--google-green)';
                
                // Revert after 2 seconds
                setTimeout(() => {
                    emailLink.textContent = originalText;
                    emailLink.style.color = 'var(--google-blue)';
                }, 2000);
                
                console.log('Email copied to clipboard:', email);
            }).catch(err => {
                console.error('Failed to copy email:', err);
                // Fallback: select text for manual copy
                const textArea = document.createElement('textarea');
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Show feedback
                const originalText = emailLink.textContent;
                emailLink.textContent = '¡Copiado!';
                emailLink.style.color = 'var(--google-green)';
                
                setTimeout(() => {
                    emailLink.textContent = originalText;
                    emailLink.style.color = 'var(--google-blue)';
                }, 2000);
            });
        });
    }
}

// ===== UPDATE PAGE TITLE =====
function updatePageTitle(sectionName) {
    if (sectionName === 'home') {
        document.title = 'Página Principal | Moodle';
    } else if (sectionName === 'E33') {
        document.title = '0222_PostuBakarrekoSistemaEragileak';
    } else if (sectionName === 'Gambling Games') {
        document.title = '0225_SareLokalak-2 | Moodle';
    } else if (sectionName === 'Car Games') {
        document.title = 'Curso: 01-InformatikaSegurtasuna(GOIZEZ) | Moodle';
    } else if (sectionName === '1v1') {
        document.title = 'Ikastaroa: 1664_Produkzio sektoreei aplikatutako digitalizazioa_EM-2 | Moodle';
    } else if (sectionName === 'Football Games') {
        document.title = 'Curso: MS21-2_English | Moodle';
    } else {
        document.title = `${sectionName} | Moodle`;
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

    // Update page title
    updatePageTitle(category.title);

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
    
    // Update page title to home
    updatePageTitle('home');
    
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

// ===== DARK MODE FUNCTIONALITY =====
const darkModeToggle = document.getElementById('dark-mode-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// Load dark mode preference from localStorage
function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

// Toggle dark mode
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    
    // Toggle icons
    if (isDarkMode) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
}

// Initialize dark mode
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
    loadDarkModePreference();
}

// ===== FAVORITES SYSTEM =====
function showFavoritesModal() {
    const favoritesModal = document.getElementById('favorites-modal');
    favoritesModal.classList.add('active');
    loadFavoritesList();
}

function hideFavoritesModal() {
    const favoritesModal = document.getElementById('favorites-modal');
    favoritesModal.classList.remove('active');
}

function loadFavorites() {
    if (!currentUser) return;
    
    // Update favorite buttons state
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    favoriteBtns.forEach(btn => {
        const courseId = btn.getAttribute('data-course');
        if (currentUser.favorites.includes(courseId)) {
            btn.classList.add('active');
            btn.setAttribute('title', 'Quitar de favoritos');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('title', 'Añadir a favoritos');
        }
    });
}

function loadFavoritesList() {
    if (!currentUser) return;
    
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';
    
    if (currentUser.favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-favorites">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <p>No tienes juegos favoritos aún</p>
                <p>Añade juegos desde la página principal</p>
            </div>
        `;
        return;
    }
    
    currentUser.favorites.forEach(courseId => {
        const category = categories[courseId];
        if (category) {
            const favoriteItem = createFavoriteItem(courseId, category);
            favoritesList.appendChild(favoriteItem);
        }
    });
}

function createFavoriteItem(courseId, category) {
    const item = document.createElement('div');
    item.className = 'favorite-item';
    item.innerHTML = `
        <div class="favorite-info">
            <div class="favorite-icon" style="background-color: ${category.color}">
                ${category.title.charAt(0)}
            </div>
            <div class="favorite-details">
                <h4>${category.title}</h4>
                <p>${category.description}</p>
            </div>
        </div>
        <button class="remove-favorite" data-course="${courseId}" title="Quitar de favoritos">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    `;
    
    // Add click event to navigate to game
    item.querySelector('.favorite-info').addEventListener('click', () => {
        hideFavoritesModal();
        showSection(courseId);
    });
    
    // Add remove event
    item.querySelector('.remove-favorite').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(courseId);
    });
    
    return item;
}

function toggleFavorite(courseId) {
    if (!currentUser) {
        loginModal.classList.add('active');
        return;
    }
    
    const index = currentUser.favorites.indexOf(courseId);
    if (index > -1) {
        // Remove from favorites
        currentUser.favorites.splice(index, 1);
    } else {
        // Add to favorites
        currentUser.favorites.push(courseId);
    }
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem(`favorites_${currentUser.email}`, JSON.stringify(currentUser.favorites));
    
    // Update UI
    loadFavorites();
    loadFavoritesList();
}

// Setup favorites event listeners
function setupFavoritesListeners() {
    // Favorite buttons on homepage
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const courseId = btn.getAttribute('data-course');
            toggleFavorite(courseId);
        });
    });
    
    // Close favorites modal
    const closeFavoritesBtn = document.getElementById('close-favorites');
    if (closeFavoritesBtn) {
        closeFavoritesBtn.addEventListener('click', hideFavoritesModal);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                logout();
                hideFavoritesModal();
            }
        });
    }
    
    // Close modal on outside click
    const favoritesModal = document.getElementById('favorites-modal');
    if (favoritesModal) {
        favoritesModal.addEventListener('click', (e) => {
            if (e.target === favoritesModal) {
                hideFavoritesModal();
            }
        });
    }
}
