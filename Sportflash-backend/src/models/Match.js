const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    sport: {
        type: String,
        required: true,
        enum: ['cricket', 'football', 'basketball'],
        index: true
    },
    league: {
        type: String,
        required: true
    },
    homeTeam: {
        name: { type: String, required: true },
        logo: { type: String },
        score: { type: mongoose.Schema.Types.Mixed }
    },
    awayTeam: {
        name: { type: String, required: true },
        logo: { type: String },
        score: { type: mongoose.Schema.Types.Mixed }
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'finished', 'postponed', 'cancelled'],
        default: 'upcoming',
        index: true
    },
    scheduledAt: {
        type: Date,
        required: true,
        index: true
    },
    venue: {
        name: String,
        city: String,
        country: String
    },
    currentMinute: String,

    // Sport-specific fields
    cricketData: {
        overs: String,
        innings: Number,
        target: Number,
        runRate: Number
    },
    footballData: {
        halfTime: Boolean,
        extraTime: Boolean,
        penalties: Boolean
    },
    basketballData: {
        quarter: Number,
        overtime: Boolean
    },

    // External API reference
    externalId: {
        type: String,
        unique: true,
        sparse: true
    },
    apiSource: {
        type: String,
        enum: ['api-football', 'cricketdata', 'manual']
    }
}, {
    timestamps: true
});

// Index for querying live matches
matchSchema.index({ status: 1, scheduledAt: -1 });
matchSchema.index({ sport: 1, status: 1 });

module.exports = mongoose.model('Match', matchSchema);
