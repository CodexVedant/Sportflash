const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes are protected

router.get('/', getNotifications);
router.put('/readall', markAllAsRead); // Must be before /:id/read
router.put('/:id/read', markAsRead);

module.exports = router;
