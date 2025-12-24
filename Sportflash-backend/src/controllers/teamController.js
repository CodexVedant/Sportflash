const allSportsApi = require('../services/allSportsApiService');
const { mapTeam } = require('../utils/dataMappers');

/**
 * @desc    Get team details
 * @route   GET /api/teams/:id
 * @access  Public
 */
exports.getTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { sport } = req.query;

        if (!sport) {
            return res.status(400).json({
                success: false,
                message: 'Sport parameter is required'
            });
        }

        let teamData = null;
        let mappedTeam = null;

        switch (sport.toLowerCase()) {
            case 'football':
            case 'soccer':
                const footballTeams = await allSportsApi.getFootballTeam(id);
                if (footballTeams && footballTeams.length > 0) {
                    teamData = footballTeams[0];
                    mappedTeam = mapTeam(teamData, 'football');
                }
                break;

            case 'basketball':
                const basketballTeams = await allSportsApi.getBasketballTeam(id);
                if (basketballTeams && basketballTeams.length > 0) {
                    teamData = basketballTeams[0];
                    mappedTeam = mapTeam(teamData, 'basketball');
                }
                break;

            case 'cricket':
                const cricketTeams = await allSportsApi.getCricketTeam(id);
                if (cricketTeams && cricketTeams.length > 0) {
                    teamData = cricketTeams[0];
                    mappedTeam = mapTeam(teamData, 'cricket');
                }
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid sport specified'
                });
        }

        if (!mappedTeam) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Ideally, we would also fetch "Form" (Last 5 matches) here and attach it
        // mappedTeam.recentMatches = ...

        res.json({
            success: true,
            data: mappedTeam
        });

    } catch (error) {
        console.error('Error in getTeam:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching team details',
            error: error.message
        });
    }
};
