const allSportsApi = require('../services/allSportsApiService');
const {
    mapFootballMatch,
    mapBasketballMatch,
    mapCricketMatch,
    mapLeague,
    mapStandings
} = require('../utils/dataMappers');

/**
 * @desc    Get all matches
 * @route   GET /api/matches
 * @access  Public
 */
exports.getMatches = async (req, res) => {
    try {
        const { sport, date, league } = req.query;

        let matches = [];

        if (sport) {
            // Get matches for specific sport
            const rawMatches = await allSportsApi.getFixturesBySport(sport, date);

            if (rawMatches) {
                switch (sport.toLowerCase()) {
                    case 'football':
                    case 'soccer':
                        matches = rawMatches.map(mapFootballMatch).filter(m => m !== null);
                        break;
                    case 'basketball':
                        matches = rawMatches.map(mapBasketballMatch).filter(m => m !== null);
                        break;
                    case 'cricket':
                        matches = rawMatches.map(mapCricketMatch).filter(m => m !== null);
                        break;
                }
            }
        } else {
            // Get all sports
            const allScores = await allSportsApi.getAllLiveScores();

            matches = [
                ...(allScores.football?.map(mapFootballMatch) || []),
                ...(allScores.basketball?.map(mapBasketballMatch) || []),
                ...(allScores.cricket?.map(mapCricketMatch) || [])
            ].filter(m => m !== null);
        }

        res.json({
            success: true,
            count: matches.length,
            data: matches
        });
    } catch (error) {
        console.error('Error in getMatches:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching matches',
            error: error.message
        });
    }
};

/**
 * @desc    Get live matches
 * @route   GET /api/matches/live
 * @access  Public
 */
exports.getLiveMatches = async (req, res) => {
    try {
        const { sport } = req.query;

        let liveMatches = [];

        if (sport) {
            // Get live matches for specific sport
            let rawMatches;

            switch (sport.toLowerCase()) {
                case 'football':
                case 'soccer':
                    rawMatches = await allSportsApi.getFootballLiveScores();
                    liveMatches = rawMatches?.map(mapFootballMatch).filter(m => m !== null) || [];
                    break;
                case 'basketball':
                    rawMatches = await allSportsApi.getBasketballLiveScores();
                    liveMatches = rawMatches?.map(mapBasketballMatch).filter(m => m !== null) || [];
                    break;
                case 'cricket':
                    rawMatches = await allSportsApi.getCricketLiveScores();
                    liveMatches = rawMatches?.map(mapCricketMatch).filter(m => m !== null) || [];
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid sport specified'
                    });
            }
        } else {
            // Get all live matches
            const allScores = await allSportsApi.getAllLiveScores();

            liveMatches = [
                ...(allScores.football?.map(mapFootballMatch) || []),
                ...(allScores.basketball?.map(mapBasketballMatch) || []),
                ...(allScores.cricket?.map(mapCricketMatch) || [])
            ].filter(m => m !== null && m.isLive);
        }

        res.json({
            success: true,
            count: liveMatches.length,
            data: liveMatches
        });
    } catch (error) {
        console.error('Error in getLiveMatches:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching live matches',
            error: error.message
        });
    }
};

/**
 * @desc    Get matches by sport
 * @route   GET /api/matches/sport/:sport
 * @access  Public
 */
exports.getMatchesBySport = async (req, res) => {
    try {
        const { sport } = req.params;
        const { date, league, team } = req.query;

        let matches = [];
        let rawMatches;

        switch (sport.toLowerCase()) {
            case 'football':
            case 'soccer':
                rawMatches = await allSportsApi.getFootballFixtures({
                    date,
                    leagueId: league,
                    teamId: team
                });
                matches = rawMatches?.map(mapFootballMatch).filter(m => m !== null) || [];
                break;

            case 'basketball':
                rawMatches = await allSportsApi.getBasketballFixtures({
                    date,
                    leagueId: league,
                    teamId: team
                });
                matches = rawMatches?.map(mapBasketballMatch).filter(m => m !== null) || [];
                break;

            case 'cricket':
                rawMatches = await allSportsApi.getCricketFixtures({
                    date,
                    leagueId: league,
                    teamId: team
                });
                matches = rawMatches?.map(mapCricketMatch).filter(m => m !== null) || [];
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid sport specified'
                });
        }

        res.json({
            success: true,
            sport: sport,
            count: matches.length,
            data: matches
        });
    } catch (error) {
        console.error('Error in getMatchesBySport:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching matches by sport',
            error: error.message
        });
    }
};

/**
 * @desc    Get single match details
 * @route   GET /api/matches/:id
 * @access  Public
 */
exports.getMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const { sport } = req.query;

        if (!sport) {
            return res.status(400).json({
                success: false,
                message: 'Sport parameter is required'
            });
        }

        // For now, we'll get all matches and filter
        // In production, you might want to add a specific endpoint for single match
        let matches;

        switch (sport.toLowerCase()) {
            case 'football':
            case 'soccer':
                matches = await allSportsApi.getFootballLiveScores();
                break;
            case 'basketball':
                matches = await allSportsApi.getBasketballLiveScores();
                break;
            case 'cricket':
                matches = await allSportsApi.getCricketLiveScores();
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid sport specified'
                });
        }

        const match = matches?.find(m => m.event_key === id);

        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }

        let mappedMatch;
        switch (sport.toLowerCase()) {
            case 'football':
            case 'soccer':
                mappedMatch = mapFootballMatch(match);
                break;
            case 'basketball':
                mappedMatch = mapBasketballMatch(match);
                break;
            case 'cricket':
                mappedMatch = mapCricketMatch(match);
                break;
        }

        res.json({
            success: true,
            data: mappedMatch
        });
    } catch (error) {
        console.error('Error in getMatch:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching match details',
            error: error.message
        });
    }
};

/**
 * @desc    Get upcoming matches
 * @route   GET /api/matches/upcoming
 * @access  Public
 */
exports.getUpcomingMatches = async (req, res) => {
    try {
        const { sport, days = 7 } = req.query;

        // Get fixtures for the next N days
        const today = new Date();
        const matches = [];

        for (let i = 0; i < parseInt(days); i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            if (sport) {
                const dayMatches = await allSportsApi.getFixturesBySport(sport, dateStr);
                if (dayMatches) {
                    matches.push(...dayMatches);
                }
            }
        }

        // Map matches based on sport
        let mappedMatches = [];
        if (sport) {
            switch (sport.toLowerCase()) {
                case 'football':
                case 'soccer':
                    mappedMatches = matches.map(mapFootballMatch).filter(m => m !== null);
                    break;
                case 'basketball':
                    mappedMatches = matches.map(mapBasketballMatch).filter(m => m !== null);
                    break;
                case 'cricket':
                    mappedMatches = matches.map(mapCricketMatch).filter(m => m !== null);
                    break;
            }
        }

        // Filter only upcoming matches
        const upcomingMatches = mappedMatches.filter(m => m.status === 'upcoming');

        res.json({
            success: true,
            count: upcomingMatches.length,
            data: upcomingMatches
        });
    } catch (error) {
        console.error('Error in getUpcomingMatches:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching upcoming matches',
            error: error.message
        });
    }
};

/**
 * @desc    Get leagues
 * @route   GET /api/matches/leagues
 * @access  Public
 */
exports.getLeagues = async (req, res) => {
    try {
        const { sport, country } = req.query;

        let leagues = [];

        switch (sport?.toLowerCase()) {
            case 'football':
            case 'soccer':
                const footballLeagues = await allSportsApi.getFootballLeagues(country);
                leagues = footballLeagues?.map(l => mapLeague(l, 'football')) || [];
                break;
            case 'basketball':
                const basketballLeagues = await allSportsApi.getBasketballLeagues(country);
                leagues = basketballLeagues?.map(l => mapLeague(l, 'basketball')) || [];
                break;
            case 'cricket':
                const cricketLeagues = await allSportsApi.getCricketLeagues();
                leagues = cricketLeagues?.map(l => mapLeague(l, 'cricket')) || [];
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Sport parameter is required'
                });
        }

        res.json({
            success: true,
            count: leagues.length,
            data: leagues
        });
    } catch (error) {
        console.error('Error in getLeagues:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching leagues',
            error: error.message
        });
    }
};

/**
 * @desc    Get standings
 * @route   GET /api/matches/standings
 * @access  Public
 */
exports.getStandings = async (req, res) => {
    try {
        const { sport, league } = req.query;

        if (!league) {
            return res.status(400).json({
                success: false,
                message: 'League ID is required'
            });
        }

        let standings = null;

        switch (sport?.toLowerCase()) {
            case 'football':
            case 'soccer':
                const footballStandings = await allSportsApi.getFootballStandings(league);
                standings = mapStandings(footballStandings, 'football');
                break;
            case 'basketball':
                const basketballStandings = await allSportsApi.getBasketballStandings(league);
                standings = mapStandings(basketballStandings, 'basketball');
                break;
            case 'cricket':
                const cricketStandings = await allSportsApi.getCricketStandings(league);
                standings = mapStandings(cricketStandings, 'cricket');
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Sport parameter is required'
                });
        }

        res.json({
            success: true,
            data: standings
        });
    } catch (error) {
        console.error('Error in getStandings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching standings',
            error: error.message
        });
    }
};

/**
 * @desc    Create a match (Admin only - for testing)
 * @route   POST /api/matches
 * @access  Private/Admin
 */
exports.createMatch = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'Match creation not implemented - using live API data'
    });
};

/**
 * @desc    Update a match (Admin only - for testing)
 * @route   PUT /api/matches/:id
 * @access  Private/Admin
 */
exports.updateMatch = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'Match update not implemented - using live API data'
    });
};
