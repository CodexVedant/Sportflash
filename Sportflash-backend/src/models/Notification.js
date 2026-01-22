const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    data: {
        type: Object, // Store matchId, sport, etc.
        default: {}
    },
    read: {
        type: Boolean,
        default: false
    },
    type: {
        type: String, // 'match_update', 'news', 'system'
        default: 'system'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // Auto-delete after 7 days (TTL Index) to save space
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
