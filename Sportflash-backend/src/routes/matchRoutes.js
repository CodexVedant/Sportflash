const express = require('express');
const router = express.Router();
const {
    getMatches,
    getLiveMatches,
    getMatchesBySport,
    getMatch,
    getUpcomingMatches,
    getLeagues,
    getLeagueMatches,
    getStandings,
    getHeadToHead,
    getMatchCommentary,
    createMatch,
    updateMatch,
    getFollowedMatches
} = require('../controllers/matchController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getMatches);
router.get('/live', getLiveMatches);
router.get('/upcoming', getUpcomingMatches);
router.post('/following', getFollowedMatches); // Using POST to send large array of teams
router.get('/leagues', getLeagues);
router.get('/league/:leagueId', getLeagueMatches);
router.get('/league/:leagueId/topscorers', require('../controllers/matchController').getTopScorers);
router.get('/standings', getStandings);
router.get('/h2h', getHeadToHead);
router.get('/sport/:sport', getMatchesBySport);
router.get('/:id/commentary', getMatchCommentary);
router.get('/:id', getMatch);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createMatch);
router.put('/:id', protect, authorize('admin'), updateMatch);

module.exports = router;
