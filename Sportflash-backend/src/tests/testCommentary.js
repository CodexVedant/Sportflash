/**
 * Test Commentary Endpoint
 * 
 * This script tests the cricket match commentary endpoint
 * 
 * Usage:
 * 1. Make sure the backend server is running (npm run dev)
 * 2. Run: node src/tests/testCommentary.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testCommentaryEndpoint() {
    console.log('🏏 Testing Cricket Commentary Endpoint\n');
    console.log('='.repeat(60));

    try {
        // Step 1: Get live cricket matches
        console.log('\n📡 Step 1: Fetching live cricket matches...');
        const liveResponse = await axios.get(`${BASE_URL}/matches/live?sport=cricket`);

        if (!liveResponse.data.success || !liveResponse.data.data || liveResponse.data.data.length === 0) {
            console.log('❌ No live cricket matches found');
            console.log('💡 Try testing with a match ID from a recent match');
            return;
        }

        const matches = liveResponse.data.data;
        console.log(`✅ Found ${matches.length} live cricket match(es)`);

        // Step 2: Get the first match ID
        const firstMatch = matches[0];
        const matchId = firstMatch.id || firstMatch._id;

        console.log(`\n📋 Match Details:`);
        console.log(`   ID: ${matchId}`);
        console.log(`   Match: ${firstMatch.homeTeam?.name} vs ${firstMatch.awayTeam?.name}`);
        console.log(`   League: ${firstMatch.league}`);
        console.log(`   Status: ${firstMatch.displayStatus || firstMatch.status}`);

        // Step 3: Fetch commentary for this match
        console.log(`\n📡 Step 2: Fetching commentary for match ${matchId}...`);
        const commentaryResponse = await axios.get(`${BASE_URL}/matches/${matchId}/commentary?sport=cricket`);

        if (!commentaryResponse.data.success) {
            console.log('❌ Failed to fetch commentary');
            console.log('Response:', commentaryResponse.data);
            return;
        }

        const commentary = commentaryResponse.data.data.commentary;

        console.log('\n✅ Commentary fetched successfully!');
        console.log('\n📝 Commentary Structure:');
        console.log(JSON.stringify(commentary, null, 2).substring(0, 1000) + '...');

        // Step 4: Display some commentary if available
        if (commentary && commentary.Live && commentary.Live.length > 0) {
            console.log(`\n🎙️  Live Commentary (Latest ${Math.min(5, commentary.Live.length)} balls):\n`);
            commentary.Live.slice(0, 5).forEach((comment, index) => {
                console.log(`   ${index + 1}. Over ${comment.overs || 'N/A'}: ${comment.comment || 'No comment'}`);
                if (comment.score) console.log(`      Score: ${comment.score}`);
            });
        } else {
            console.log('\n⚠️  No live commentary available for this match');
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ Test completed successfully!');
        console.log('\n📌 Endpoint URL:');
        console.log(`   GET ${BASE_URL}/matches/:matchId/commentary?sport=cricket`);
        console.log('\n📌 Example:');
        console.log(`   GET ${BASE_URL}/matches/${matchId}/commentary?sport=cricket`);

    } catch (error) {
        console.error('\n❌ Error testing commentary endpoint:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

// Run the test
testCommentaryEndpoint();
