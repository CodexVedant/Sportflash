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
 * @desc    Get upcoming matches
 * @route   GET /api/matches/upcoming
 * @access  Public
 */
exports.getUpcomingMatches = async (req, res) => {
    try {
        const { sport, date, days = 7 } = req.query;

        let upcomingMatches = [];

        // Helper to fetch for a Single Date
        const fetchForDate = async (targetDate) => {
            if (sport) {
                // Specific Sport
                const rawMatches = await allSportsApi.getFixturesBySport(sport, targetDate);
                if (rawMatches) {
                    switch (sport.toLowerCase()) {
                        case 'football': case 'soccer': return rawMatches.map(mapFootballMatch).filter(m => m !== null);
                        case 'basketball': return rawMatches.map(mapBasketballMatch).filter(m => m !== null);
                        case 'cricket': return rawMatches.map(mapCricketMatch).filter(m => m !== null);
                    }
                }
            } else {
                // All Sports
                const [football, basketball, cricket] = await Promise.allSettled([
                    allSportsApi.getFootballFixtures({ date: targetDate }),
                    allSportsApi.getBasketballFixtures({ date: targetDate }),
                    allSportsApi.getCricketFixtures({ date: targetDate })
                ]);

                if (football.status === 'rejected') console.error(`❌ Football fetch failed for ${targetDate}:`, football.reason.message);
                if (basketball.status === 'rejected') console.error(`❌ Basketball fetch failed for ${targetDate}:`, basketball.reason.message);
                if (cricket.status === 'rejected') console.error(`❌ Cricket fetch failed for ${targetDate}:`, cricket.reason.message);

                return [
                    ...(football.status === 'fulfilled' && football.value ? football.value.map(mapFootballMatch).filter(m => m !== null) : []),
                    ...(basketball.status === 'fulfilled' && basketball.value ? basketball.value.map(mapBasketballMatch).filter(m => m !== null) : []),
                    ...(cricket.status === 'fulfilled' && cricket.value ? cricket.value.map(mapCricketMatch).filter(m => m !== null) : [])
                ];
            }
            return [];
        };

        if (date) {
            // Case 1: Specific Date (Used by UpcomingMatchesScreen)
            upcomingMatches = await fetchForDate(date);
        } else {
            // Case 2: Date Range (Used by NotificationSettingsScreen)
            const today = new Date();
            console.log(`📅 Fetching upcoming matches for ${days} days starting ${today.toISOString().split('T')[0]}`);

            for (let i = 0; i < parseInt(days); i++) {
                const d = new Date(today);
                d.setDate(d.getDate() + i);
                const dateStr = d.toISOString().split('T')[0];

                const matches = await fetchForDate(dateStr);
                console.log(`   - Date ${dateStr}: Found ${matches.length} matches (before filter)`);
                upcomingMatches.push(...matches);
            }
        }

        // Deduplicate matches (API might return overlapping results for date ranges)
        const uniqueMatches = [];
        const seenIds = new Set();
        for (const m of upcomingMatches) {
            if (!seenIds.has(m.id)) {
                seenIds.add(m.id);
                uniqueMatches.push(m);
            }
        }
        upcomingMatches = uniqueMatches;

        // Sort by date/time
        upcomingMatches.sort((a, b) => {
            const dateA = new Date(a.date || a.startTime || 0);
            const dateB = new Date(b.date || b.startTime || 0);
            return dateA - dateB;
        });

        // Filter only upcoming
        upcomingMatches = upcomingMatches.filter(m => m.status === 'upcoming' || m.status === 'Not Started');
        console.log(`📤 getUpcomingMatches: Returning ${upcomingMatches.length} valid upcoming matches`);

        res.json({
            success: true,
            count: upcomingMatches.length,
            date: date || 'range',
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
/**
 * @desc    Get matches for followed teams
 * @route   POST /api/matches/following
 * @access  Private (but we rely on body param for simplicity in this public API style)
 */
exports.getFollowedMatches = async (req, res) => {
    try {
        const { teams = [], players = [] } = req.body;
        const days = 14; // Fetch next 14 days

        if (teams.length === 0 && players.length === 0) {
            return res.json({ success: true, count: 0, data: [] });
        }

        const today = new Date().toISOString().split('T')[0];
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        const toDate = futureDate.toISOString().split('T')[0];

        // Group by sport to optimize fetching if we were to broadcast, but here 
        // we might just iterate.
        // Given AllSportsAPI structure, we must make 1 API call per team if we want robust filtering,
        // OR filtering from Date Range.
        // Let's try Parallel fetching by Team ID for precision.

        // However, 'players' usually don't have 'matches' endpoint directly easily.
        // We will assume 'players' belong to a 'team' and we might want to fetch that team's matches?
        // Or if the user follows a player, they want to see games where that player plays.
        // For now, let's focus on TEAMS. Players-following usually implies following their team visually.

        // Process Teams AND Players
        console.log(`🔍 getFollowedMatches: Processing ${teams.length} teams and ${players.length} players`);

        // Extract teams from followed players
        const playerTeams = players
            .filter(p => p.teamId) // Use the new reliable teamId field
            .map(p => ({
                id: p.teamId,
                name: p.team || 'Unknown Team',
                sport: p.sport || 'football'
            }));

        // Combine unique teams
        const allTargetTeams = [...teams, ...playerTeams];
        // Remove duplicates by ID
        const uniqueTeams = Array.from(new Map(allTargetTeams.map(item => [String(item.id), item])).values());

        console.log(`   - Total unique teams to fetch: ${uniqueTeams.length}`);

        // OPTIMIZATION: Pre-fetch Live Matches for unique sports to avoid N API calls
        const uniqueSports = [...new Set(uniqueTeams.map(t => t.sport?.toLowerCase()))];
        const liveMatchesBySport = {};

        await Promise.all(uniqueSports.map(async (sport) => {
            if (!sport) return;
            try {
                let liveRaw = [];
                if (['football', 'soccer'].includes(sport)) {
                    liveRaw = await allSportsApi.getFootballLiveScores();
                    liveMatchesBySport[sport] = (liveRaw || []).map(mapFootballMatch);
                } else if (sport === 'basketball') {
                    liveRaw = await allSportsApi.getBasketballLiveScores();
                    liveMatchesBySport[sport] = (liveRaw || []).map(mapBasketballMatch);
                } else if (sport === 'cricket') {
                    liveRaw = await allSportsApi.getCricketLiveScores();
                    liveMatchesBySport[sport] = (liveRaw || []).map(mapCricketMatch);
                }
                console.log(`   - Pre-fetched ${liveMatchesBySport[sport]?.length || 0} LIVE matches for ${sport}`);
            } catch (e) {
                console.error(`   - Failed to fetch live matches for ${sport}:`, e.message);
            }
        }));

        const promises = uniqueTeams.map(async (team) => {
            if (!team.id || !team.sport) return [];

            try {
                const params = { from: today, to: toDate, teamId: team.id };
                console.log(`   - Fetching for team ${team.name} (ID: ${team.id}, Sport: ${team.sport})...`);

                let matches = [];

                switch (team.sport.toLowerCase()) {
                    case 'football': case 'soccer':
                        let fParams = { ...params };
                        // Football sometimes needs league_id if team_id not enough? No, team_id should work.
                        const fRaw = await allSportsApi.getFootballFixtures(fParams);
                        matches = (fRaw || []).map(mapFootballMatch);
                        break;
                    case 'basketball':
                        const bRaw = await allSportsApi.getBasketballFixtures(params);
                        matches = (bRaw || []).map(mapBasketballMatch);
                        break;
                    case 'cricket':
                        const cRaw = await allSportsApi.getCricketFixtures(params);
                        matches = (cRaw || []).map(mapCricketMatch);
                        break;
                }

                // 2. Filter Pre-fetched Live Matches for this team
                const sportLive = liveMatchesBySport[team.sport.toLowerCase()] || [];
                const teamLive = sportLive.filter(m =>
                    m && (String(m.homeTeam?.id) === String(team.id) || String(m.awayTeam?.id) === String(team.id))
                );

                if (teamLive.length > 0) {
                    console.log(`     -> Merging ${teamLive.length} LIVE matches for ${team.name}`);
                    // Merge: Live Matches FIRST
                    // Deduplicate: If an ID exists in both, prefer LIVE version
                    const liveIds = new Set(teamLive.map(m => m.id));
                    matches = matches.filter(m => !liveIds.has(m.id)); // Remove scheduled version
                    matches = [...teamLive, ...matches]; // Prepend Live
                }

                // Explicitly filter matches to ensure they belong to the requested team
                // This guards against API ignoring the teamId parameter
                if (matches.length > 0) {
                    matches = matches.filter(m =>
                        String(m.homeTeam?.id) === String(team.id) ||
                        String(m.awayTeam?.id) === String(team.id)
                    );
                }
                if (matches && matches.length > 0) {
                    console.log(`     -> Found ${matches.length} matches for ${team.name}`);
                    console.log(`     -> First Match: ${matches[0].homeTeam?.name} vs ${matches[0].awayTeam?.name}`);
                } else {
                    console.log(`     -> No matches found for ${team.name}`);
                }
                return matches || [];
            } catch (e) {
                console.error(`Error fetching for team ${team.name}:`, e.message);
                return [];
            }
        });

        const results = await Promise.all(promises);
        // Filter out nulls AND finished matches
        let allMatches = results.flat().filter(m => m && m.status !== 'finished');

        // Sort by date
        allMatches.sort((a, b) => {
            const dateA = new Date(a.date || a.startTime || 0);
            const dateB = new Date(b.date || b.startTime || 0);
            return dateA - dateB;
        });

        // Deduplicate locally just in case
        const uniqueMatches = [];
        const seenIds = new Set();
        for (const m of allMatches) {
            if (!seenIds.has(m.id)) {
                seenIds.add(m.id);
                uniqueMatches.push(m);
            }
        }

        res.json({
            success: true,
            count: uniqueMatches.length,
            data: uniqueMatches
        });
    } catch (error) {
        console.error('Error in getFollowedMatches:', error);
        res.status(500).json({ success: false, message: error.message });
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

        let match = matches?.find(m => m.event_key === id);

        // FALLBACK: If not in Live, check Fixtures (Unified Search)
        // If still not found, try OTHER sports (in case sport param was wrong/defaulted)
        if (!match) {
            console.log(`⚠️ Match ${id} not found in ${sport}, starting deep search...`);

            const sportsToTry = [sport.toLowerCase(), 'football', 'basketball', 'cricket'];
            // Deduplicate
            const uniqueSports = [...new Set(sportsToTry)];

            for (const currentSport of uniqueSports) {
                console.log(`   - Checking ${currentSport}...`);
                try {
                    // 1. Try Fixtures (matchId)
                    let fixtures = await allSportsApi.makeRequest(currentSport, 'Fixtures', { matchId: id });
                    if (!fixtures || fixtures.length === 0) {
                        fixtures = await allSportsApi.makeRequest(currentSport, 'Fixtures', { match_id: id });
                    }

                    // 2. Try Livescore specific
                    if ((!fixtures || fixtures.length === 0)) {
                        const liveSpecific = await allSportsApi.makeRequest(currentSport, 'Livescore', { matchId: id });
                        if (liveSpecific && liveSpecific.length > 0) fixtures = liveSpecific;
                    }

                    if (fixtures && fixtures.length > 0) {
                        const found = fixtures.find(m => m.event_key === id);
                        if (found) {
                            match = found;
                            // Update sport to the correct one
                            if (currentSport !== sport.toLowerCase()) {
                                console.log(`   ✅ Found match ${id} in ${currentSport} (requested: ${sport})`);
                                // We need to update the mapper logic below to use the correct sport
                                req.query.sport = currentSport; // Hacky but effective for the switch below
                            }
                            break; // Stop searching
                        }
                    }
                } catch (err) {
                    console.log(`   - Failed checking ${currentSport}: ${err.message}`);
                }
            }
        }

        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found in any sport'
            });
        }

        let mappedMatch;
        // Use the sport we found it in (req.query.sport might have been updated above)
        const finalSport = req.query.sport || sport;

        switch (finalSport.toLowerCase()) {
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
        let rawStandings = null;

        switch (sport?.toLowerCase()) {
            case 'football':
            case 'soccer':
                rawStandings = await allSportsApi.getFootballStandings(league);
                standings = mapStandings(rawStandings, 'football');
                break;
            case 'basketball':
                rawStandings = await allSportsApi.getBasketballStandings(league);
                standings = mapStandings(rawStandings, 'basketball');
                break;
            case 'cricket':
                rawStandings = await allSportsApi.getCricketStandings(league);
                standings = mapStandings(rawStandings, 'cricket');
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Sport parameter is required'
                });
        }

        if (!standings || standings.length === 0) {
            // Quietly handle empty standings without logging to console/terminal
        }

        res.json({
            success: true,
            data: standings || []
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
 * @desc    Get head to head statistics
 * @route   GET /api/matches/h2h
 * @access  Public
 */
exports.getHeadToHead = async (req, res) => {
    try {
        const { sport, team1Id, team2Id } = req.query;

        if (!sport || !team1Id || !team2Id) {
            return res.status(400).json({
                success: false,
                message: 'Sport and both team IDs are required'
            });
        }

        let h2hData = null;

        switch (sport.toLowerCase()) {
            case 'football':
            case 'soccer':
                h2hData = await allSportsApi.getFootballH2H(team1Id, team2Id);
                break;
            case 'basketball':
                h2hData = await allSportsApi.getBasketballH2H(team1Id, team2Id);
                break;
            case 'cricket':
                h2hData = await allSportsApi.getCricketH2H(team1Id, team2Id);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid sport specified'
                });
        }

        // Map H2H data if needed (currently passing raw as structure usually generic)
        // You might want to map this similarly to getMatches for consistency

        res.json({
            success: true,
            data: h2hData
        });
    } catch (error) {
        console.error('Error in getHeadToHead:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching H2H data',
            error: error.message
        });
    }
};

/**
 * @desc    Get match commentary (Cricket only)
 * @route   GET /api/matches/:id/commentary
 * @access  Public
 */
exports.getMatchCommentary = async (req, res) => {
    try {
        const { id } = req.params;
        const { sport } = req.query;

        if (!sport) {
            return res.status(400).json({
                success: false,
                message: 'Sport parameter is required'
            });
        }

        if (sport.toLowerCase() !== 'cricket') {
            return res.status(400).json({
                success: false,
                message: 'Commentary is only available for cricket matches'
            });
        }

        // Fetch match details with commentary
        const matchData = await allSportsApi.getCricketCommentary(id);

        if (!matchData || matchData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Match commentary not found'
            });
        }

        // Find the specific match
        const match = Array.isArray(matchData)
            ? matchData.find(m => m.event_key === id)
            : matchData;

        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }

        // Extract commentary from the match data
        const commentary = match.comments || null;

        res.json({
            success: true,
            data: {
                matchId: id,
                commentary: commentary,
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error in getMatchCommentary:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching match commentary',
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
