// ===== GAME STATE =====
const gameState = {
    players: [],
    currentWord: '',
    impostorIndex: -1,
    impostorSynonym: '',
    gameMode: '', // 'with-hints' or 'without-hints'
    selectedSection: '', // selected word section
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

// ===== THEMED WORD SECTIONS =====
const wordSections = {
    celebrities: [
        { word: 'Eminem', synonym: 'Detroit' },
        { word: 'Snoop Dogg', synonym: 'Ganja' },
        { word: 'Dr. Dre', synonym: 'Productor' },
        { word: 'Tupac Shakur', synonym: 'Leyenda' },
        { word: '50 Cent', synonym: 'Survivor' },
        { word: 'Lil Wayne', synonym: 'Tatuajes' },
        { word: 'Kendrick Lamar', synonym: 'Premios' },
        { word: 'Jay-Z', synonym: 'Empresario' },
        { word: 'The Notorious B.I.G.', synonym: 'Brooklyn' },
        { word: 'Nas', synonym: 'Nueva York' },
        { word: 'Kanye West', synonym: 'Yé' },
        { word: 'Big Daddy Kane', synonym: 'Leyenda' },
        { word: 'Cardi B', synonym: 'Fuerte' },
        { word: 'Lil Nas X', synonym: 'Old Town' },
        { word: 'Megan Thee Stallion', synonym: 'Texas' },
        { word: 'Travis Scott', synonym: 'Astroworld' },
        { word: 'Post Malone', synonym: 'Tatuajes' },
        { word: 'Doja Cat', synonym: 'Viral' },
        { word: 'Logic', synonym: 'Paz' },
        { word: 'Juice WRLD', synonym: 'Emoción' },
        { word: 'Leonardo DiCaprio', synonym: 'Ecoactivista' },
        { word: 'Brad Pitt', synonym: 'Carismático' },
        { word: 'Angelina Jolie', synonym: 'Muchos hijos' },
        { word: 'Tom Cruise', synonym: 'Cientología' },
        { word: 'Julia Roberts', synonym: 'Pretty Woman' },
        { word: 'Robert De Niro', synonym: 'Mafioso' },
        { word: 'Al Pacino', synonym: 'El Padrino' },
        { word: 'Meryl Streep', synonym: 'Versátil' },
        { word: 'Dwayne Johnson', synonym: 'La Roca' },
        { word: 'Scarlett Johansson', synonym: 'Viuda Negra' },
        { word: 'Chris Hemsworth', synonym: 'Thor' },
        { word: 'Jennifer Lawrence', synonym: 'Sincera' },
        { word: 'Ryan Gosling', synonym: 'Romántico' },
        { word: 'Emma Stone', synonym: 'Carismática' },
        { word: 'Will Smith', synonym: 'Encantador' },
        { word: 'Beyoncé', synonym: 'Reina' },
        { word: 'Taylor Swift', synonym: 'Romántica' },
        { word: 'Rihanna', synonym: 'Barbadiense' },
        { word: 'Drake', synonym: 'Rapero' },
        { word: 'Adele', synonym: 'Británica' },
        { word: 'Ed Sheeran', synonym: 'Guitarra' },
        { word: 'Lady Gaga', synonym: 'Extravagante' },
        { word: 'Madonna', synonym: 'Ícono' },
        { word: 'Michael Jackson', synonym: 'Rey del pop' },
        { word: 'Elvis Presley', synonym: 'Rey del rock' },
        { word: 'Marilyn Monroe', synonym: 'Icono de Hollywood' },
        { word: 'Audrey Hepburn', synonym: 'Elegancia clásica' },
        { word: 'James Dean', synonym: 'Rebelde sin causa' },
        { word: 'Charlie Chaplin', synonym: 'Cómico legendario' }

    ],
    soccer: [
        { word: 'Messi', synonym: 'Ganador de 7 Balones de Oro' },
        { word: 'Cristiano Ronaldo', synonym: 'Ganador de 5 Balones de Oro' },
        { word: 'Pelé', synonym: 'Rey del Fútbol' },
        { word: 'Maradona', synonym: 'Mano de Dios' },
        { word: 'Zidane', synonym: 'Gol de cabeza en final' },
        { word: 'Ronaldinho', synonym: 'El Mago del Balón' },
        { word: 'Ronaldo Nazario', synonym: 'El Fenómeno' },
        { word: 'Xavi', synonym: 'Mediocampista Barcelona' },
        { word: 'Iniesta', synonym: 'Gol en final del Mundial' },
        { word: 'Casillas', synonym: 'Portero legendario' },
        { word: 'Buffon', synonym: 'Portero Italiano' },
        { word: 'Neuer', synonym: 'Portero Moderno' },
        { word: 'Kahn', synonym: 'Titán Alemán' },
        { word: 'Cantona', synonym: 'Rey de Manchester' },
        { word: 'Henry', synonym: 'Goleador Arsenal' },
        { word: 'Bergkamp', synonym: 'Holandés Fluido' },
        { word: 'Van Persie', synonym: 'Gol de volea' },
        { word: 'Robben', synonym: 'Velocista Holandés' },
        { word: 'Sneijder', synonym: 'Mediocampista Creativo' },
        { word: 'Van Dijk', synonym: 'Defensa Central' },
        { word: 'De Bruyne', synonym: 'Mediocampista Bélgica' },
        { word: 'Hazard', synonym: 'Extremo Bélgica' },
        { word: 'Lukaku', synonym: 'Goleador Bélgica' },
        { word: 'Salah', synonym: 'Faraón Egipcio' },
        { word: 'Mané', synonym: 'Velocista Senegalés' },
        { word: 'Firmino', synonym: 'Delantero Brasilero' },
        { word: 'Alisson', synonym: 'Portero Brasilero' },
        { word: 'Ederson', synonym: 'Portero Manchester City' },
        { word: 'De Gea', synonym: 'Portero Español' },
        { word: 'Ramos', synonym: 'Defensa Español' },
        { word: 'Piqué', synonym: 'Defensa Barcelona' },
        { word: 'Busquets', synonym: 'Mediocentro Barcelona' },
        { word: 'Alba', synonym: 'Lateral Barcelona' },
        { word: 'Jordi Alba', synonym: 'Lateral Español' },
        { word: 'Thiago', synonym: 'Mediocampista Español' },
        { word: 'Pedri', synonym: 'Joven promesa' },
        { word: 'Gavi', synonym: 'Perla catalana' },
        { word: 'Ansu Fati', synonym: 'Talento Lesionado' },
        { word: 'Lewandowski', synonym: 'Goleador Polaco' },
        { word: 'Müller', synonym: 'Alemán Clásico' },
        { word: 'Goretzka', synonym: 'Mediocampista Alemán' },
        { word: 'Kimmich', synonym: 'Versátil Alemán' },
        { word: 'Haaland', synonym: 'Goleador Noruego' },
        { word: 'Mbappé', synonym: 'Estrella Francesa' },
        { word: 'Griezmann', synonym: 'Delantero Francés' },
        { word: 'Pogba', synonym: 'Mediocampista Francés' },
        { word: 'Kanté', synonym: 'Motor Francés' },
        { word: 'Varane', synonym: 'Defensa Francés' },
        { word: 'Lloris', synonym: 'Portero Francés' },
        { word: 'Son Heung-min', synonym: 'Estrella Coreana' },
        { word: 'Kane', synonym: 'Goleador Inglés' },
        { word: 'Sterling', synonym: 'Extremo Inglés' },
        { word: 'Foden', synonym: 'Talento Manchester' },
        { word: 'Bellingham', synonym: 'Joven estrella' },
        { word: 'Rice', synonym: 'Mediocampista Inglés' },
        { word: 'Saka', synonym: 'Extremo Arsenal' },
        { word: 'Odegaard', synonym: 'Capitán Arsenal' }
    ],
    technology: [
        { word: 'iPhone', synonym: 'Teléfono Apple' },
        { word: 'Android', synonym: 'Sistema Google' },
        { word: 'Laptop', synonym: 'Computadora portátil' },
        { word: 'Tablet', synonym: 'Dispositivo táctil' },
        { word: 'Smartwatch', synonym: 'Reloj inteligente' },
        { word: 'Headphones', synonym: 'Audífonos' },
        { word: 'Speaker', synonym: 'Altavoz' },
        { word: 'Router', synonym: 'Dispositivo WiFi' },
        { word: 'Modem', synonym: 'Conexión internet' },
        { word: 'Server', synonym: 'Computadora central' },
        { word: 'Cloud', synonym: 'Almacenamiento online' },
        { word: 'AI', synonym: 'Inteligencia Artificial' },
        { word: 'Machine Learning', synonym: 'Aprendizaje automático' },
        { word: 'Blockchain', synonym: 'Tecnología cadena' },
        { word: 'Cryptocurrency', synonym: 'Moneda digital' },
        { word: 'Bitcoin', synonym: 'Criptomoneda principal' },
        { word: 'Ethereum', synonym: 'Plataforma smart contracts' },
        { word: 'NFT', synonym: 'Token no fungible' },
        { word: 'Metaverse', synonym: 'Mundo virtual' },
        { word: 'VR', synonym: 'Realidad Virtual' },
        { word: 'AR', synonym: 'Realidad Aumentada' },
        { word: 'Drone', synonym: 'Vehículo aéreo' },
        { word: 'Robot', synonym: 'Máquina autónoma' },
        { word: 'IoT', synonym: 'Internet de las cosas' },
        { word: '5G', synonym: 'Red móvil rápida' },
        { word: 'WiFi', synonym: 'Red inalámbrica' },
        { word: 'Bluetooth', synonym: 'Conexión cercana' },
        { word: 'USB', synonym: 'Puerto universal' },
        { word: 'HDMI', synonym: 'Conexión video' },
        { word: 'Ethernet', synonym: 'Cable red' },
        { word: 'Fiber Optic', synonym: 'Conexión rápida' },
        { word: 'Satellite', synonym: 'Comunicación espacial' },
        { word: 'GPS', synonym: 'Sistema posicionamiento' },
        { word: 'App', synonym: 'Aplicación móvil' },
        { word: 'Software', synonym: 'Programa computadora' },
        { word: 'Hardware', synonym: 'Componentes físicos' },
        { word: 'CPU', synonym: 'Procesador' },
        { word: 'GPU', synonym: 'Tarjeta gráfica' },
        { word: 'RAM', synonym: 'Memoria' },
        { word: 'SSD', synonym: 'Almacenamiento rápido' },
        { word: 'HDD', synonym: 'Disco duro' },
        { word: 'Motherboard', synonym: 'Tarjeta principal' },
        { word: 'Power Supply', synonym: 'Fuente energía' },
        { word: 'Cooling System', synonym: 'Sistema refrigeración' },
        { word: 'Case', synonym: 'Caja computadora' },
        { word: 'Monitor', synonym: 'Pantalla' },
        { word: 'Keyboard', synonym: 'Teclado' },
        { word: 'Mouse', synonym: 'Ratón' },
        { word: 'Webcam', synonym: 'Cámara web' },
        { word: 'Microphone', synonym: 'Micrófono' },
        { word: 'Printer', synonym: 'Impresora' },
        { word: 'Scanner', synonym: 'Escáner' },
        { word: 'Projector', synonym: 'Proyector' },
        { word: 'Smart TV', synonym: 'Televisión inteligente' },
        { word: 'Streaming', synonym: 'Transmisión online' },
        { word: 'Netflix', synonym: 'Plataforma series' },
        { word: 'YouTube', synonym: 'Plataforma videos' },
        { word: 'Twitch', synonym: 'Plataforma gaming' },
        { word: 'Discord', synonym: 'Comunicación gamers' },
        { word: 'Zoom', synonym: 'Videoconferencias' },
        { word: 'Slack', synonym: 'Comunicación equipo' }
    ],
    nature: [
        { word: 'Montaña', synonym: 'Altura natural' },
        { word: 'Río', synonym: 'Agua corriente' },
        { word: 'Lago', synonym: 'Agua estancada' },
        { word: 'Océano', synonym: 'Agua salada grande' },
        { word: 'Playa', synonym: 'Costa arena' },
        { word: 'Bosque', synonym: 'Árboles densos' },
        { word: 'Selva', synonym: 'Vegetación tropical' },
        { word: 'Desierto', synonym: 'Zona árida' },
        { word: 'Cascada', synonym: 'Agua cayendo' },
        { word: 'Volcán', synonym: 'Montaña eruptiva' },
        { word: 'Glaciar', synonym: 'Hielo gigante' },
        { word: 'Cueva', synonym: 'Formación rocosa' },
        { word: 'Cañón', synonym: 'Valle profundo' },
        { word: 'Valle', synonym: 'Tierra baja' },
        { word: 'Colina', synonym: 'Montaña pequeña' },
        { word: 'Mesa', synonym: 'Meseta plana' },
        { word: 'Península', synonym: 'Tierra rodeada agua' },
        { word: 'Isla', synonym: 'Tierra aislada' },
        { word: 'Arrecife', synonym: 'Formación marina' },
        { word: 'Atolón', synonym: 'Isla coral' },
        { word: 'Delta', synonym: 'Desembocadura río' },
        { word: 'Estuario', synonym: 'Mezcla agua salada' },
        { word: 'Marisma', synonym: 'Tierra húmeda' },
        { word: 'Pantano', synonym: 'Agua estancada vegetación' },
        { word: 'Pradera', synonym: 'Hierba extensa' },
        { word: 'Sabana', synonym: 'Pastizal africano' },
        { word: 'Tundra', synonym: 'Vegetación ártica' },
        { word: 'Taiga', synonym: 'Bosque coníferas' },
        { word: 'Estepa', synonym: 'Llanura sin árboles' },
        { word: 'Pampa', synonym: 'Llanura sudamericana' },
        { word: 'Veld', synonym: 'Pradera sudafricana' },
        { word: 'Outback', synonym: 'Desierto australiano' },
        { word: 'Sahara', synonym: 'Desierto más grande' },
        { word: 'Amazonas', synonym: 'Selva más grande' },
        { word: 'Himalaya', synonym: 'Montañas más altas' },
        { word: 'Alpes', synonym: 'Montañas europeas' },
        { word: 'Rocosas', synonym: 'Montañas americanas' },
        { word: 'Andes', synonym: 'Montañas sudamericanas' },
        { word: 'Everest', synonym: 'Montaña más alta' },
        { word: 'K2', synonym: 'Segunda montaña más alta' },
        { word: 'Kilimanjaro', synonym: 'Montaña africana' },
        { word: 'Mont Blanc', synonym: 'Montaña europea' },
        { word: 'Denali', synonym: 'Montaña norteamericana' },
        { word: 'Aconcagua', synonym: 'Montaña sudamericana' },
        { word: 'Nilo', synonym: 'Río más largo' },
        { word: 'Amazonas Río', synonym: 'Río más caudaloso' },
        { word: 'Misisipi', synonym: 'Río americano' },
        { word: 'Danubio', synonym: 'Río europeo' },
        { word: 'Rin', synonym: 'Río Alemania' },
        { word: 'Támesis', synonym: 'Río Londres' },
        { word: 'Sena', synonym: 'Río París' },
        { word: 'Tiber', synonym: 'Río Roma' },
        { word: 'Ganges', synonym: 'Río sagrado' },
        { word: 'Yangtsé', synonym: 'Río chino' },
        { word: 'Mekong', synonym: 'Río asiático' },
        { word: 'Colorado', synonym: 'Río cañón' },
        { word: 'Yukon', synonym: 'Río ártico' },
        { word: 'Mackenzie', synonym: 'Río canadiense' },
        { word: 'Murray', synonym: 'Río australiano' }
    ],
    movies: [
        { word: 'Titanic', synonym: 'Barco hundido' },
        { word: 'Avatar', synonym: 'Mundo Pandora' },
        { word: 'Star Wars', synonym: 'Galaxia lejana' },
        { word: 'Harry Potter', synonym: 'Mago escuela' },
        { word: 'Lord of the Rings', synonym: 'Anillo poder' },
        { word: 'Marvel', synonym: 'Superhéroes' },
        { word: 'DC', synonym: 'Superhéroes cómics' },
        { word: 'Spider-Man', synonym: 'Hombre araña' },
        { word: 'Batman', synonym: 'Caballero oscuro' },
        { word: 'Superman', synonym: 'Hombre acero' },
        { word: 'Iron Man', synonym: 'Hombre hierro' },
        { word: 'Captain America', synonym: 'Soldado americano' },
        { word: 'Thor', synonym: 'Dios trueno' },
        { word: 'Hulk', synonym: 'Hombre verde' },
        { word: 'Black Widow', synonym: 'Espía rusa' },
        { word: 'Hawkeye', synonym: 'Arquero' },
        { word: 'Black Panther', synonym: 'Rey Wakanda' },
        { word: 'Doctor Strange', synonym: 'Mago tiempo' },
        { word: 'Ant-Man', synonym: 'Hombre hormiga' },
        { word: 'Guardians Galaxy', synonym: 'Equipo espacial' },
        { word: 'Avengers', synonym: 'Equipo superhéroes' },
        { word: 'Justice League', synonym: 'Equipo DC' },
        { word: 'Wonder Woman', synonym: 'Princesa amazona' },
        { word: 'Aquaman', synonym: 'Rey océano' },
        { word: 'Flash', synonym: 'Velocista' },
        { word: 'Cyborg', synonym: 'Hombre máquina' },
        { word: 'Shazam', synonym: 'Niño superpoder' },
        { word: 'Joker', synonym: 'Villano risa' },
        { word: 'Lex Luthor', synonym: 'Villano inteligente' },
        { word: 'Thanos', synonym: 'Titán loco' },
        { word: 'Loki', synonym: 'Dios engaño' },
        { word: 'Ultron', synonym: 'Robot maligno' },
        { word: 'Voldemort', synonym: 'Señor oscuro' },
        { word: 'Darth Vader', synonym: 'Padre Skywalker' },
        { word: 'Emperor Palpatine', synonym: 'Emperador Sith' },
        { word: 'Sauron', synonym: 'Señor anillo' },
        { word: 'Gollum', synonym: 'Criatura anillo' },
        { word: 'Gandalf', synonym: 'Mago gris' },
        { word: 'Frodo', synonym: 'Portador anillo' },
        { word: 'Aragorn', synonym: 'Rey Gondor' },
        { word: 'Legolas', synonym: 'Elfo arquero' },
        { word: 'Gimli', synonym: 'Enano hacha' },
        { word: 'Hermione', synonym: 'Maga inteligente' },
        { word: 'Ron', synonym: 'Amigo mago' },
        { word: 'Dumbledore', synonym: 'Director Hogwarts' },
        { word: 'Snape', synonym: 'Profesor poción' },
        { word: 'McGonagall', synonym: 'Profesora transformación' },
        { word: 'Hagrid', synonym: 'Gigante amable' },
        { word: 'Dobby', synonym: 'Elfo libre' },
        { word: 'Voldemort', synonym: 'Señor tenebroso' },
        { word: 'Bellatrix', synonym: 'Mortífaga leal' },
        { word: 'Lucius Malfoy', synonym: 'Padre Draco' },
        { word: 'Draco Malfoy', synonym: 'Rival Harry' },
        { word: 'Sirius Black', synonym: 'Padrino Harry' },
        { word: 'Remus Lupin', synonym: 'Profesor licántropo' },
        { word: 'James Bond', synonym: 'Agente 007' },
        { word: 'Indiana Jones', synonym: 'Arqueólogo aventurero' },
        { word: 'Jurassic Park', synonym: 'Parque dinosaurios' },
        { word: 'Jaws', synonym: 'Tiburon terror' },
        { word: 'ET', synonym: 'Extraterrestre amigo' },
        { word: 'Back Future', synonym: 'Viaje tiempo' }
    ]
};

// For backward compatibility, use celebrities section as default
let wordBank = wordSections.celebrities;

// ===== DOM ELEMENTS =====
let setupScreen, sectionSelectionScreen, modeSelectionScreen, cardRevealScreen, gameRoundScreen, votingScreen, resultScreen;
let playerNameInput, addPlayerBtn, startGameBtn, clearPlayersBtn, playersListDiv, playerCountDiv, errorMessageDiv;
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
    sectionSelectionScreen = document.getElementById('section-selection-screen');
    modeSelectionScreen = document.getElementById('mode-selection-screen');
    cardRevealScreen = document.getElementById('card-reveal-screen');
    gameRoundScreen = document.getElementById('game-round-screen');
    votingScreen = document.getElementById('voting-screen');
    resultScreen = document.getElementById('result-screen');

    // Setup Screen
    playerNameInput = document.getElementById('player-name-input');
    addPlayerBtn = document.getElementById('add-player-btn');
    startGameBtn = document.getElementById('start-game-btn');
    clearPlayersBtn = document.getElementById('clear-players-btn');
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
    addPlayerBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        addPlayer();
    }, { passive: false });
    
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });
    
    startGameBtn.addEventListener('click', showModeSelection);
    startGameBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        showModeSelection();
    }, { passive: false });

    // Clear Players Button
    clearPlayersBtn.addEventListener('click', newGameWithNewPlayers);
    clearPlayersBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        newGameWithNewPlayers();
    }, { passive: false });

    // Section Selection Screen
    document.querySelectorAll('.section-card').forEach(card => {
        card.addEventListener('click', () => {
            const section = card.dataset.section;
            if (section === 'random') {
                selectRandomSection();
            } else {
                selectSection(section);
            }
        });
        
        // Add touch event for mobile compatibility
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const section = card.dataset.section;
            if (section === 'random') {
                selectRandomSection();
            } else {
                selectSection(section);
            }
        }, { passive: false });
    });

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
    nextPlayerBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        showNextPlayer();
    }, { passive: false });
    
    continueToRoundBtn.addEventListener('click', startRound);
    continueToRoundBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startRound();
    }, { passive: false });

    // Game Round Screen
    endRoundBtn.addEventListener('click', endRound);
    endRoundBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        endRound();
    }, { passive: false });

    // Voting Screen
    nextVoterBtn.addEventListener('click', showNextVoter);
    nextVoterBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        showNextVoter();
    }, { passive: false });
    
    finishVotingBtn.addEventListener('click', finishVoting);
    finishVotingBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        finishVoting();
    }, { passive: false });
    
    submitVoteBtn.addEventListener('click', submitVote);
    submitVoteBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        submitVote();
    }, { passive: false });

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
        
        // Add touch event to remove button for mobile compatibility
        const removeBtn = tag.querySelector('.remove-btn');
        removeBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            removePlayer(index);
        }, { passive: false });
        
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

// ===== SECTION SELECTION =====
function showSectionSelection() {
    switchScreen(sectionSelectionScreen);
}

function selectSection(sectionKey) {
    gameState.selectedSection = sectionKey;
    wordBank = wordSections[sectionKey];
    triggerHapticFeedback();
    showModeSelectionAfterSection();
}

function selectRandomSection() {
    const sections = Object.keys(wordSections);
    const randomSection = sections[Math.floor(Math.random() * sections.length)];
    selectSection(randomSection);
}

// ===== GAME MODE SELECTION =====
function showModeSelection() {
    // Show section selection first
    showSectionSelection();
}

function showModeSelectionAfterSection() {
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
                <button class="btn btn-primary card-ready-btn">Verificado</button>
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
    card.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (!card.classList.contains('flipped') && !gameState.cardRevealed) {
            card.classList.add('flipped');
            triggerHapticFeedback();
        }
    }, { passive: false });
    
    // Prevent long press context menu on mobile
    card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Add proper event listeners to the ready button
    const readyBtn = currentPlayerCard.querySelector('.card-ready-btn');
    if (readyBtn) {
        // Click event for desktop
        readyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!gameState.cardRevealed) {
                markCardRevealed();
            }
        });
        
        // Touch event for mobile
        readyBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!gameState.cardRevealed) {
                markCardRevealed();
            }
        }, { passive: false });
    }
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
    
    // Add touch event for result action button
    resultActionBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        resultActionBtn.click();
    }, { passive: false });
    
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
    // Reset game state but preserve players
    gameState.gameMode = '';
    gameState.selectedSection = '';
    gameState.currentWord = '';
    gameState.impostorIndex = -1;
    gameState.impostorSynonym = '';
    gameState.currentPlayerIndex = 0;
    gameState.cardRevealed = false;
    gameState.currentVoterIndex = 0;
    gameState.votes = {};
    gameState.eliminatedPlayers = [];
    gameState.selectedVote = null;

    // Clear timer if running
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    gameState.timeRemaining = 300;

    // Update UI to show existing players
    updatePlayersList();
    updatePlayerCount();
    checkStartButton();
    playerNameInput.value = '';
    errorMessageDiv.textContent = '';

    switchScreen(setupScreen);
}

function newGameWithNewPlayers() {
    // Complete reset including players
    gameState.players = [];
    gameState.gameMode = '';
    gameState.selectedSection = '';
    gameState.currentWord = '';
    gameState.impostorIndex = -1;
    gameState.impostorSynonym = '';
    gameState.currentPlayerIndex = 0;
    gameState.cardRevealed = false;
    gameState.currentVoterIndex = 0;
    gameState.votes = {};
    gameState.eliminatedPlayers = [];
    gameState.selectedVote = null;

    // Clear timer if running
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    gameState.timeRemaining = 300;

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
