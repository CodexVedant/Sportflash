/**
 * Test script for AllSportsAPI integration
 * Run with: node src/tests/testAllSportsApi.js
 */

require('dotenv').config();
const allSportsApi = require('../services/allSportsApiService');
const {
    mapFootballMatch,
    mapBasketballMatch,
    mapCricketMatch
} = require('../utils/dataMappers');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n`)
};

async function testFootballAPI() {
    log.section('Testing Football API');

    try {
        // Test 1: Get Countries
        log.info('Test 1: Fetching football countries...');
        const countries = await allSportsApi.getFootballCountries();
        if (countries && countries.length > 0) {
            log.success(`Found ${countries.length} countries`);
            console.log(`   Sample: ${countries.slice(0, 3).map(c => c.country_name).join(', ')}`);
        } else {
            log.warn('No countries found');
        }

        // Test 2: Get Leagues
        log.info('Test 2: Fetching football leagues...');
        const leagues = await allSportsApi.getFootballLeagues();
        if (leagues && leagues.length > 0) {
            log.success(`Found ${leagues.length} leagues`);
            console.log(`   Sample: ${leagues.slice(0, 3).map(l => l.league_name).join(', ')}`);
        } else {
            log.warn('No leagues found');
        }

        // Test 3: Get Live Scores
        log.info('Test 3: Fetching football live scores...');
        const liveMatches = await allSportsApi.getFootballLiveScores();
        if (liveMatches && liveMatches.length > 0) {
            log.success(`Found ${liveMatches.length} live matches`);

            // Map first match
            const mappedMatch = mapFootballMatch(liveMatches[0]);
            console.log('\n   Sample Match:');
            console.log(`   ${mappedMatch.homeTeam.name} vs ${mappedMatch.awayTeam.name}`);
            console.log(`   Score: ${mappedMatch.score.fulltime || 'Not started'}`);
            console.log(`   League: ${mappedMatch.league.name}`);
            console.log(`   Status: ${mappedMatch.status}`);
        } else {
            log.warn('No live football matches at the moment');
        }

        // Test 4: Get Fixtures
        log.info('Test 4: Fetching football fixtures for today...');
        const today = new Date().toISOString().split('T')[0];
        const fixtures = await allSportsApi.getFootballFixtures({ date: today });
        if (fixtures && fixtures.length > 0) {
            log.success(`Found ${fixtures.length} fixtures for today`);
        } else {
            log.warn('No fixtures found for today');
        }

        log.success('Football API tests completed');
        return true;
    } catch (error) {
        log.error(`Football API test failed: ${error.message}`);
        console.error(error);
        return false;
    }
}

async function testBasketballAPI() {
    log.section('Testing Basketball API');

    try {
        // Test 1: Get Countries
        log.info('Test 1: Fetching basketball countries...');
        const countries = await allSportsApi.getBasketballCountries();
        if (countries && countries.length > 0) {
            log.success(`Found ${countries.length} countries`);
            console.log(`   Sample: ${countries.slice(0, 3).map(c => c.country_name).join(', ')}`);
        } else {
            log.warn('No countries found');
        }

        // Test 2: Get Leagues
        log.info('Test 2: Fetching basketball leagues...');
        const leagues = await allSportsApi.getBasketballLeagues();
        if (leagues && leagues.length > 0) {
            log.success(`Found ${leagues.length} leagues`);
            console.log(`   Sample: ${leagues.slice(0, 3).map(l => l.league_name).join(', ')}`);
        } else {
            log.warn('No leagues found');
        }

        // Test 3: Get Live Scores
        log.info('Test 3: Fetching basketball live scores...');
        const liveMatches = await allSportsApi.getBasketballLiveScores();
        if (liveMatches && liveMatches.length > 0) {
            log.success(`Found ${liveMatches.length} live games`);

            // Map first match
            const mappedMatch = mapBasketballMatch(liveMatches[0]);
            console.log('\n   Sample Game:');
            console.log(`   ${mappedMatch.homeTeam.name} vs ${mappedMatch.awayTeam.name}`);
            console.log(`   Score: ${mappedMatch.score.final || 'Not started'}`);
            console.log(`   League: ${mappedMatch.league.name}`);
            console.log(`   Status: ${mappedMatch.status}`);
        } else {
            log.warn('No live basketball games at the moment');
        }

        // Test 4: Get Fixtures
        log.info('Test 4: Fetching basketball fixtures for today...');
        const today = new Date().toISOString().split('T')[0];
        const fixtures = await allSportsApi.getBasketballFixtures({ date: today });
        if (fixtures && fixtures.length > 0) {
            log.success(`Found ${fixtures.length} fixtures for today`);
        } else {
            log.warn('No fixtures found for today');
        }

        log.success('Basketball API tests completed');
        return true;
    } catch (error) {
        log.error(`Basketball API test failed: ${error.message}`);
        console.error(error);
        return false;
    }
}

async function testCricketAPI() {
    log.section('Testing Cricket API');

    try {
        // Test 1: Get Leagues
        log.info('Test 1: Fetching cricket leagues...');
        const leagues = await allSportsApi.getCricketLeagues();
        if (leagues && leagues.length > 0) {
            log.success(`Found ${leagues.length} leagues`);
            console.log(`   Sample: ${leagues.slice(0, 3).map(l => l.league_name).join(', ')}`);
        } else {
            log.warn('No leagues found');
        }

        // Test 2: Get Live Scores
        log.info('Test 2: Fetching cricket live scores...');
        const liveMatches = await allSportsApi.getCricketLiveScores();
        if (liveMatches && liveMatches.length > 0) {
            log.success(`Found ${liveMatches.length} live matches`);

            // Map first match
            const mappedMatch = mapCricketMatch(liveMatches[0]);
            console.log('\n   Sample Match:');
            console.log(`   ${mappedMatch.homeTeam.name} vs ${mappedMatch.awayTeam.name}`);
            console.log(`   Score: ${mappedMatch.homeTeam.score || 'Not started'}`);
            console.log(`   League: ${mappedMatch.league.name}`);
            console.log(`   Status: ${mappedMatch.status}`);
            console.log(`   Type: ${mappedMatch.matchType}`);
        } else {
            log.warn('No live cricket matches at the moment');
        }

        // Test 3: Get Fixtures
        log.info('Test 3: Fetching cricket fixtures for today...');
        const today = new Date().toISOString().split('T')[0];
        const fixtures = await allSportsApi.getCricketFixtures({ date: today });
        if (fixtures && fixtures.length > 0) {
            log.success(`Found ${fixtures.length} fixtures for today`);
        } else {
            log.warn('No fixtures found for today');
        }

        log.success('Cricket API tests completed');
        return true;
    } catch (error) {
        log.error(`Cricket API test failed: ${error.message}`);
        console.error(error);
        return false;
    }
}

async function testUnifiedAPI() {
    log.section('Testing Unified API');

    try {
        log.info('Fetching all live scores...');
        const allScores = await allSportsApi.getAllLiveScores();

        console.log('\n   Results:');
        console.log(`   Football: ${allScores.football?.length || 0} matches`);
        console.log(`   Basketball: ${allScores.basketball?.length || 0} games`);
        console.log(`   Cricket: ${allScores.cricket?.length || 0} matches`);
        console.log(`   Timestamp: ${allScores.timestamp}`);

        const totalMatches =
            (allScores.football?.length || 0) +
            (allScores.basketball?.length || 0) +
            (allScores.cricket?.length || 0);

        log.success(`Total live matches across all sports: ${totalMatches}`);
        return true;
    } catch (error) {
        log.error(`Unified API test failed: ${error.message}`);
        console.error(error);
        return false;
    }
}

async function runAllTests() {
    console.log('\n');
    log.section('🧪 AllSportsAPI Integration Test Suite');

    console.log(`API Key: ${process.env.ALLSPORTS_API_KEY ? '✓ Configured' : '✗ Missing'}`);
    console.log(`Trial Expires: 2026-01-07\n`);

    const results = {
        football: false,
        basketball: false,
        cricket: false,
        unified: false
    };

    // Run tests sequentially to avoid rate limiting
    results.football = await testFootballAPI();
    await sleep(2000); // Wait 2 seconds between tests

    results.basketball = await testBasketballAPI();
    await sleep(2000);

    results.cricket = await testCricketAPI();
    await sleep(2000);

    results.unified = await testUnifiedAPI();

    // Summary
    log.section('Test Summary');
    console.log(`Football API:    ${results.football ? colors.green + '✓ PASSED' : colors.red + '✗ FAILED'}${colors.reset}`);
    console.log(`Basketball API:  ${results.basketball ? colors.green + '✓ PASSED' : colors.red + '✗ FAILED'}${colors.reset}`);
    console.log(`Cricket API:     ${results.cricket ? colors.green + '✓ PASSED' : colors.red + '✗ FAILED'}${colors.reset}`);
    console.log(`Unified API:     ${results.unified ? colors.green + '✓ PASSED' : colors.red + '✗ FAILED'}${colors.reset}`);

    const totalPassed = Object.values(results).filter(r => r).length;
    const totalTests = Object.keys(results).length;

    console.log(`\n${colors.cyan}Overall: ${totalPassed}/${totalTests} tests passed${colors.reset}\n`);

    if (totalPassed === totalTests) {
        log.success('All tests passed! AllSportsAPI integration is working correctly.');
    } else {
        log.error('Some tests failed. Please check the errors above.');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run tests
if (require.main === module) {
    runAllTests().catch(error => {
        log.error(`Test suite failed: ${error.message}`);
        console.error(error);
        process.exit(1);
    });
}

module.exports = { runAllTests };
