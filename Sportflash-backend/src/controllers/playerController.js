const allSportsApi = require('../services/allSportsApiService');
const { mapPlayer } = require('../utils/dataMappers');

/**
 * @desc    Get player details
 * @route   GET /api/players/:id
 * @access  Public
 */
exports.getPlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const { sport } = req.query;

        if (!sport) {
            return res.status(400).json({
                success: false,
                message: 'Sport parameter is required'
            });
        }

        let playerData = null;
        let mappedPlayer = null;

        switch (sport.toLowerCase()) {
            case 'football':
            case 'soccer':
                const footballPlayers = await allSportsApi.getFootballPlayer(id);
                if (footballPlayers && footballPlayers.length > 0) {
                    playerData = footballPlayers[0];
                    mappedPlayer = mapPlayer(playerData, 'football');
                }
                break;

            case 'basketball':
            case 'cricket':
                // Currently not supported by base API service for direct Player ID lookup
                // We return a mock/placeholder to avoid UI crash, or 404 if preferred.
                // For a polished app, we'd enable this or use a different endpoint.
                return res.status(501).json({
                    success: false,
                    message: `Player details for ${sport} are not yet supported by the provider.`
                });

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid sport specified'
                });
        }

        if (!mappedPlayer) {
            return res.status(404).json({
                success: false,
                message: 'Player not found'
            });
        }

        res.json({
            success: true,
            data: mappedPlayer
        });

    } catch (error) {
        console.error('Error in getPlayer:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching player details',
            error: error.message
        });
    }
};
