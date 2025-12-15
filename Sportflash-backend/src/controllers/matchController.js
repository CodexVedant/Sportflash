const Match = require('../models/Match');

// @desc    Get all live matches
// @route   GET /api/matches/live
// @access  Public
exports.getLiveMatches = async (req, res) => {
    try {
        const matches = await Match.find({ status: 'live' })
            .sort({ scheduledAt: -1 });

        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get matches by sport
// @route   GET /api/matches/sport/:sport
// @access  Public
exports.getMatchesBySport = async (req, res) => {
    try {
        const { sport } = req.params;
        const { status } = req.query;

        const query = { sport };
        if (status) query.status = status;

        const matches = await Match.find(query)
            .sort({ scheduledAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single match
// @route   GET /api/matches/:id
// @access  Public
exports.getMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }

        res.status(200).json({
            success: true,
            data: match
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get upcoming matches
// @route   GET /api/matches/upcoming
// @access  Public
exports.getUpcomingMatches = async (req, res) => {
    try {
        const matches = await Match.find({
            status: 'upcoming',
            scheduledAt: { $gte: new Date() }
        })
            .sort({ scheduledAt: 1 })
            .limit(20);

        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create match (Admin only)
// @route   POST /api/matches
// @access  Private/Admin
exports.createMatch = async (req, res) => {
    try {
        const match = await Match.create(req.body);

        res.status(201).json({
            success: true,
            data: match
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update match (Admin only)
// @route   PUT /api/matches/:id
// @access  Private/Admin
exports.updateMatch = async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }

        // Emit socket event for live updates
        const io = req.app.get('io');
        io.to(`match_${match._id}`).emit('match_update', match);

        res.status(200).json({
            success: true,
            data: match
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
