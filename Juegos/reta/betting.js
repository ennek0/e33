class BettingGame {
    constructor() {
        this.selections = [];
        this.myBets = [];
        this.matches = this.generateWeeklyMatches();
        this.currentOdds = {};
        this.liveMatches = new Set();
        this.budget = 50.00; // Starting budget of €50
        this.simulationStartTime = Date.now(); // Track when simulation started
        this.currentSportFilter = 'laliga'; // Default filter
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startLiveSimulation();
        this.updateUI();
        this.updateGameTime(); // Initialize game time display
        this.updateFinishedMatches(); // Initialize finished matches section
    }

    generateWeeklyMatches() {
        // La Liga teams with ratings (exact user specification)
        const laLigaTeams = [
            { name: 'Real Madrid CF', rating: 95 },
            { name: 'FC Barcelona', rating: 93 },
            { name: 'Atlético de Madrid', rating: 90 },
<<<<<<< HEAD
            { name: 'Sevilla FC', rating: 83 },
            { name: 'Real Betis', rating: 85 },
            { name: 'Real Sociedad', rating: 85 },
            { name: 'Villarreal CF', rating: 89 },
=======
            { name: 'Sevilla FC', rating: 86 },
            { name: 'Real Betis', rating: 85 },
            { name: 'Real Sociedad', rating: 85 },
            { name: 'Villarreal CF', rating: 84 },
>>>>>>> bb59ba713f22a9b55b53cbd8b1b6add54cacae2f
            { name: 'Athletic Club (Bilbao)', rating: 83 },
            { name: 'Valencia CF', rating: 82 },
            { name: 'CA Osasuna', rating: 80 },
            { name: 'RC Celta de Vigo', rating: 79 },
            { name: 'Rayo Vallecano', rating: 78 },
            { name: 'Deportivo Alavés', rating: 77 },
            { name: 'RCD Espanyol', rating: 76 },
            { name: 'Elche CF', rating: 75 },
            { name: 'Getafe CF', rating: 74 },
            { name: 'RCD Mallorca', rating: 73 },
            { name: 'Levante UD', rating: 72 },
            { name: 'Real Oviedo', rating: 71 },
            { name: 'Girona FC', rating: 70 }
        ];

        // LaLiga Hypermotion teams with ratings (exact user specification)
        const segundaTeams = [
            { name: 'Racing Santander', rating: 83 },
            { name: 'Deportivo La Coruña', rating: 82 },
            { name: 'UD Almería', rating: 81 },
            { name: 'CD Castellón', rating: 81 },
            { name: 'Las Palmas', rating: 80 },
            { name: 'Burgos CF', rating: 79 },
            { name: 'Real Sporting de Gijón', rating: 78 },
            { name: 'Cádiz CF', rating: 78 },
            { name: 'AD Ceuta', rating: 77 },
            { name: 'Real Valladolid', rating: 77 },
            { name: 'Málaga', rating: 76 },
            { name: 'Córdoba', rating: 76 },
            { name: 'CyD Leonesa', rating: 75 },
            { name: 'Albacete Balompié', rating: 75 },
            { name: 'SD Huesca', rating: 74 },
            { name: 'Real Sociedad B', rating: 74 },
            { name: 'Andorra', rating: 73 },
            { name: 'CD Leganés', rating: 73 },
            { name: 'Granada CF', rating: 72 },
            { name: 'SD Eibar', rating: 71 },
            { name: 'CD Mirandés', rating: 71 },
            { name: 'Real Zaragoza', rating: 70 }
        ];

        // Generate matches for the week (Monday, Friday, Saturday, Sunday as specified)
        const matchDays = ['Monday', 'Friday', 'Saturday', 'Sunday'];
        const scheduledTimes = ['14:00', '16:15', '18:30', '21:00']; // 2:00 PM, 4:15 PM, 6:30 PM, 9:00 PM
        
        const matches = [];
        let matchId = 1;

        // Get current date and find current week start
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // Set to Monday

        // Shuffle teams for random pairings
        const shuffledLaLiga = [...laLigaTeams].sort(() => Math.random() - 0.5);
        const shuffledSegunda = [...segundaTeams].sort(() => Math.random() - 0.5);

        // Generate La Liga matches - ensure all teams play exactly once
        const laLigaPairings = [];
        const usedTeams = new Set();
        
        // Create proper pairings ensuring each team plays once
        for (let i = 0; i < shuffledLaLiga.length; i++) {
            if (!usedTeams.has(shuffledLaLiga[i].name)) {
                for (let j = i + 1; j < shuffledLaLiga.length; j++) {
                    if (!usedTeams.has(shuffledLaLiga[j].name)) {
                        laLigaPairings.push([shuffledLaLiga[i], shuffledLaLiga[j]]);
                        usedTeams.add(shuffledLaLiga[i].name);
                        usedTeams.add(shuffledLaLiga[j].name);
                        break;
                    }
                }
            }
        }

        // Generate LaLiga Hypermotion matches - ensure all teams play exactly once
        const segundaPairings = [];
        const usedSegundaTeams = new Set();
        
        // Create proper pairings ensuring each team plays once
        for (let i = 0; i < shuffledSegunda.length; i++) {
            if (!usedSegundaTeams.has(shuffledSegunda[i].name)) {
                for (let j = i + 1; j < shuffledSegunda.length; j++) {
                    if (!usedSegundaTeams.has(shuffledSegunda[j].name)) {
                        segundaPairings.push([shuffledSegunda[i], shuffledSegunda[j]]);
                        usedSegundaTeams.add(shuffledSegunda[i].name);
                        usedSegundaTeams.add(shuffledSegunda[j].name);
                        break;
                    }
                }
            }
        }

        // NEW SCHEDULING: Maximum 3 matches per league per day with variety in time slots
        let laLigaMatchIndex = 0;
        let segundaMatchIndex = 0;
        const timeSlots = ['14:00', '16:15', '18:30', '21:00']; // 2:00 PM, 4:15 PM, 6:30 PM, 9:00 PM
        const maxMatchesPerLeaguePerDay = 3;
        
        // Schedule matches day by day
        matchDays.forEach(dayName => {
            const dayOffset = dayName === 'Monday' ? 0 : 
                           dayName === 'Friday' ? 4 : 
                           dayName === 'Saturday' ? 5 : 6; // Sunday
            
            const matchDate = new Date();
            matchDate.setDate(today.getDate() + dayOffset);
            matchDate.setHours(0, 0, 0, 0);
            
            // Create a shuffled copy of time slots for variety
            const shuffledTimeSlots = [...timeSlots].sort(() => Math.random() - 0.5);
            
            // Schedule LaLiga matches (max 3 per day)
            let laLigaMatchesToday = 0;
            for (let i = 0; i < shuffledTimeSlots.length && laLigaMatchesToday < maxMatchesPerLeaguePerDay && laLigaMatchIndex < laLigaPairings.length; i++) {
                const timeSlot = shuffledTimeSlots[i];
                const [homeTeam, awayTeam] = laLigaPairings[laLigaMatchIndex];
                const odds = this.calculateOdds(homeTeam.rating, awayTeam.rating);
                const matchDateTime = this.parseMatchDateTime(matchDate, timeSlot);
                
                matches.push({
                    id: matchId++,
                    competition: 'LaLiga',
                    homeTeam: homeTeam.name,
                    awayTeam: awayTeam.name,
                    homeRating: homeTeam.rating,
                    awayRating: awayTeam.rating,
                    isLive: false,
                    minute: 0,
                    score: { home: 0, away: 0 },
                    time: timeSlot,
                    date: matchDate.toLocaleDateString(),
                    dayName: dayName,
                    scheduledTime: matchDateTime,
                    odds,
                    events: [],
                    scheduledEvents: [],
                    status: 'scheduled'
                });
                
                laLigaMatchIndex++;
                laLigaMatchesToday++;
            }
            
            // Schedule LaLiga Hypermotion matches (max 3 per day)
            let segundaMatchesToday = 0;
            // Use a different shuffled order for variety between leagues
            const shuffledTimeSlotsSegunda = [...timeSlots].sort(() => Math.random() - 0.5);
            for (let i = 0; i < shuffledTimeSlotsSegunda.length && segundaMatchesToday < maxMatchesPerLeaguePerDay && segundaMatchIndex < segundaPairings.length; i++) {
                const timeSlot = shuffledTimeSlotsSegunda[i];
                const [homeTeam, awayTeam] = segundaPairings[segundaMatchIndex];
                const odds = this.calculateOdds(homeTeam.rating, awayTeam.rating);
                const matchDateTime = this.parseMatchDateTime(matchDate, timeSlot);
                
                matches.push({
                    id: matchId++,
                    competition: 'LaLiga Hypermotion',
                    homeTeam: homeTeam.name,
                    awayTeam: awayTeam.name,
                    homeRating: homeTeam.rating,
                    awayRating: awayTeam.rating,
                    isLive: false,
                    minute: 0,
                    score: { home: 0, away: 0 },
                    time: timeSlot,
                    date: matchDate.toLocaleDateString(),
                    dayName: dayName,
                    scheduledTime: matchDateTime,
                    odds,
                    events: [],
                    scheduledEvents: [],
                    status: 'scheduled'
                });
                
                segundaMatchIndex++;
                segundaMatchesToday++;
            }
        });

        // Sort matches by scheduled time (earliest first)
        matches.sort((a, b) => a.scheduledTime - b.scheduledTime);

        // DEBUG: Verify scheduling constraints
        console.log('=== Scheduling Verification ===');
        console.log(`Total matches: ${matches.length}`);
        
        // Check match days
        const dayCounts = {};
        matches.forEach(match => {
            dayCounts[match.dayName] = (dayCounts[match.dayName] || 0) + 1;
        });
        console.log('Matches by day:', dayCounts);
        
        // Check team participation
        const teamParticipation = {};
        matches.forEach(match => {
            teamParticipation[match.homeTeam] = (teamParticipation[match.homeTeam] || 0) + 1;
            teamParticipation[match.awayTeam] = (teamParticipation[match.awayTeam] || 0) + 1;
        });
        
        let issues = 0;
        Object.entries(teamParticipation).forEach(([team, count]) => {
            if (count !== 1) {
                console.log(`ISSUE: ${team} plays ${count} times (should be 1)`);
                issues++;
            }
        });
        
        console.log(`Teams with scheduling issues: ${issues}`);
        console.log(`Monday matches (should be few): ${dayCounts['Monday'] || 0}`);
        console.log('===============================');

        return matches;
    }

    parseMatchDateTime(matchDate, timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const matchDateTime = new Date(matchDate);
        matchDateTime.setHours(hours, minutes, 0, 0);
        
        return matchDateTime;
    }

    parseMatchTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const matchDateTime = new Date();
        matchDateTime.setHours(hours, minutes, 0, 0);
        
        return matchDateTime;
    }

    generateScheduledEvents(currentMinute) {
        const events = [];
        
        // Generate only goal events that will happen during the match
        const totalGoals = Math.floor(Math.random() * 3) + 1; // 1-3 goals per match
        
        for (let i = 0; i < totalGoals; i++) {
            const goalMinute = Math.floor(Math.random() * 80) + 10; // Goals between 10' and 90'
            const team = Math.random() < 0.5 ? 'home' : 'away';
            
            events.push({
                minute: goalMinute,
                type: 'goal',
                team: team,
                processed: goalMinute <= currentMinute
            });
        }
        
        return events.sort((a, b) => a.minute - b.minute); // Sort by minute
    }

    calculateOdds(homeRating, awayRating) {
        const ratingDiff = homeRating - awayRating;
        
        // Base odds calculation
        let homeOdds, drawOdds, awayOdds;
        
        if (ratingDiff > 15) {
            // Strong favorite at home
            homeOdds = 1.30 + Math.random() * 0.20;
            awayOdds = 4.50 + Math.random() * 2.00;
            drawOdds = 3.80 + Math.random() * 0.80;
        } else if (ratingDiff > 8) {
            // Moderate favorite at home
            homeOdds = 1.60 + Math.random() * 0.30;
            awayOdds = 3.80 + Math.random() * 1.50;
            drawOdds = 3.40 + Math.random() * 0.60;
        } else if (ratingDiff > 3) {
            // Slight favorite at home
            homeOdds = 1.90 + Math.random() * 0.30;
            awayOdds = 3.20 + Math.random() * 1.00;
            drawOdds = 3.10 + Math.random() * 0.40;
        } else if (ratingDiff > -3) {
            // Even match
            homeOdds = 2.20 + Math.random() * 0.40;
            awayOdds = 2.80 + Math.random() * 0.60;
            drawOdds = 2.90 + Math.random() * 0.30;
        } else if (ratingDiff > -8) {
            // Slight underdog at home
            homeOdds = 2.60 + Math.random() * 0.40;
            awayOdds = 2.40 + Math.random() * 0.40;
            drawOdds = 2.80 + Math.random() * 0.30;
        } else if (ratingDiff > -15) {
            // Moderate underdog at home
            homeOdds = 3.20 + Math.random() * 0.60;
            awayOdds = 1.90 + Math.random() * 0.30;
            drawOdds = 3.00 + Math.random() * 0.40;
        } else {
            // Strong underdog at home
            homeOdds = 4.00 + Math.random() * 1.00;
            awayOdds = 1.50 + Math.random() * 0.20;
            drawOdds = 3.20 + Math.random() * 0.60;
        }

        return {
            '1': parseFloat(homeOdds.toFixed(2)),
            'X': parseFloat(drawOdds.toFixed(2)),
            '2': parseFloat(awayOdds.toFixed(2))
        };
    }

    generateScore(homeRating, awayRating, isLive) {
        const ratingDiff = homeRating - awayRating;
        let homeGoals = 0, awayGoals = 0;

        if (isLive) {
            // More varied and realistic goal generation
            const homeStrength = homeRating / 100; // Normalize to 0-1 range
            const awayStrength = awayRating / 100;
            
            // Base probability with more variation
            const homeBaseProb = 0.25 + (homeStrength * 0.45); // 0.25-0.7 range
            const awayBaseProb = 0.25 + (awayStrength * 0.45); // 0.25-0.7 range
            
            // Add more randomness while maintaining rating influence
            const randomFactor = 0.3; // 30% random variation
            const homeGoalProb = Math.max(0.1, Math.min(0.8, homeBaseProb + (Math.random() - 0.5) * randomFactor));
            const awayGoalProb = Math.max(0.1, Math.min(0.8, awayBaseProb + (Math.random() - 0.5) * randomFactor));
            
            // Adjust for rating difference but with more variation
            const ratingInfluence = 0.15; // Reduced influence for more variety
            const adjustedHomeProb = Math.min(0.85, homeGoalProb + (ratingDiff / 100) * ratingInfluence);
            const adjustedAwayProb = Math.max(0.05, awayGoalProb - (ratingDiff / 100) * ratingInfluence);
            
            // Generate goals with realistic distribution
            const maxGoals = 5; // Allow more goals for variety
            
            // Simulate goal-scoring opportunities
            for (let minute = 1; minute <= 90; minute += 3) { // Check every 3 minutes for more granularity
                // Home team chance to score
                if (Math.random() < adjustedHomeProb * 0.03) { // 3% chance per 3-minute interval
                    homeGoals++;
                    if (homeGoals >= maxGoals) break;
                }
                
                // Away team chance to score
                if (Math.random() < adjustedAwayProb * 0.03) {
                    awayGoals++;
                    if (awayGoals >= maxGoals) break;
                }
            }
            
            // More varied tie-breaking with occasional upsets
            if (homeGoals === awayGoals) {
                const upsetChance = Math.abs(ratingDiff) < 10 ? 0.35 : 0.15; // Higher upset chance for close ratings
                
                if (Math.random() < 0.4) { // 40% chance to break tie
                    if (ratingDiff > 5) {
                        // Home team favored but upset possible
                        if (Math.random() < 0.65 + (ratingDiff / 200)) {
                            homeGoals++;
                        } else {
                            awayGoals++;
                        }
                    } else if (ratingDiff < -5) {
                        // Away team favored but upset possible
                        if (Math.random() < 0.65 + (-ratingDiff / 200)) {
                            awayGoals++;
                        } else {
                            homeGoals++;
                        }
                    } else {
                        // Very close ratings - more random outcome
                        if (Math.random() < 0.5) {
                            homeGoals++;
                        } else {
                            awayGoals++;
                        }
                    }
                }
                // Allow some ties to remain (especially for closely matched teams)
            }
            
            // Add occasional high-scoring games for variety
            if (Math.random() < 0.08) { // 8% chance of high-scoring game
                const extraGoals = Math.floor(Math.random() * 3) + 1; // 1-3 extra goals
                if (ratingDiff > 0) {
                    homeGoals += extraGoals;
                } else if (ratingDiff < 0) {
                    awayGoals += extraGoals;
                } else {
                    // Equal ratings - distribute randomly
                    for (let i = 0; i < extraGoals; i++) {
                        if (Math.random() < 0.5) homeGoals++;
                        else awayGoals++;
                    }
                }
            }
        }

        return { home: homeGoals, away: awayGoals };
    }

    generateRandomTime() {
        const hours = Math.floor(Math.random() * 6) + 16; // 16:00 - 22:00
        const minutes = Math.random() < 0.5 ? '00' : '30';
        return `${hours}:${minutes}`;
    }

    generateMatchEvents(homeTeam, awayTeam, currentMinute) {
        const events = [];
        const eventTypes = ['Goal', 'Yellow Card', 'Red Card'];
        
        // Generate 2-5 events (only goals and cards)
        const eventCount = Math.floor(Math.random() * 4) + 2;
        
        for (let i = 0; i < eventCount; i++) {
            const minute = Math.floor(Math.random() * currentMinute) + 1;
            const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            const team = Math.random() < 0.5 ? homeTeam : awayTeam;
            
            let eventText = `${minute}' ${eventType}`;
            
            if (eventType === 'Goal') {
                const players = ['Striker', 'Midfielder', 'Winger', 'Defender'];
                const player = players[Math.floor(Math.random() * players.length)];
                eventText = `${minute}' Goal! ${player} scores for ${team}`;
            } else if (eventType === 'Yellow Card' || eventType === 'Red Card') {
                const players = ['Defender', 'Midfielder', 'Striker'];
                const player = players[Math.floor(Math.random() * players.length)];
                eventText = `${minute}' ${eventType} - ${player} (${team})`;
            }
            
            events.push(eventText);
        }
        
        // Sort events by minute
        events.sort((a, b) => {
            const minuteA = parseInt(a.split("'")[0]);
            const minuteB = parseInt(b.split("'")[0]);
            return minuteB - minuteA; // Sort in descending order (most recent first)
        });
        
        return events;
    }

    advanceTime(unit, amount) {
        // Get current simulated time
        const currentTime = this.getCurrentSimulatedTime();
        
        // Advance time based on unit
        switch(unit) {
            case 'day':
                currentTime.setDate(currentTime.getDate() + amount);
                break;
            case 'hour':
                currentTime.setHours(currentTime.getHours() + amount);
                break;
            case 'minute':
                currentTime.setMinutes(currentTime.getMinutes() + amount);
                break;
        }
        
        // Calculate the real-world time difference needed to reach the new game time
        // Game time runs at 30x speed (1 minute game time = 2 seconds real time)
        const baseTime = new Date();
        baseTime.setHours(14, 0, 0, 0); // Base start time (14:00)
        const targetGameTime = currentTime - baseTime;
        const requiredRealTimeOffset = targetGameTime / 30; // Convert game time to real time
        
        // Update the simulation start time to reflect the new time
        this.simulationStartTime = Date.now() - requiredRealTimeOffset;
        
        // Update UI immediately
        this.updateGameTime();
        
        // Check for matches that should start at the new time
        this.checkMatchStartTimes();
        
        // Update match displays
        this.renderMatches();
        this.updateSportsSection();
        this.updateLiveSection();
    }

    setupEventListeners() {
        // Menu navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleMenuClick(e));
        });

        // Sports filter
        document.querySelectorAll('.sport-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSportFilter(e));
        });

        // Bet slip tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabClick(e));
        });

        // Stake amount
        const stakeInput = document.getElementById('stakeAmount');
        if (stakeInput) {
            stakeInput.addEventListener('input', () => this.updatePotentialReturn());
        }

        // Place bet button
        const placeBetBtn = document.getElementById('placeBetBtn');
        if (placeBetBtn) {
            placeBetBtn.addEventListener('click', () => this.placeBet());
        }

        // Exit promotions button
        const exitPromotionsBtn = document.getElementById('exitPromotionsBtn');
        if (exitPromotionsBtn) {
            exitPromotionsBtn.addEventListener('click', () => this.exitPromotions());
        }
    }

    handleMenuClick(e) {
        e.preventDefault();
        const page = e.target.dataset.page;
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        e.target.classList.add('active');

        // Hide all sections first
        document.getElementById('promotionsPage').style.display = 'none';
        document.getElementById('liveSection').style.display = 'none';
        document.getElementById('sportsSection').style.display = 'none';
        document.querySelector('.betting-main').style.display = 'block';

        // Show appropriate section
        if (page === 'promotions') {
            document.getElementById('promotionsPage').style.display = 'flex';
            document.querySelector('.betting-main').style.display = 'none';
        } else if (page === 'live') {
            document.getElementById('liveSection').style.display = 'block';
            document.getElementById('sportsSection').style.display = 'none';
            this.updateLiveSection(); // Update live section when switching to it
        } else {
            document.getElementById('sportsSection').style.display = 'block';
            document.getElementById('liveSection').style.display = 'none';
        }
    }

    handleSportFilter(e) {
        const sport = e.currentTarget.dataset.sport;
        
        // Update active sport button
        document.querySelectorAll('.sport-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.currentTarget.classList.add('active');

        // Filter matches based on selected sport
        this.currentSportFilter = sport;
        this.renderMatches();
        this.updateSportsSection();
        
        console.log(`Filtering by sport: ${sport}`);
    }

    handleOddClick(e) {
        const btn = e.currentTarget;
        const matchId = parseInt(btn.dataset.match);
        const market = btn.dataset.market;
        const option = btn.dataset.option;
        const odds = parseFloat(btn.dataset.odds);

        // Debug logging
        console.log('Odd clicked:', { matchId, market, option, odds });

        // Toggle selection
        const selectionId = `${matchId}-${market}-${option}`;
        const existingIndex = this.selections.findIndex(s => s.id === selectionId);

        if (existingIndex !== -1) {
            // Remove selection
            this.selections.splice(existingIndex, 1);
            btn.classList.remove('selected');
        } else {
<<<<<<< HEAD
            // Check for conflicts with existing selections (only for multi-bets)
            if (this.selections.length > 0) {
                const conflictSelection = this.selections.find(s => {
                    if (s.matchId === matchId) {
                        // Check if trying to combine 1X2 and Double Chance from same match
                        return (s.market === '1X2' && (market === 'DC')) ||
                               (s.market === 'DC' && (market === '1X2'));
                    }
                    return false;
                });

                if (conflictSelection) {
                    // Use a more user-friendly notification instead of alert
                    this.showNotification('You cannot combine 1X2 and Double Chance markets from the same match in a single bet!', 'error');
                    return;
                }
=======
            // Check for conflicts with existing selections
            const conflictSelection = this.selections.find(s => {
                if (s.matchId === matchId) {
                    // Check if trying to combine 1X2 and Double Chance from same match
                    return (s.market === '1X2' && (market === 'DC')) ||
                           (s.market === 'DC' && (market === '1X2'));
                }
                return false;
            });

            if (conflictSelection) {
                // Use a more user-friendly notification instead of alert
                this.showNotification('You cannot combine 1X2 and Double Chance markets from the same match in a single bet!', 'error');
                return;
>>>>>>> bb59ba713f22a9b55b53cbd8b1b6add54cacae2f
            }

            // Add selection
            const match = this.matches.find(m => m.id === matchId);
            if (!match) {
                console.error('Match not found:', matchId);
                return;
            }
            
            this.selections.push({
                id: selectionId,
                matchId,
                market,
                option,
                odds,
                match: `${match.homeTeam} vs ${match.awayTeam}`,
                competition: match.competition
            });
            btn.classList.add('selected');
            console.log('Selection added:', this.selections);
        }

        this.updateBetSlip();
    }

    handleTabClick(e) {
        const tab = e.target.dataset.tab;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Show/hide tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');
    }

    updateBetSlip() {
        const selectionsList = document.getElementById('selectionsList');
        const selectionsCount = document.getElementById('selectionsCount');
        const betStake = document.getElementById('betStake');

        // Update count
        selectionsCount.textContent = `${this.selections.length} selection${this.selections.length !== 1 ? 's' : ''}`;

        if (this.selections.length === 0) {
            selectionsList.innerHTML = '<p class="empty-message">No selections added</p>';
            betStake.style.display = 'none';
        } else {
            // Render selections
            selectionsList.innerHTML = this.selections.map(selection => `
                <div class="selection-item">
                    <button class="selection-remove" onclick="game.removeSelection('${selection.id}')">×</button>
                    <div class="selection-details">
                        <strong>${selection.match}</strong><br>
                        ${selection.competition} - ${selection.market}<br>
                        Selection: ${selection.option}
                    </div>
                    <div class="selection-odds">Odds: ${selection.odds.toFixed(2)}</div>
                </div>
            `).join('');

            betStake.style.display = 'block';
            this.updatePotentialReturn();
        }
    }

    removeSelection(selectionId) {
        const index = this.selections.findIndex(s => s.id === selectionId);
        if (index !== -1) {
            this.selections.splice(index, 1);
            
            // Update button state
            const btn = document.querySelector(`.odd-btn[data-match="${this.selections[index]?.matchId}"][data-option="${this.selections[index]?.option}"]`);
            if (btn) {
                btn.classList.remove('selected');
            }
            
            this.updateBetSlip();
        }
    }

    updatePotentialReturn() {
        const stakeAmount = parseFloat(document.getElementById('stakeAmount').value) || 0;
        const totalOdds = this.getTotalOdds();
        const potentialReturn = stakeAmount * totalOdds;
        
        document.getElementById('potentialReturn').textContent = `€${potentialReturn.toFixed(2)}`;
    }

    getTotalOdds() {
        if (this.selections.length === 0) return 0;
        
        return this.selections.reduce((total, selection) => total * selection.odds, 1);
    }

    checkWeeklyReset() {
        // Check if all matches are finished
        const unfinishedMatches = this.matches.filter(match => match.status !== 'finished');
        
        if (unfinishedMatches.length === 0) {
            // All matches finished - start new week
            this.showNotification('All matches finished! Starting new week...', 'info');
            this.startNewWeek();
        }
    }

    startNewWeek() {
        // Clear current matches
        this.matches = [];
        
        // Generate new weekly matches
        this.matches = this.generateWeeklyMatches();
        
        // Reset simulation start time
        this.simulationStartTime = Date.now();
        
        // Update all displays
        this.renderMatches();
        this.updateSportsSection();
        this.updateLiveSection();
        this.updateFinishedMatches();
        
        // Clear any existing selections since old matches are gone
        this.selections = [];
        this.updateBetSlip();
        
        this.showNotification('New week started! Fresh matches are available!', 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    placeBet() {
        if (this.selections.length === 0) {
            this.showNotification('Please select at least one betting option', 'error');
            return;
        }
        
        const stakeAmountInput = document.getElementById('stakeAmount');
        if (!stakeAmountInput) {
            this.showNotification('Stake amount input not found', 'error');
            return;
        }
        
        const stakeAmount = parseFloat(stakeAmountInput.value);
        if (isNaN(stakeAmount) || stakeAmount <= 0) {
            this.showNotification('Please enter a valid stake amount (minimum €1)', 'error');
            return;
        }
        
        if (stakeAmount > this.budget) {
            this.showNotification(`Insufficient budget. You have €${this.budget.toFixed(2)} but tried to bet €${stakeAmount.toFixed(2)}`, 'error');
            return;
        }
        
        // Calculate total odds
        const totalOdds = this.selections.reduce((product, selection) => {
            return product * parseFloat(selection.odds);
        }, 1);
        
        const potentialReturn = (stakeAmount * totalOdds).toFixed(2);
        
        // Create bet object
        const bet = {
            id: Date.now(),
            matchId: this.selections[0].matchId, // Store match ID for cash out validation
            selections: [...this.selections],
            stake: stakeAmount,
            odds: totalOdds,
            potentialReturn: parseFloat(potentialReturn),
            status: 'pending',
            claimed: false,
            selection: this.selections[0].option, // Store selection for result checking
            timestamp: new Date().toLocaleString()
        };
        
        // Add to my bets
        this.myBets.push(bet);
        
        // Deduct stake from budget
        this.budget -= stakeAmount;
        
        // Clear selections
        this.selections = [];
        this.updateBetSlip();
        this.updateMyBets();
        this.updateBudgetDisplay();
        
        // Show confirmation
        this.showNotification(`Bet placed successfully! Potential return: €${bet.potentialReturn.toFixed(2)}`, 'success');
    }

    updateMyBets() {
        const myBetsList = document.getElementById('myBetsList');
        
        if (this.myBets.length === 0) {
            myBetsList.innerHTML = '<p class="empty-message">No bets placed yet</p>';
        } else {
            myBetsList.innerHTML = this.myBets.map(bet => {
                const match = this.matches.find(m => m.id === bet.matchId);
                const canCashOut = match && match.status === 'finished' && !bet.claimed;
                
                return `
                <div class="bet-item">
                    <div class="bet-header">
                        <strong>Bet #${bet.id}</strong>
                        <span class="bet-status ${bet.status}">${bet.status}</span>
                    </div>
                    <div class="bet-details">
                        <div class="bet-selections">
                            ${bet.selections.map(s => `${s.match} - ${s.market}: ${s.option}`).join('<br>')}
                        </div>
                        <div class="bet-financials">
                            <div>Stake: €${bet.stake.toFixed(2)}</div>
                            <div>Odds: ${bet.odds.toFixed(2)}</div>
                            <div>Potential Return: €${bet.potentialReturn.toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="bet-time">
                        Placed: ${new Date(bet.timestamp).toLocaleString()}
                    </div>
                    ${bet.status === 'pending' && canCashOut ? `
                        <div class="bet-actions">
                            <button class="cash-out-btn" onclick="game.cashOutBet(${bet.id})">CLAIM WINNINGS</button>
                        </div>
                    ` : bet.status === 'pending' && match && match.status === 'live' ? `
                        <div class="bet-actions">
                            <span class="cash-out-info">Match in progress...</span>
                        </div>
                    ` : bet.claimed ? `
                        <div class="bet-actions">
                            <span class="claimed-status">Claimed</span>
                        </div>
                    ` : ''}
                </div>
                `;
            }).join('');
        }
    }

    startLiveSimulation() {
        // Check for matches that should start now
        setInterval(() => {
            this.checkMatchStartTimes();
        }, 5000); // Check every 5 seconds

        // Update game time display
        setInterval(() => {
            this.updateGameTime();
        }, 1000);

        // Simulate live match updates
        setInterval(() => {
            const currentGameTime = this.getCurrentSimulatedTime();
            
            this.matches.forEach(match => {
                if (match.isLive) {
                    // Calculate match minute based on game time, not real time
                    const matchStartTime = new Date(match.scheduledTime);
                    const elapsedGameTime = currentGameTime - matchStartTime;
                    const previousMinute = match.minute;
                    match.minute = Math.floor(elapsedGameTime / 60000); // 1 minute = 60000 milliseconds
                    
                    // Check if match should end
                    if (match.minute >= 90) {
                        match.isLive = false;
                        match.status = 'finished';
                        match.isLive = false; // Ensure match is no longer considered live
                        
                        // Generate final score based on team ratings
                        const finalScore = this.generateScore(match.homeRating, match.awayRating, true);
                        match.score = finalScore;
                        
                        this.updateMatchDisplay(match);
                        this.renderMatches();
                        this.updateSportsSection();
                        this.updateLiveSection(); // Update live section to remove finished match
                        this.updateFinishedMatches(); // Update finished matches section
                        this.updateMyBets(); // Update bet display to show claim button immediately
<<<<<<< HEAD
                        this.updateAllBetClaimButtons(); // Ensure claim buttons are updated immediately
=======
>>>>>>> bb59ba713f22a9b55b53cbd8b1b6add54cacae2f
                        
                        // Check if all matches are finished - trigger weekly reset
                        this.checkWeeklyReset();
                        return;
                    }
                    
                    // Check for scheduled events at this minute
                    if (match.minute > previousMinute) {
                        this.checkScheduledEvents(match);
                    }
                    
                    // Update UI
                    this.updateMatchDisplay(match);
                    this.updateLiveSection();
                    this.updateSportsSection();
                }
            });
        }, 1000); // Update every 1 second for smoother time progression
    }

    checkMatchStartTimes() {
        // Get current simulated time
        const currentTime = this.getCurrentSimulatedTime();
        
        this.matches.forEach(match => {
            if (match.status === 'scheduled' && currentTime >= match.scheduledTime) {
                // Start the match
                match.isLive = true;
                match.status = 'live';
                // Use scheduled time as start time for game time-based calculations
                match.startTime = match.scheduledTime;
                match.minute = 0;
                match.scheduledEvents = this.generateScheduledEvents(0);
                
                // Update UI
                this.updateMatchDisplay(match);
                this.renderMatches();
                this.updateLiveSection();
                this.updateSportsSection();
            }
        });
    }

    getCurrentSimulatedTime() {
        // Always start from 2:00 PM (14:00) as requested, regardless of match times
        const startTime = new Date();
        startTime.setHours(14, 0, 0, 0);
        
        const elapsedRealSeconds = Math.floor((Date.now() - this.simulationStartTime) / 1000);
        const simulatedSeconds = elapsedRealSeconds * 30; // 30x speed
        
        const currentTime = new Date(startTime);
        currentTime.setSeconds(startTime.getSeconds() + simulatedSeconds);
        
        return currentTime;
    }

    getCurrentSimulatedDate() {
        const currentTime = this.getCurrentSimulatedTime();
        return currentTime.toLocaleDateString();
    }

    updateGameTime() {
        const currentTimeElement = document.getElementById('currentTime');
        const liveTimeElement = document.getElementById('liveTime');
        const currentDateElement = document.getElementById('currentDate');
        const liveDateElement = document.getElementById('liveDate');
        
        // Get current simulated time
        const currentTime = this.getCurrentSimulatedTime();
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        const dateString = currentTime.toLocaleDateString();
        
        // Update time displays
        if (currentTimeElement) currentTimeElement.textContent = timeString;
        if (liveTimeElement) liveTimeElement.textContent = timeString;
        
        // Update date displays
        if (currentDateElement) currentDateElement.textContent = dateString;
        if (liveDateElement) liveDateElement.textContent = dateString;
    }

    processScheduledEvents(match) {
        match.scheduledEvents.forEach(event => {
            if (event.minute <= match.minute && !event.processed) {
                this.triggerEvent(match, event);
                event.processed = true;
            }
        });
    }

    checkScheduledEvents(match) {
        match.scheduledEvents.forEach(event => {
            if (!event.processed && event.minute === match.minute) {
                this.triggerEvent(match, event);
                event.processed = true;
            }
        });
    }

    triggerEvent(match, event) {
        const team = event.team === 'home' ? match.homeTeam : match.awayTeam;
        const player = this.getRandomPlayer();
        
        if (event.type === 'goal') {
            if (event.team === 'home') {
                match.score.home++;
            } else {
                match.score.away++;
            }
            
            // Add goal event temporarily
            const goalEvent = `${event.minute}' Goal! ${player} scores for ${team}`;
            match.events.unshift(goalEvent);
            
            // Remove goal event after 5 seconds
            setTimeout(() => {
                const eventIndex = match.events.indexOf(goalEvent);
                if (eventIndex > -1) {
                    match.events.splice(eventIndex, 1);
                    this.updateLiveSection();
                    this.updateSportsSection();
                }
            }, 5000);
            
            this.updateLiveOdds(match);
        }
    }

    getRandomPlayer() {
        const positions = ['Striker', 'Midfielder', 'Winger', 'Defender', 'Captain'];
        return positions[Math.floor(Math.random() * positions.length)];
    }

    // Removed random events - only goals will appear when score changes

    updateFinishedMatches() {
        const finishedContainer = document.getElementById('finishedMatchesContainer');
        if (!finishedContainer) return;

        const finishedMatches = this.matches.filter(match => match.status === 'finished');
        
        if (finishedMatches.length === 0) {
            finishedContainer.innerHTML = '<p class="empty-message">No finished matches today</p>';
            return;
        }

        const finishedHTML = finishedMatches.map(match => `
            <div class="finished-match">
                <div class="finished-match-header">
                    <span class="finished-match-competition">${match.competition}</span>
                    <span class="finished-match-status">FINISHED</span>
                </div>
                <div class="finished-match-teams">
                    <span class="team-name">${match.homeTeam}</span>
                    <span class="finished-match-score">${match.score.home} - ${match.score.away}</span>
                    <span class="team-name">${match.awayTeam}</span>
                </div>
                <div class="finished-match-time">Final Score • ${match.time}</div>
            </div>
        `).join('');

        finishedContainer.innerHTML = finishedHTML;
    }

    updateLiveSection() {
        const liveSection = document.getElementById('liveSection');
        if (!liveSection || liveSection.style.display === 'none') return;

        const liveMatches = this.matches.filter(match => match.isLive && match.status !== 'finished');
        
        if (liveMatches.length === 0) {
            liveSection.querySelector('.live-matches-container').innerHTML = 
                '<p class="no-live-matches">No live matches currently</p>';
            return;
        }

        const liveHTML = liveMatches.map(match => {
            const timeLeft = 90 - match.minute;
            const homeGoals = this.generateGoalScorers(match.homeTeam, match.score.home);
            const awayGoals = this.generateGoalScorers(match.awayTeam, match.score.away);
            
            return `
                <div class="live-match-detail" data-match="${match.id}">
                    <div class="match-header">
                        <span class="competition">${match.competition}</span>
                        <span class="live-badge">LIVE</span>
                        <span class="time-left">${timeLeft}' min left</span>
                    </div>
                    <div class="teams">
                        <div class="team home-team">
                            <span class="team-name">${match.homeTeam}</span>
                            <div class="goal-scorers">
                                ${homeGoals.map(goal => `<div class="goal">${goal}</div>`).join('')}
                            </div>
                        </div>
                        <div class="score">
                            <span class="current-score">${match.score.home}-${match.score.away}</span>
                            <span class="minute">${match.minute}'</span>
                        </div>
                        <div class="team away-team">
                            <span class="team-name">${match.awayTeam}</span>
                            <div class="goal-scorers">
                                ${awayGoals.map(goal => `<div class="goal">${goal}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="match-info-row">
                        <span class="match-progress">Match Progress: ${Math.round((match.minute / 90) * 100)}%</span>
                        <span class="match-status">Status: In Progress</span>
                    </div>
                    <div class="match-events">
                        <h4>Live Events</h4>
                        ${match.events.map(event => `<div class="event">${event}</div>`).join('')}
                    </div>
                    <div class="main-market">
                        <button class="odd-btn" data-match="${match.id}" data-market="1X2" data-option="1" data-odds="${match.odds['1']}">
                            <span class="option">1</span>
                            <span class="odds">${match.odds['1'].toFixed(2)}</span>
                        </button>
                        <button class="odd-btn" data-match="${match.id}" data-market="1X2" data-option="X" data-odds="${match.odds['X']}">
                            <span class="option">X</span>
                            <span class="odds">${match.odds['X'].toFixed(2)}</span>
                        </button>
                        <button class="odd-btn" data-match="${match.id}" data-market="1X2" data-option="2" data-odds="${match.odds['2']}">
                            <span class="option">2</span>
                            <span class="odds">${match.odds['2'].toFixed(2)}</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        liveSection.querySelector('.live-matches-container').innerHTML = liveHTML;
        
        // Re-attach event listeners for new buttons
        this.attachOddsListeners();
    }

    updateLiveOdds(match) {
        // Simple odds adjustment based on score
        const goalDifference = match.score.home - match.score.away;
        
        if (goalDifference > 0) {
            // Home team winning, decrease home odds, increase away odds
            match.odds['1'] = Math.max(1.1, match.odds['1'] * 0.98);
            match.odds['2'] = Math.min(10.0, match.odds['2'] * 1.02);
        } else if (goalDifference < 0) {
            // Away team winning, increase home odds, decrease away odds
            match.odds['1'] = Math.min(10.0, match.odds['1'] * 1.02);
            match.odds['2'] = Math.max(1.1, match.odds['2'] * 0.98);
        } else {
            // Draw, slightly favor draw
            match.odds['X'] = Math.max(1.5, match.odds['X'] * 0.99);
        }
        
        // Update DOM elements
        this.updateOddsDisplay(match);
    }

    updateMatchDisplay(match) {
        // Update score and minute displays
        const scoreElements = document.querySelectorAll(`[data-match="${match.id}"] .current-score`);
        const minuteElements = document.querySelectorAll(`[data-match="${match.id}"] .minute`);
        
        scoreElements.forEach(el => {
            el.textContent = `${match.score.home}-${match.score.away}`;
        });
        
        minuteElements.forEach(el => {
            el.textContent = `${match.minute}'`;
        });

        // Update goal scorers
        this.updateGoalScorers(match);
        
        // Update match events
        this.updateMatchEvents(match);
    }

    updateGoalScorers(match) {
        const homeScorersElements = document.querySelectorAll(`[data-match="${match.id}"] .home-team .goal-scorers`);
        const awayScorersElements = document.querySelectorAll(`[data-match="${match.id}"] .away-team .goal-scorers`);
        
        // Generate goal scorer information
        const homeGoals = this.generateGoalScorers(match.homeTeam, match.score.home);
        const awayGoals = this.generateGoalScorers(match.awayTeam, match.score.away);
        
        homeScorersElements.forEach(el => {
            el.innerHTML = homeGoals.map(goal => `<div class="goal">${goal}</div>`).join('');
        });
        
        awayScorersElements.forEach(el => {
            el.innerHTML = awayGoals.map(goal => `<div class="goal">${goal}</div>`).join('');
        });
    }

    generateGoalScorers(team, goals) {
        const scorers = [];
        const players = ['Striker', 'Midfielder', 'Winger', 'Defender', 'Captain'];
        
        for (let i = 0; i < goals; i++) {
            const player = players[Math.floor(Math.random() * players.length)];
            const minute = Math.floor(Math.random() * 80) + 1;
            scorers.push(`${player} ${minute}'`);
        }
        
        return scorers.sort((a, b) => {
            const minuteA = parseInt(a.split("'")[0]);
            const minuteB = parseInt(b.split("'")[0]);
            return minuteA - minuteB;
        });
    }

    updateMatchEvents(match) {
        const eventsElements = document.querySelectorAll(`[data-match="${match.id}"] .match-events`);
        
        eventsElements.forEach(el => {
            el.innerHTML = match.events.map(event => `<div class="event">${event}</div>`).join('');
        });
    }

    updateOddsDisplay(match) {
        // Update odds buttons for this match
        const oddsButtons = document.querySelectorAll(`[data-match="${match.id}"][data-market="1X2"]`);
        
        // Update live odds
        oddsButtons.forEach(btn => {
            const option = btn.dataset.option;
            const newOdds = match.odds[option];
            
            btn.dataset.odds = newOdds.toFixed(2);
            btn.querySelector('.odds').textContent = newOdds.toFixed(2);
        });
    }

    updateUI() {
        this.updateBetSlip();
        this.updateMyBets();
        this.updateBudgetDisplay();
        this.renderMatches();
        this.updateSportsSection();
    }

    renderMatches() {
        const matchesTable = document.getElementById('matchesTable');
        if (!matchesTable) return;

        // Filter matches based on current sport filter
        let filteredMatches = this.matches;
        if (this.currentSportFilter === 'laliga') {
            filteredMatches = this.matches.filter(match => match.competition === 'LaLiga' && match.status !== 'finished');
        } else if (this.currentSportFilter === 'hypermotion') {
            filteredMatches = this.matches.filter(match => match.competition === 'LaLiga Hypermotion' && match.status !== 'finished');
        } else if (this.currentSportFilter === 'results') {
            filteredMatches = this.matches.filter(match => match.status === 'finished');
        } else if (this.currentSportFilter === 'all') {
            // For 'all', exclude finished matches (they go to results section)
            filteredMatches = this.matches.filter(match => match.status !== 'finished');
        }

        // Group matches by day
        const matchesByDay = {};
        filteredMatches.forEach(match => {
            if (!matchesByDay[match.dayName]) {
                matchesByDay[match.dayName] = [];
            }
            matchesByDay[match.dayName].push(match);
        });

        const daysOrder = ['Monday', 'Friday', 'Saturday', 'Sunday'];
        
        matchesTable.innerHTML = daysOrder.map(dayName => {
            const dayMatches = matchesByDay[dayName] || [];
            if (dayMatches.length === 0) return '';
            
            return `
                <div class="day-section">
                    <h3 class="day-header">${dayName} - ${dayMatches[0].date}</h3>
                    <div class="day-matches">
                        ${dayMatches.map(match => `
                            <div class="match-row" data-match-id="${match.id}">
                                <div class="match-info">
                                    <span class="competition">${match.competition}</span>
                                    <div class="teams-info">
                                        <span class="home-team">${match.homeTeam}</span>
                                        <span class="vs">vs</span>
                                        <span class="away-team">${match.awayTeam}</span>
                                    </div>
                                    ${match.isLive ? 
                                        `<span class="live-badge live-small">LIVE ${match.minute}'</span>` : 
                                        `<span class="time">${match.time}</span>`
                                    }
                                </div>
                                <div class="markets">
                                    <div class="market-group">
                                        <span class="market-name">1X2</span>
                                        <div class="odds-row">
                                            <button class="odd-btn small" data-match="${match.id}" data-market="1X2" data-option="1" data-odds="${match.odds['1']}">${match.odds['1'].toFixed(2)}</button>
                                            <button class="odd-btn small" data-match="${match.id}" data-market="1X2" data-option="X" data-odds="${match.odds['X']}">${match.odds['X'].toFixed(2)}</button>
                                            <button class="odd-btn small" data-match="${match.id}" data-market="1X2" data-option="2" data-odds="${match.odds['2']}">${match.odds['2'].toFixed(2)}</button>
                                        </div>
                                    </div>
                                    <div class="market-group">
                                        <span class="market-name">Double Chance</span>
                                        <div class="odds-row">
                                            <button class="odd-btn small" data-match="${match.id}" data-market="DC" data-option="1X" data-odds="${parseFloat((Math.min(match.odds['1'], match.odds['X']) * 0.85).toFixed(2))}">1X</button>
                                            <button class="odd-btn small" data-match="${match.id}" data-market="DC" data-option="X2" data-odds="${parseFloat((Math.min(match.odds['X'], match.odds['2']) * 0.85).toFixed(2))}">X2</button>
                                            <button class="odd-btn small" data-match="${match.id}" data-market="DC" data-option="12" data-odds="${parseFloat((Math.min(match.odds['1'], match.odds['2']) * 0.85).toFixed(2))}">12</button>
                                        </div>
                                    </div>
                                    <div class="market-group">
                                        <span class="market-name">Both Teams Score</span>
                                        <div class="odds-row">
                                            <button class="odd-btn small" data-match="${match.id}" data-market="BTTS" data-option="Yes" data-odds="${parseFloat((1.8 + Math.random() * 0.4).toFixed(2))}">Yes</button>
                                            <button class="odd-btn small" data-match="${match.id}" data-market="BTTS" data-option="No" data-odds="${parseFloat((2.0 + Math.random() * 0.4).toFixed(2))}">No</button>
                                        </div>
                                    </div>
                                    <div class="market-group">
                                        <span class="market-name">Goals</span>
                                        <div class="odds-row">
                                            <button class="odd-btn small" data-match="${match.id}" data-market="Goals" data-option="+2.5" data-odds="${parseFloat((1.9 + Math.random() * 0.3).toFixed(2))}">+2.5</button>
                                            <button class="odd-btn small" data-match="${match.id}" data-market="Goals" data-option="-2.5" data-odds="${parseFloat((1.8 + Math.random() * 0.3).toFixed(2))}">-2.5</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Re-attach event listeners to new odds buttons
        this.attachOddsListeners();
    }

    attachOddsListeners() {
        document.querySelectorAll('.odd-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleOddClick(e));
        });
    }

    updateSportsSection() {
        const sportsSection = document.getElementById('sportsSection');
        if (!sportsSection || sportsSection.style.display === 'none') return;

        // Filter matches based on current sport filter
        let filteredMatches = this.matches;
        if (this.currentSportFilter === 'laliga') {
            filteredMatches = this.matches.filter(match => match.competition === 'LaLiga' && match.status !== 'finished');
        } else if (this.currentSportFilter === 'hypermotion') {
            filteredMatches = this.matches.filter(match => match.competition === 'LaLiga Hypermotion' && match.status !== 'finished');
        } else if (this.currentSportFilter === 'results') {
            filteredMatches = this.matches.filter(match => match.status === 'finished');
        } else if (this.currentSportFilter === 'all') {
            // For 'all', exclude finished matches (they go to results section)
            filteredMatches = this.matches.filter(match => match.status !== 'finished');
        }

        const liveMatches = filteredMatches.filter(match => match.isLive);
        const upcomingMatches = filteredMatches.filter(match => !match.isLive && match.status !== 'finished');
        
        if (liveMatches.length === 0 && upcomingMatches.length === 0) {
            sportsSection.querySelector('.carousel-container').innerHTML = 
                '<p class="no-matches">No matches available</p>';
            return;
        }

        // Get current game time for date display
        const currentGameTime = this.getCurrentSimulatedTime();
        const currentDateString = currentGameTime.toLocaleDateString();
        const currentTimeString = currentGameTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });

        // Display live matches first, then upcoming
        const featuredMatches = [...liveMatches.slice(0, 2), ...upcomingMatches.slice(0, 2)];
        
        const matchesHTML = featuredMatches.map(match => {
            const matchDate = new Date(match.scheduledTime);
            const matchDateString = matchDate.toLocaleDateString();
            const matchTimeString = matchDate.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });

            return `
                <div class="featured-match">
                    <div class="match-header">
                        <span class="competition">${match.competition}</span>
                        <span class="live-badge">${match.isLive ? 'LIVE' : ''}</span>
                    </div>
                    <div class="match-datetime">
                        <span class="match-date">${matchDateString}</span>
                        <span class="match-time">${matchTimeString}</span>
                    </div>
                    <div class="teams">
                        <div class="team">
                            <span class="team-name">${match.homeTeam}</span>
                        </div>
                        <div class="score">
                            ${match.isLive ? 
                                `<span class="current-score">${match.score.home}-${match.score.away}</span>
                                 <span class="minute">${match.minute}'</span>` :
                                `<span class="scheduled-time">${matchTimeString}</span>`
                            }
                        </div>
                        <div class="team">
                            <span class="team-name">${match.awayTeam}</span>
                        </div>
                    </div>
                    <div class="main-market">
                        <button class="odd-btn" data-match="${match.id}" data-market="1X2" data-option="1" data-odds="${match.odds['1']}">
                            <span class="option">1</span>
                            <span class="odds">${match.odds['1'].toFixed(2)}</span>
                        </button>
                        <button class="odd-btn" data-match="${match.id}" data-market="1X2" data-option="X" data-odds="${match.odds['X']}">
                            <span class="option">X</span>
                            <span class="odds">${match.odds['X'].toFixed(2)}</span>
                        </button>
                        <button class="odd-btn" data-match="${match.id}" data-market="1X2" data-option="2" data-odds="${match.odds['2']}">
                            <span class="option">2</span>
                            <span class="odds">${match.odds['2'].toFixed(2)}</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        sportsSection.querySelector('.carousel-container').innerHTML = matchesHTML;
        
        // Re-attach event listeners for new buttons
        this.attachOddsListeners();
    }

    updateBudgetDisplay() {
        // Update header budget
        const budgetElement = document.getElementById('userBudget');
        if (budgetElement) {
            budgetElement.textContent = `€${this.budget.toFixed(2)}`;
            
            // Change color based on budget level
            if (this.budget < 10) {
                budgetElement.style.color = '#ef4444'; // Red for low budget
            } else if (this.budget < 25) {
                budgetElement.style.color = '#f59e0b'; // Orange for medium budget
            } else {
                budgetElement.style.color = '#4ade80'; // Green for healthy budget
            }
        }

        // Update bet slip budget
        const budgetSlipElement = document.getElementById('userBudgetSlip');
        if (budgetSlipElement) {
            budgetSlipElement.textContent = `€${this.budget.toFixed(2)}`;
            
            // Change color based on budget level
            if (this.budget < 10) {
                budgetSlipElement.style.color = '#ef4444'; // Red for low budget
            } else if (this.budget < 25) {
                budgetSlipElement.style.color = '#f59e0b'; // Orange for medium budget
            } else {
                budgetSlipElement.style.color = '#28a745'; // Green for healthy budget
            }
        }
    }

    settleBet(betId, result) {
        const bet = this.myBets.find(b => b.id === betId);
        if (!bet) return;

        if (result === 'won') {
            // Add winnings to budget
            this.budget += bet.potentialReturn;
            bet.status = 'won';
            bet.claimed = true;
        } else {
            bet.status = 'lost';
            bet.claimed = true;
        }

        this.updateMyBets();
        this.updateBudgetDisplay();
    }

    checkSelectionWon(selection, match) {
        const { market, option } = selection;
        
        if (market === '1X2') {
            let actualResult;
            if (match.score.home > match.score.away) {
                actualResult = '1';
            } else if (match.score.home < match.score.away) {
                actualResult = '2';
            } else {
                actualResult = 'X';
            }
            return option === actualResult;
        } else if (market === 'DC') {
            let actualResult;
            if (match.score.home > match.score.away) {
                actualResult = '1';
            } else if (match.score.home < match.score.away) {
                actualResult = '2';
            } else {
                actualResult = 'X';
            }
            // Double Chance: check if actual result is one of the two outcomes
            if (option === '1X') return actualResult === '1' || actualResult === 'X';
            if (option === 'X2') return actualResult === 'X' || actualResult === '2';
            if (option === '12') return actualResult === '1' || actualResult === '2';
        } else if (market === 'BTTS') {
            const bothTeamsScored = match.score.home > 0 && match.score.away > 0;
            return (option === 'Yes' && bothTeamsScored) || (option === 'No' && !bothTeamsScored);
        } else if (market === 'Goals') {
            const totalGoals = match.score.home + match.score.away;
            if (option === '+2.5') {
                return totalGoals >= 3; // 3 or more goals
            } else if (option === '-2.5') {
                return totalGoals <= 2; // 2 or fewer goals
            }
        }
        
        return false;
    }

    cashOutBet(betId) {
        const bet = this.myBets.find(b => b.id === betId);
<<<<<<< HEAD
        if (!bet) {
            this.showNotification('Bet not found!', 'error');
=======
        if (!bet) return;

        const match = this.matches.find(m => m.id === bet.matchId);
        if (!match || match.status !== 'finished') {
            this.showNotification('You can only claim winnings after the match has ended!', 'error');
>>>>>>> bb59ba713f22a9b55b53cbd8b1b6add54cacae2f
            return;
        }

        if (bet.claimed) {
            this.showNotification('This bet has already been claimed!', 'error');
            return;
        }

<<<<<<< HEAD
        // Check if all matches in this bet are finished
        let allMatchesFinished = true;
        if (bet.selections && bet.selections.length > 0) {
            // For parlays, check all matches
            for (const selection of bet.selections) {
                const selectionMatch = this.matches.find(m => m.id === selection.matchId);
                if (!selectionMatch || selectionMatch.status !== 'finished') {
                    allMatchesFinished = false;
                    break;
                }
            }
        } else {
            // Legacy single bet handling
            const match = this.matches.find(m => m.id === bet.matchId);
            if (!match || match.status !== 'finished') {
                allMatchesFinished = false;
            }
        }

        if (!allMatchesFinished) {
            this.showNotification('You can only claim winnings after all matches have ended!', 'error');
            return;
        }

=======
>>>>>>> bb59ba713f22a9b55b53cbd8b1b6add54cacae2f
        // Calculate the actual result based on market type
        let actualResult;
        let won = false;
        
        // Handle different market types
        if (bet.selections && bet.selections.length > 0) {
            // For parlays, check all selections
            won = bet.selections.every(selection => {
                const selectionMatch = this.matches.find(m => m.id === selection.matchId);
                if (!selectionMatch || selectionMatch.status !== 'finished') return false;
                
                return this.checkSelectionWon(selection, selectionMatch);
            });
        } else {
            // Legacy single bet handling
            won = this.checkSelectionWon({ market: '1X2', option: bet.selection }, match);
        }
        
        if (won) {
            // Add winnings to budget
            this.budget += bet.potentialReturn;
            bet.status = 'won';
        } else {
            bet.status = 'lost';
        }

        // Mark as claimed
        bet.claimed = true;
        
        // Update UI
        this.updateMyBets();
        this.updateBudgetDisplay();
        this.renderMatches(); // Refresh matches to update button states
<<<<<<< HEAD
        this.updateAllBetClaimButtons(); // Ensure all claim buttons are properly updated
=======
>>>>>>> bb59ba713f22a9b55b53cbd8b1b6add54cacae2f
        
        this.showNotification(won ? `Congratulations! You won €${bet.potentialReturn.toFixed(2)}!` : 'Sorry, your bet did not win.', won ? 'success' : 'error');
    }

<<<<<<< HEAD
    updateAllBetClaimButtons() {
        // Force update of all bet displays to ensure claim buttons appear/disappear correctly
        this.myBets.forEach(bet => {
            this.updateBetClaimStatus(bet);
        });
        this.updateMyBets();
    }

    updateBetClaimStatus(bet) {
        // Check if bet can be claimed and update status accordingly
        if (bet.claimed) return;

        let canClaim = false;
        if (bet.selections && bet.selections.length > 0) {
            // For parlays, check all matches
            canClaim = bet.selections.every(selection => {
                const selectionMatch = this.matches.find(m => m.id === selection.matchId);
                return selectionMatch && selectionMatch.status === 'finished';
            });
        } else {
            // Legacy single bet handling
            const match = this.matches.find(m => m.id === bet.matchId);
            canClaim = match && match.status === 'finished';
        }

        // Update bet status if it can be claimed
        if (canClaim && bet.status === 'pending') {
            // Status remains pending until claimed, but button should appear
        }
    }

=======
>>>>>>> bb59ba713f22a9b55b53cbd8b1b6add54cacae2f
    exitPromotions() {
        // Hide promotions page and show sports section
        document.getElementById('promotionsPage').style.display = 'none';
        document.querySelector('.betting-main').style.display = 'block';
        document.getElementById('sportsSection').style.display = 'block';
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('[data-page="sports"]').classList.add('active');
    }
}

// Initialize the game when the page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new BettingGame();
});

// Make game globally accessible for onclick handlers
window.game = game;
