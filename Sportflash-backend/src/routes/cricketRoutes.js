const express = require('express');
const router = express.Router();
const cricketController = require('../controllers/cricketController');

/**
 * Cricket Routes (using Cricbuzz API)
 * Base path: /api/cricket
 */

// === MATCHES ===

// Get live cricket matches
router.get('/matches/live', cricketController.getLiveCricketMatches);

// Get recent cricket matches
router.get('/matches/recent', cricketController.getRecentCricketMatches);

// Get upcoming cricket matches
router.get('/matches/upcoming', cricketController.getUpcomingCricketMatches);

// Get cricket match details
router.get('/matches/:id', cricketController.getCricketMatchDetails);

// Get cricket match scorecard
router.get('/matches/:id/scorecard', cricketController.getCricketMatchScorecard);

// Get cricket match commentary (ball-by-ball)
router.get('/matches/:id/commentary', cricketController.getCricketMatchCommentary);

// === TEAMS ===

// Get cricket teams (international, domestic, league)
router.get('/teams', cricketController.getCricketTeams);

// === PLAYERS ===

// Search cricket player
router.get('/players/search', cricketController.searchCricketPlayer);

// Get cricket player details
router.get('/players/:id', cricketController.getCricketPlayerDetails);

// === RANKINGS ===

// Get ICC rankings (batsmen, bowlers, all-rounders, teams)
router.get('/rankings', cricketController.getICCRankings);

// === NEWS ===

// Get cricket news
router.get('/news', cricketController.getCricketNews);

// === SERIES ===

// Get cricket series (international, domestic, league)
router.get('/series', cricketController.getCricketSeries);

module.exports = router;
