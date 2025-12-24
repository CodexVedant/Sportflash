const express = require('express');
const router = express.Router();
const { getPlayer } = require('../controllers/playerController');

// Public routes
router.get('/:id', getPlayer);

module.exports = router;
