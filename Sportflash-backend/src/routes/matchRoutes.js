const express = require('express');
const router = express.Router();
const {
    getMatches,
    getLiveMatches,
    getMatchesBySport,
    getMatch,
    getUpcomingMatches,
    createMatch,
    updateMatch
} = require('../controllers/matchController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getMatches);
router.get('/live', getLiveMatches);
router.get('/upcoming', getUpcomingMatches);
router.get('/sport/:sport', getMatchesBySport);
router.get('/:id', getMatch);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createMatch);
router.put('/:id', protect, authorize('admin'), updateMatch);

module.exports = router;
