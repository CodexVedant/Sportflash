const mongoose = require('mongoose');

const matchStateSchema = new mongoose.Schema({
    matchId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    sport: {
        type: String,
        required: true,
        enum: ['cricket', 'football', 'basketball']
    },
    status: String,
    score: String, // Raw score string for football/basketball
    homeScore: String,
    awayScore: String,

    // Cricket Specifics
    homeWickets: { type: Number, default: 0 },
    awayWickets: { type: Number, default: 0 },
    lastMilestone: { type: String, default: null }, // Track last milestone to prevent duplicates

    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MatchState', matchStateSchema);
