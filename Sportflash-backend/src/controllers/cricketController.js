const cricbuzzService = require('../services/cricbuzzService');
const { extractCricbuzzMatches, mapCricbuzzCommentary, mapCricbuzzScorecard } = require('../utils/cricbuzzMappers');

/**
 * Cricket-specific controller using Cricbuzz API
 */

/**
 * @desc    Get live cricket matches
 * @route   GET /api/cricket/matches/live
 * @access  Public
 */
exports.getLiveCricketMatches = async (req, res) => {
    try {
        console.log('🏏 Fetching live cricket matches from Cricbuzz...');

        const response = await cricbuzzService.getLiveMatches();
        const matches = extractCricbuzzMatches(response);

        res.json({
            success: true,
            count: matches.length,
            data: matches,
            source: 'Cricbuzz API'
        });
    } catch (error) {
        console.error('Error in getLiveCricketMatches:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching live cricket matches',
            error: error.message
        });
    }
};

/**
 * @desc    Get recent cricket matches
 * @route   GET /api/cricket/matches/recent
 * @access  Public
 */
exports.getRecentCricketMatches = async (req, res) => {
    try {
        console.log('🏏 Fetching recent cricket matches from Cricbuzz...');

        const response = await cricbuzzService.getRecentMatches();
        const matches = extractCricbuzzMatches(response);

        res.json({
            success: true,
            count: matches.length,
            data: matches,
            source: 'Cricbuzz API'
        });
    } catch (error) {
        console.error('Error in getRecentCricketMatches:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent cricket matches',
            error: error.message
        });
    }
};

/**
 * @desc    Get upcoming cricket matches
 * @route   GET /api/cricket/matches/upcoming
 * @access  Public
 */
exports.getUpcomingCricketMatches = async (req, res) => {
    try {
        console.log('🏏 Fetching upcoming cricket matches from Cricbuzz...');

        const response = await cricbuzzService.getUpcomingMatches();
        const matches = extractCricbuzzMatches(response);

        res.json({
            success: true,
            count: matches.length,
            data: matches,
            source: 'Cricbuzz API'
        });
    } catch (error) {
        console.error('Error in getUpcomingCricketMatches:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching upcoming cricket matches',
            error: error.message
        });
    }
};

/**
 * @desc    Get cricket match details
 * @route   GET /api/cricket/matches/:id
 * @access  Public
 */
exports.getCricketMatchDetails = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🏏 Fetching cricket match details for ID: ${id}`);

        const matchDetails = await cricbuzzService.getMatchDetails(id);

        if (!matchDetails) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }

        res.json({
            success: true,
            data: matchDetails,
            source: 'Cricbuzz API'
        });
    } catch (error) {
        console.error('Error in getCricketMatchDetails:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cricket match details',
            error: error.message
        });
    }
};

/**
 * @desc    Get cricket match scorecard
 * @route   GET /api/cricket/matches/:id/scorecard
 * @access  Public
 */
exports.getCricketMatchScorecard = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🏏 Fetching scorecard for match ID: ${id}`);

        const scorecard = await cricbuzzService.getMatchScorecard(id);
        const mappedScorecard = mapCricbuzzScorecard(scorecard);

        res.json({
            success: true,
            data: mappedScorecard,
            source: 'Cricbuzz API'
        });
    } catch (error) {
        console.error('Error in getCricketMatchScorecard:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching match scorecard',
            error: error.message
        });
    }
};

/**
 * @desc    Get cricket match commentary (ball-by-ball)
 * @route   GET /api/cricket/matches/:id/commentary
 * @access  Public
 */
exports.getCricketMatchCommentary = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🏏 Fetching commentary for match ID: ${id}`);

        const commentary = await cricbuzzService.getMatchCommentary(id);
        const mappedCommentary = mapCricbuzzCommentary(commentary);

        res.json({
            success: true,
            data: mappedCommentary,
            source: 'Cricbuzz API'
        });
    } catch (error) {
        console.error('Error in getCricketMatchCommentary:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching match commentary',
            error: error.message
        });
    }
};

/**
 * @desc    Get cricket teams
 * @route   GET /api/cricket/teams
 * @access  Public
 */
exports.getCricketTeams = async (req, res) => {
    try {
        const { type = 'international' } = req.query;
        console.log(`🏏 Fetching ${type} cricket teams...`);

        let teams;
        switch (type.toLowerCase()) {
            case 'international':
                teams = await cricbuzzService.getInternationalTeams();
                break;
            case 'domestic':
                teams = await cricbuzzService.getDomesticTeams();
                break;
            case 'league':
                teams = await cricbuzzService.getLeagueTeams();
                break;
            default:
                teams = await cricbuzzService.getInternationalTeams();
        }

        res.json({
            success: true,
            data: teams,
            source: 'Cricbuzz API'
        });
    } catch (error) {
        console.error('Error in getCricketTeams:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cricket teams',
            error: error.message
        });
    }
};

/**
 * @desc    Get ICC rankings
 * @route   GET /api/cricket/rankings
 * @access  Public
 */
exports.getICCRankings = async (req, res) => {
    try {
        const { type = 'batsmen', format = 'test' } = req.query;
        console.log(`🏏 Fetching ICC ${type} rankings for ${format}...`);

        let rankings;
        switch (type.toLowerCase()) {
            case 'batsmen':
            case 'batting':
                rankings = await cricbuzzService.getBatsmenRankings(format);
                break;
            case 'bowlers':
            case 'bowling':
                rankings = await cricbuzzService.getBowlersRankings(format);
                break;
            case 'allrounders':
            case 'all-rounders':
                rankings = await cricbuzzService.getAllRoundersRankings(format);
                break;
            case 'teams':
                rankings = await cricbuzzService.getTeamRankings(format);
                break;
            default:
                rankings = await cricbuzzService.getBatsmenRankings(format);
        }

        res.json({
            success: true,
            data: rankings,
            source: 'Cricbuzz API'
        });
    } catch (error) {
        console.error('Error in getICCRankings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching ICC rankings',
            error: error.message
        });
    }
};

/**
 * @desc    Get cricket news
 * @route   GET /api/cricket/news
 * @access  Public
 */
exports.getCricketNews = async (req, res) => {
    try {
        console.log('🏏 Fetching cricket news from Cricbuzz...');

        const news = await cricbuzzService.getCricketNews();

        res.json({
            success: true,
            data: news,
            source: 'Cricbuzz API'
        });
    } catch (error) {
        console.error('Error in getCricketNews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cricket news',
            error: error.message
        });
    }
};

/**
 * @desc    Get cricket series
 * @route   GET /api/cricket/series
 * @access  Public
 */
exports.getCricketSeries = async (req, res) => {
    try {
        const { type = 'international' } = req.query;
        console.log(`🏏 Fetching ${type} cricket series...`);

        let series;
        switch (type.toLowerCase()) {
            case 'international':
                series = await cricbuzzService.getInternationalSeries();
                break;
            case 'domestic':
                series = await cricbuzzService.getDomesticSeries();
                break;
            case 'league':
                series = await cricbuzzService.getLeagueSeries();
                break;
            default:
                series = await cricbuzzService.getInternationalSeries();
        }

        res.json({
            success: true,
            data: series,
            source: 'Cricbuzz API'
        });
    } catch (error) {
        console.error('Error in getCricketSeries:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cricket series',
            error: error.message
        });
    }
};

/**
 * @desc    Search cricket player
 * @route   GET /api/cricket/players/search
 * @access  Public
 */
exports.searchCricketPlayer = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query (q) is required'
            });
        }

        console.log(`🏏 Searching for cricket player: ${q}`);

        const results = await cricbuzzService.searchPlayer(q);

        res.json({
            success: true,
            data: results,
            source: 'Cricbuzz API'
        });
    } catch (error) {
        console.error('Error in searchCricketPlayer:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching for player',
            error: error.message
        });
    }
};

/**
 * @desc    Get cricket player details
 * @route   GET /api/cricket/players/:id
 * @access  Public
 */
exports.getCricketPlayerDetails = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🏏 Fetching cricket player details for ID: ${id}`);

        const player = await cricbuzzService.getPlayerDetails(id);

        res.json({
            success: true,
            data: player,
            source: 'Cricbuzz API'
        });
    } catch (error) {
        console.error('Error in getCricketPlayerDetails:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching player details',
            error: error.message
        });
    }
};

module.exports = exports;
