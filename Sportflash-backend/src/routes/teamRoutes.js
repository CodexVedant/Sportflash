const express = require('express');
const router = express.Router();
const { getTeam } = require('../controllers/teamController');

// Public routes
router.get('/:id', getTeam);

module.exports = router;
