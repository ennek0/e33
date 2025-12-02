// ===== ANALYTICS & STATISTICS =====
// This file handles all analytics and statistics tracking for the games

// ===== UMAMI ANALYTICS INTEGRATION =====
class Analytics {
    constructor() {
        this.gameSessions = {};
        this.currentGame = null;
        this.startTime = null;
        
        // Initialize analytics when page loads
        this.init();
    }

    init() {
        // Track page view
        this.trackPageView();
        
        // Track game sessions
        this.trackGameSessions();
        
        // Track user interactions
        this.trackInteractions();
    }

    // ===== PAGE TRACKING =====
    trackPageView() {
        // Track which game page is being viewed
        const path = window.location.pathname;
        const gameName = this.getGameNameFromPath(path);
        
        if (typeof umami !== 'undefined') {
            umami.track('page_view', {
                game: gameName,
                path: path,
                timestamp: new Date().toISOString()
            });
        }
    }

    getGameNameFromPath(path) {
        if (path.includes('impostor')) return 'Impostor';
        if (path.includes('poker')) return 'Poker';
        if (path.includes('blackjack')) return 'Blackjack';
        if (path.includes('snake')) return 'Snake';
        if (path.includes('tictactoe')) return 'Tic-Tac-Toe';
        return 'Unknown';
    }

    // ===== GAME SESSION TRACKING =====
    startGameSession(gameName) {
        this.currentGame = gameName;
        this.startTime = Date.now();
        
        const sessionId = this.generateSessionId();
        this.gameSessions[sessionId] = {
            game: gameName,
            startTime: this.startTime,
            events: []
        };

        if (typeof umami !== 'undefined') {
            umami.track('game_start', {
                game: gameName,
                session_id: sessionId,
                timestamp: new Date().toISOString()
            });
        }

        return sessionId;
    }

    endGameSession(sessionId, result = 'completed') {
        if (!this.gameSessions[sessionId]) return;

        const session = this.gameSessions[sessionId];
        const duration = Date.now() - session.startTime;

        if (typeof umami !== 'undefined') {
            umami.track('game_end', {
                game: session.game,
                session_id: sessionId,
                duration: duration,
                result: result,
                events_count: session.events.length,
                timestamp: new Date().toISOString()
            });
        }

        // Clean up session
        delete this.gameSessions[sessionId];
        this.currentGame = null;
        this.startTime = null;
    }

    // ===== EVENT TRACKING =====
    trackEvent(eventName, properties = {}) {
        if (!this.currentGame) return;

        const sessionId = this.getCurrentSessionId();
        if (sessionId && this.gameSessions[sessionId]) {
            this.gameSessions[sessionId].events.push({
                name: eventName,
                properties: properties,
                timestamp: Date.now()
            });
        }

        if (typeof umami !== 'undefined') {
            umami.track(eventName, {
                game: this.currentGame,
                session_id: sessionId,
                ...properties,
                timestamp: new Date().toISOString()
            });
        }
    }

    // ===== GAME-SPECIFIC TRACKING =====
    
    // Impostor Game Events
    trackImpostorEvent(eventType, data) {
        const events = {
            'player_added': 'Player Added',
            'game_started': 'Game Started',
            'mode_selected': 'Mode Selected',
            'card_revealed': 'Card Revealed',
            'voting_started': 'Voting Started',
            'vote_cast': 'Vote Cast',
            'player_eliminated': 'Player Eliminated',
            'game_won': 'Game Won',
            'game_lost': 'Game Lost'
        };

        this.trackEvent(events[eventType] || eventType, {
            game_type: 'impostor',
            ...data
        });
    }

    // Poker Game Events
    trackPokerEvent(eventType, data) {
        const events = {
            'cards_dealt': 'Cards Dealt',
            'bet_placed': 'Bet Placed',
            'player_folded': 'Player Folded',
            'player_checked': 'Player Checked',
            'player_called': 'Player Called',
            'player_raised': 'Player Raised',
            'round_completed': 'Round Completed',
            'showdown': 'Showdown',
            'pot_won': 'Pot Won',
            'chips_lost': 'Chips Lost'
        };

        this.trackEvent(events[eventType] || eventType, {
            game_type: 'poker',
            ...data
        });
    }

    // Blackjack Game Events
    trackBlackjackEvent(eventType, data) {
        const events = {
            'cards_dealt': 'Cards Dealt',
            'hit': 'Hit',
            'stand': 'Stand',
            'double_down': 'Double Down',
            'split': 'Split',
            'blackjack': 'Blackjack',
            'bust': 'Bust',
            'win': 'Win',
            'lose': 'Lose',
            'push': 'Push'
        };

        this.trackEvent(events[eventType] || eventType, {
            game_type: 'blackjack',
            ...data
        });
    }

    // ===== USER INTERACTION TRACKING =====
    trackInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.trackEvent('button_click', {
                    button_text: e.target.textContent,
                    button_id: e.target.id,
                    button_class: e.target.className
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackEvent('form_submit', {
                form_id: e.target.id,
                form_class: e.target.className
            });
        });

        // Track time spent on page
        window.addEventListener('beforeunload', () => {
            if (this.currentGame && this.startTime) {
                const sessionId = this.getCurrentSessionId();
                if (sessionId) {
                    this.endGameSession(sessionId, 'page_leave');
                }
            }
        });
    }

    // ===== UTILITY FUNCTIONS =====
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getCurrentSessionId() {
        for (const sessionId in this.gameSessions) {
            if (this.gameSessions[sessionId].game === this.currentGame) {
                return sessionId;
            }
        }
        return null;
    }

    // ===== STATISTICS & REPORTING =====
    getGameStats() {
        const stats = {
            total_sessions: Object.keys(this.gameSessions).length,
            current_game: this.currentGame,
            sessions_by_game: {},
            total_events: 0
        };

        for (const sessionId in this.gameSessions) {
            const session = this.gameSessions[sessionId];
            const game = session.game;
            
            if (!stats.sessions_by_game[game]) {
                stats.sessions_by_game[game] = {
                    count: 0,
                    total_events: 0,
                    avg_duration: 0
                };
            }
            
            stats.sessions_by_game[game].count++;
            stats.sessions_by_game[game].total_events += session.events.length;
            stats.total_events += session.events.length;
        }

        return stats;
    }

    // Export data for backup/analysis
    exportAnalytics() {
        const data = {
            export_time: new Date().toISOString(),
            stats: this.getGameStats(),
            sessions: this.gameSessions
        };

        // Create downloadable file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// ===== GLOBAL ANALYTICS INSTANCE =====
let analytics;

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    analytics = new Analytics();
    
    // Make analytics available globally for game scripts
    window.analytics = analytics;
    
    // Add export functionality (for debugging/admin use)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.exportAnalytics = () => analytics.exportAnalytics();
        console.log('Analytics initialized. Type exportAnalytics() to export data.');
    }
});

// ===== GAME INTEGRATION HELPERS =====
// These functions can be called from individual game scripts

window.trackImpostorEvent = (eventType, data) => {
    if (analytics) analytics.trackImpostorEvent(eventType, data);
};

window.trackPokerEvent = (eventType, data) => {
    if (analytics) analytics.trackPokerEvent(eventType, data);
};

window.trackBlackjackEvent = (eventType, data) => {
    if (analytics) analytics.trackBlackjackEvent(eventType, data);
};

window.startGameSession = (gameName) => {
    if (analytics) return analytics.startGameSession(gameName);
    return null;
};

window.endGameSession = (sessionId, result) => {
    if (analytics) analytics.endGameSession(sessionId, result);
};
