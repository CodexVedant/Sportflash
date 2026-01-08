require('dotenv').config();
const api = require('./src/services/allSportsApiService');

(async () => {
    try {
        console.log('--- Step 1: Fetch Fixtures (Wider Range) ---');
        // Fetch fixtures to get a valid Team ID
        const fixtures = await api.getCricketFixtures({ from: '2025-01-01', to: '2025-01-30' });

        let match = null;
        if (fixtures && fixtures.length > 0) {
            match = fixtures.find(m => m.event_home_team_key && m.event_home_team !== 'TBA');
        }

        if (!match) {
            console.log('No valid match found with checking.');
            // Fallback: Try fetching Leagues -> Standings -> Team ID?
            // Or just try a known ID if possible.
            // Let's try Team ID 96 (Australia?) or something common.
            // But I don't know IDs.
            // Let's try to list Leagues.
            return;
        }

        console.log(`Found Match: ${match.event_home_team} vs ${match.event_away_team}`);
        const teamId = match.event_home_team_key;
        console.log(`Home Team ID: ${teamId}`);

        // Try fetching players by Team ID directly
        console.log('\n--- Step 2: Fetch Players by Team ID ---');
        // 'Players' endpoint usually supports team_id
        const teamPlayers = await api.makeRequest('cricket', 'Players', { team_id: teamId });

        if (!teamPlayers || teamPlayers.length === 0) {
            console.log('No players found for this team via Players endpoint.');
            return;
        }

        const firstPlayer = teamPlayers[0];
        console.log(`First Player: ${firstPlayer.player_name} (ID: ${firstPlayer.player_key})`);
        console.log('PLAYER LIST ITEM JSON:', JSON.stringify(firstPlayer, null, 2));

        console.log('\n--- Step 3: Fetch Player Details (Individual) ---');
        // Now call the new method
        const playerDetailsList = await api.getCricketPlayer(firstPlayer.player_key);
        // It returns an array
        const playerDetails = playerDetailsList ? playerDetailsList[0] : null;
        console.log('PLAYER DETAILS JSON:', JSON.stringify(playerDetails, null, 2));

    } catch (error) {
        console.error('Test Failed:', error);
    }
})();
