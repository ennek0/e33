// Test script to verify scheduling constraints
const BettingGame = require('./betting.js');

// Create a test instance
const game = new BettingGame();
const matches = game.matches;

console.log('=== Scheduling Test Results ===');
console.log(`Total matches generated: ${matches.length}`);

// Check match days distribution
const dayCounts = {};
matches.forEach(match => {
    dayCounts[match.dayName] = (dayCounts[match.dayName] || 0) + 1;
});

console.log('\nMatch distribution by day:');
Object.entries(dayCounts).forEach(([day, count]) => {
    console.log(`${day}: ${count} matches`);
});

// Check team participation (each team should play exactly once)
const teamCounts = {};
matches.forEach(match => {
    teamCounts[match.homeTeam] = (teamCounts[match.homeTeam] || 0) + 1;
    teamCounts[match.awayTeam] = (teamCounts[match.awayTeam] || 0) + 1;
});

console.log('\nTeam participation check:');
let teamsWithMultipleMatches = 0;
let teamsWithNoMatches = 0;

Object.entries(teamCounts).forEach(([team, count]) => {
    if (count > 1) {
        teamsWithMultipleMatches++;
        console.log(`${team}: ${count} matches (ISSUE - should be 1)`);
    } else if (count === 1) {
        console.log(`${team}: ${count} match ✓`);
    } else {
        teamsWithNoMatches++;
        console.log(`${team}: ${count} matches (ISSUE - should be 1)`);
    }
});

console.log(`\nSummary:`);
console.log(`Teams with multiple matches: ${teamsWithMultipleMatches}`);
console.log(`Teams with no matches: ${teamsWithNoMatches}`);
console.log(`Teams playing exactly once: ${Object.keys(teamCounts).length - teamsWithMultipleMatches - teamsWithNoMatches}`);

// Check time variety
const timeSlots = new Set();
matches.forEach(match => {
    timeSlots.add(match.time);
});

console.log(`\nTime slots used: ${Array.from(timeSlots).sort()}`);
console.log(`Unique time slots: ${timeSlots.size}`);

// Verify Monday has very few matches (unlikely day)
const mondayMatches = matches.filter(m => m.dayName === 'Monday');
console.log(`\nMonday matches: ${mondayMatches.length} (should be very few)`);
