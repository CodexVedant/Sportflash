const mongoose = require('mongoose');

const liveMatchStateSchema = new mongoose.Schema({
    matchId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    sport: {
        type: String,
        enum: ['cricket', 'football', 'basketball'],
        required: true
    },

    // For football/basketball (Sum of scores to detect goals/points)
    lastTotalScore: {
        type: Number,
        default: 0
    },

    // Storing raw strings for precise run calculation
    lastHomeScoreStr: { type: String, default: '' },
    lastAwayScoreStr: { type: String, default: '' },

    // For cricket
    lastHomeWickets: {
        type: Number,
        default: 0
    },
    lastAwayWickets: {
        type: Number,
        default: 0
    },

    lastStatus: {
        type: String,
        default: ''
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LiveMatchState', liveMatchStateSchema);
