/**
 * Data Mappers for AllSportsAPI
 * Transforms API responses to unified format for frontend
 */

/**
 * Map Football match data to unified format
 */
const mapFootballMatch = (match) => {
    if (!match) return null;

    return {
        _id: match.event_key,
        id: match.event_key,
        sport: 'football',
        status: mapMatchStatus(match.event_status, match.event_live),
        displayStatus: match.event_status,
        date: match.event_date,
        time: match.event_time,
        league: match.league_name,
        leagueInfo: {
            id: match.league_key,
            name: match.league_name,
            logo: match.league_logo,
            country: match.country_name,
            countryLogo: match.country_logo,
            round: match.league_round,
            season: match.league_season
        },
        homeTeam: {
            id: match.home_team_key,
            name: match.event_home_team,
            logo: match.home_team_logo || null,
            score: extractFootballScore(match.event_final_result, 'home'),
            formation: match.event_home_formation
        },
        awayTeam: {
            id: match.away_team_key,
            name: match.event_away_team,
            logo: match.away_team_logo || null,
            score: extractFootballScore(match.event_final_result, 'away'),
            formation: match.event_away_formation
        },
        venue: {
            name: match.event_stadium,
            referee: match.event_referee
        },
        score: {
            halftime: match.event_halftime_result,
            fulltime: match.event_final_result || match.event_ft_result,
            penalty: match.event_penalty_result
        },
        currentMinute: match.event_status === 'Finished' ? 'FT' : match.event_status,
        isLive: match.event_live === '1',
        goalscorers: match.goalscorers || [],
        cards: match.cards || [],
        substitutes: match.substitutes || [],
        lineups: normalizeLineups(match.lineups),
        statistics: match.statistics || []
    };
};

/**
 * Normalize Lineups
 */
const normalizeLineups = (lineups) => {
    if (!lineups) return null;

    // API can return 'home' or 'home_team'
    const home = lineups.home || lineups.home_team;
    const away = lineups.away || lineups.away_team;

    // Helper to map and filter invalid entries (API often returns nulls for football)
    const process = (list) => {
        if (!list || !Array.isArray(list)) return [];
        return list.map(mapLineupPlayer).filter(p => p.name);
    };

    return {
        home: {
            startXI: process(home?.starting_lineups),
            substitutes: process(home?.substitutes)
        },
        away: {
            startXI: process(away?.starting_lineups),
            substitutes: process(away?.substitutes)
        }
    };
};

const mapLineupPlayer = (p) => {
    return {
        name: p.player || p.lineup_player || p.player_name || p.name,
        number: p.number || p.lineup_number || p.player_number || '',
        position: p.position || p.lineup_position || p.player_position || ''
    };
};

/**
 * Map Basketball match data to unified format
 */
const mapBasketballMatch = (match) => {
    if (!match) return null;

    // Format Quarters
    const quartersData = formatBasketballQuarters(match.scores);

    return {
        _id: match.event_key, // Backward compatibility
        id: match.event_key,
        sport: 'basketball',
        status: mapMatchStatus(match.event_status, match.event_live),
        displayStatus: match.event_status,
        date: match.event_date,
        time: match.event_time,
        league: match.league_name,
        leagueInfo: {
            id: match.league_key,
            name: match.league_name,
            country: match.country_name,
            round: match.league_round,
            season: match.league_season
        },
        homeTeam: {
            id: match.home_team_key,
            name: match.event_home_team,
            logo: match.event_home_team_logo || null,
            score: extractBasketballScore(match.event_final_result, 'home')
        },
        awayTeam: {
            id: match.away_team_key,
            name: match.event_away_team,
            logo: match.event_away_team_logo || null,
            score: extractBasketballScore(match.event_final_result, 'away')
        },
        score: {
            final: match.event_final_result,
            quarters: quartersData.list
        },
        currentQuarter: match.event_quarter || null,
        // Backward compatibility for frontend
        basketballData: {
            quarter: match.event_quarter,
            ...quartersData.stats
        },
        isLive: match.event_live === '1',
        lineups: normalizeLineups(match.lineups),
        statistics: match.statistics || [],
        playerStatistics: match.player_statistics || null
    };
};

/**
 * Helper to process basketball quarter scores
 */
const formatBasketballQuarters = (scores) => {
    const defaultStats = {};
    const list = [];

    if (!scores) return { stats: defaultStats, list };
    const keys = Object.keys(scores);

    keys.forEach(key => {
        let qData = scores[key];
        if (Array.isArray(qData)) qData = qData[0];

        if (qData) {
            const h = qData.score_home;
            const a = qData.score_away;

            // Normalize key (1st Quarter -> "q1", 1 -> "q1")
            const qNum = key.replace(/\D/g, '');
            if (qNum) {
                defaultStats[`home_q${qNum}`] = h;
                defaultStats[`away_q${qNum}`] = a;
                list.push(`${h}-${a}`);
            }
        }
    });

    return { stats: defaultStats, list };
};

/**
 * Map Cricket match data to unified format
 */
const mapCricketMatch = (match) => {
    if (!match) return null;

    return {
        _id: match.event_key,
        id: match.event_key,
        sport: 'cricket',
        status: mapMatchStatus(match.event_status, match.event_live),
        displayStatus: match.event_status,
        statusInfo: match.event_status_info,
        dateStart: match.event_date_start,
        dateStop: match.event_date_stop,
        time: match.event_time,
        league: match.league_name,
        leagueInfo: {
            id: match.league_key,
            name: match.league_name,
            country: match.country_name,
            round: match.league_round,
            season: match.league_season
        },
        homeTeam: {
            id: match.home_team_key,
            name: match.event_home_team,
            logo: match.event_home_team_logo || null,
            score: match.event_home_final_result,
            runRate: match.event_home_rr
        },
        awayTeam: {
            id: match.away_team_key,
            name: match.event_away_team,
            logo: match.event_away_team_logo || null,
            score: match.event_away_final_result,
            runRate: match.event_away_rr
        },
        venue: {
            name: match.event_stadium
        },
        matchType: match.event_type, // TEST, ODI, T20, etc.
        toss: match.event_toss,
        manOfMatch: match.event_man_of_match,
        isLive: match.event_live === '1',
        scorecard: normalizeCricketScorecard(match.scorecard),
        comments: match.comments || null,
        wickets: match.wickets || null,
        extra: match.extra || null,
        lineups: normalizeLineups(match.lineups),
        // Backward compatibility
        cricketData: {
            overs: extractCricketOvers(match)
        },
        // Fallback for UI components looking for currentMinute
        currentMinute: match.event_status
    };
};

/**
 * Helper to extract current overs for cricket
 */
const extractCricketOvers = (match) => {
    // logic: looks for pattern (XX.X ov) or just (XX.X) at the end
    const scores = [match.event_home_final_result, match.event_away_final_result].filter(s => s);

    for (const score of scores) {
        const matchOv = score.match(/\((\d+(\.\d+)?)\s*(ov)?\)/i);
        if (matchOv) {
            return matchOv[1];
        }
    }

    if (match.comments?.Live?.length > 0) {
        let maxOver = 0;
        let found = false;

        match.comments.Live.forEach(comment => {
            const ov = parseFloat(comment?.overs);
            if (!isNaN(ov)) {
                if (ov > maxOver) maxOver = ov;
                found = true;
            }
        });

        if (found) return maxOver.toString();
    }

    return null;
};

/**
 * Normalize Cricket Scorecard
 * Maps API specific fields to clean UI fields
 */
const normalizeCricketScorecard = (scorecard) => {
    if (!scorecard) return null;

    const normalized = {};

    Object.keys(scorecard).forEach(key => {
        const inning = scorecard[key];

        let batting = [];
        let bowling = [];

        // Handle Array structure (mixed Batsman/Bowler)
        if (Array.isArray(inning)) {
            batting = inning
                .filter(p => p.type === 'Batsman')
                .map(b => ({
                    player: b.player,
                    status: b.status || 'not out',
                    runs: b.R || '0',
                    balls: b.B || '0',
                    fours: b['4s'] || '0',
                    sixes: b['6s'] || '0',
                    sr: b.SR || '0.00'
                }));

            bowling = inning
                .filter(p => p.type === 'Bowler')
                .map(b => ({
                    player: b.player,
                    overs: b.O || '0',
                    maidens: b.M || '0',
                    runs: b.R || '0',
                    wickets: b.W || '0',
                    economy: b.ER || b.Econ || '0.00'
                }));
        } else {
            // Handle Object structure (legacy/fallback)
            batting = (inning.batsman || inning.batsmen || inning.batting || []).map(b => ({
                player: b.name || b.player,
                status: b.out_by || b.dismissal || b.status || 'not out',
                runs: b.runs || b.R || '0',
                balls: b.balls || b.B || '0',
                fours: b['4s'] || b.fours || '0',
                sixes: b['6s'] || b.sixes || '0',
                sr: b.SR || b.sr || '0.00'
            }));

            bowling = (inning.bowler || inning.bowlers || inning.bowling || []).map(b => ({
                player: b.name || b.player,
                overs: b.O || b.overs || '0',
                maidens: b.M || b.maidens || '0',
                runs: b.R || b.runs || '0',
                wickets: b.W || b.wickets || '0',
                economy: b.Econ || b.economy || '0.00'
            }));
        }

        normalized[key] = {
            title: inning.title || `Inning ${key}`,
            score: inning.total || inning.score || '',
            batting,
            bowling
        };
    });

    return normalized;
};

/**
 * Map Football status to standardized format
 */
const mapFootballStatus = (status, isLive) => {
    if (isLive === '1') return 'live';
    if (status === 'Finished' || status === 'FT') return 'finished';
    if (status === 'Not Started' || status === 'NS') return 'upcoming';
    if (status === 'Postponed') return 'postponed';
    if (status === 'Cancelled') return 'cancelled';

    // If it's a number, it's the current minute
    if (!isNaN(status)) return 'live';

    return 'upcoming';
};

/**
 * Extract score from football result string
 */
const extractFootballScore = (result, team) => {
    if (!result) return null;

    const scores = result.split('-').map(s => s.trim());
    if (scores.length !== 2) return null;

    return team === 'home' ? scores[0] : scores[1];
};

/**
 * Extract score from basketball result string
 */
const extractBasketballScore = (result, team) => {
    if (!result) return null;

    const scores = result.split('-').map(s => s.trim());
    if (scores.length !== 2) return null;

    return team === 'home' ? scores[0] : scores[1];
};

/**
 * Generic status mapper for all sports
 */
const mapMatchStatus = (status, isLive) => {
    if (['Finished', 'Ended', 'FT', 'AOT', 'After Over Time'].includes(status)) return 'finished';
    if (['Postponed', 'Cancelled', 'Abd'].includes(status)) return status.toLowerCase();

    if (['Not Started', 'NS'].includes(status)) return 'upcoming';

    if (isLive === '1') return 'live';

    const liveStatuses = [
        // Basketball
        '1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter',
        'Halftime', 'Overtime', 'In Progress', 'Brake',
        // Cricket
        'Innings Break', 'Tea Break', 'Lunch', 'Stumps',
        'Rain Delay', 'Bad Light', 'Wet Outfield', 'Delay', 'Interrupted',
        // Football
        'HT', 'ET', 'Pen', 'Break',
        // General
        'Live', 'Pause'
    ];

    if (liveStatuses.includes(status) || /Quarter|Inning/.test(status)) return 'live';

    if (!isNaN(status) && String(status).trim() !== '') return 'live';

    return 'upcoming';
};

/**
 * Map league/competition data
 */
const mapLeague = (league, sport) => {
    return {
        id: league.league_key,
        name: league.league_name,
        sport: sport,
        country: {
            id: league.country_key,
            name: league.country_name,
            logo: league.country_logo || null,
            iso2: league.country_iso2 || null
        },
        logo: league.league_logo || null,
        season: league.league_season || league.league_year || null
    };
};

/**
 * Map team data
 */
const mapTeam = (team, sport) => {
    return {
        id: team.team_key,
        name: team.team_name,
        sport: sport,
        logo: team.team_logo || null,
        country: team.team_country || null,
        founded: team.team_founded || null,
        venue: team.venue_name ? {
            name: team.venue_name,
            address: team.venue_address,
            city: team.venue_city,
            capacity: team.venue_capacity
        } : null,
        players: team.players || []
    };
};

/**
 * Map standings data
 */
const mapStandings = (standings, sport) => {
    if (!standings || !standings.total) return null;

    return standings.total.map(standing => ({
        position: parseInt(standing.standing_place),
        team: {
            id: standing.team_key,
            name: standing.standing_team,
            logo: standing.team_logo || null
        },
        stats: {
            played: parseInt(standing.standing_P) || 0,
            won: parseInt(standing.standing_W) || 0,
            drawn: parseInt(standing.standing_D) || 0,
            lost: parseInt(standing.standing_L) || 0,
            goalsFor: parseInt(standing.standing_F) || 0,
            goalsAgainst: parseInt(standing.standing_A) || 0,
            goalDifference: parseInt(standing.standing_GD) || 0,
            points: parseInt(standing.standing_PTS) || 0,
            percentage: standing.standing_PCT || null
        },
        form: standing.standing_form || null,
        description: standing.standing_place_type || null,
        round: standing.league_round || null,
        updated: standing.standing_updated
    }));
};

/**
 * Map player data
 */
const mapPlayer = (player, sport) => {
    return {
        id: player.player_key || player.player_id,
        name: player.player_name || player.player,
        sport: sport,
        number: player.player_number || null,
        position: player.player_type || player.player_position || null,
        age: player.player_age || null,
        nationality: player.player_country || null,
        photo: player.player_image || null,
        team: player.team_name ? {
            id: player.team_key,
            name: player.team_name,
            logo: player.team_logo
        } : null,
        statistics: {
            goals: player.player_goals || 0,
            assists: player.player_assists || 0,
            yellowCards: player.player_yellow_cards || 0,
            redCards: player.player_red_cards || 0,
            // Basketball specific
            points: player.player_points || null,
            rebounds: player.player_total_rebounds || null,
            blocks: player.player_blocks || null,
            steals: player.player_steals || null,
            // Cricket specific
            runs: player.R || null,
            wickets: player.W || null,
            strikeRate: player.SR || null
        }
    };
};

module.exports = {
    mapFootballMatch,
    mapBasketballMatch,
    mapCricketMatch,
    mapLeague,
    mapTeam,
    mapStandings,
    mapPlayer
};
