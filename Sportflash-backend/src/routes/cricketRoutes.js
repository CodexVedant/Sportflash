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

// === ENHANCED ENDPOINTS ===

// Get enhanced match scorecard (v2)
router.get('/matches/:id/scorecard-v2', cricketController.getCricketMatchScorecardV2);

// Get enhanced match info
router.get('/matches/:id/info', cricketController.getCricketMatchInfo);

// Get player career stats (enhanced)
router.get('/players/:id/career', cricketController.getCricketPlayerCareer);

// Get trending players
router.get('/players/trending', cricketController.getTrendingPlayers);

// Get series points table (CRITICAL)
router.get('/series/:id/points-table', cricketController.getSeriesPointsTable);

// Get cricket schedules
router.get('/schedules', cricketController.getCricketSchedules);

// === TEAM ENDPOINTS (HIGH VALUE) ===

// Get team schedules
router.get('/teams/:id/schedules', cricketController.getTeamSchedules);

// Get team results
router.get('/teams/:id/results', cricketController.getTeamResults);

// Get team players (detailed squad)
router.get('/teams/:id/players', cricketController.getTeamPlayersDetailed);

// Get team stats
router.get('/teams/:id/stats', cricketController.getTeamStats);

// === NEWS ENDPOINTS (HIGH VALUE) ===

// Get news detail
router.get('/news/:id', cricketController.getCricketNewsDetail);

// Get news categories
router.get('/news/categories/list', cricketController.getNewsCategories);

// === STATS/RECORDS ENDPOINTS (HIGH VALUE) ===

// Get ICC standings
router.get('/stats/standings', cricketController.getICCStandings);

// Get cricket records
router.get('/stats/records', cricketController.getCricketRecords);

module.exports = router;
