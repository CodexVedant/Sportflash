const formatCricketScore = (teamScore, scorecard, teamType) => {
    // If we have no scorecard, return original score
    if (!scorecard || !teamScore) return teamScore;

    try {
        // Prepare simplified score for matching (remove overs)
        const cleanScore = (s) => (s || '').split('(')[0].trim();
        const currentScore = cleanScore(teamScore);

        // Find which inning matches the current score
        // Keys are usually "1", "2", "3", "4"
        const inningKeys = Object.keys(scorecard).sort();

        let matchedKey = null;
        for (const key of inningKeys) {
            const inning = scorecard[key];
            if (!inning?.score) continue;

            if (cleanScore(inning.score) === currentScore) {
                matchedKey = key;
                break;
            }
        }

        if (matchedKey) {
            // Heuristic: Innings 1 & 3 are one team, 2 & 4 are the other.
            // If matchedKey is 1 or 3 -> This team owns 1 & 3.
            // If matchedKey is 2 or 4 -> This team owns 2 & 4.
            const isOdd = parseInt(matchedKey) % 2 !== 0;
            const targetKeys = isOdd ? ['1', '3'] : ['2', '4'];

            // Build combined string
            const scores = [];
            targetKeys.forEach(k => {
                if (scorecard[k] && scorecard[k].score) {
                    scores.push(scorecard[k].score);
                }
            });

            if (scores.length > 0) {
                return scores.join(' & ');
            }
        }
    } catch (e) {
        // Fallback silently
    }
    return teamScore;
};

export const mapMatchToUI = (match) => {
    let timer = match.currentMinute;
    let centerInfo = null;

    if (match.sport === 'cricket') {
        timer = match.cricketData?.overs ? `${match.cricketData.overs} Overs` : '';
    } else if (match.sport === 'basketball') {
        timer = match.basketballData?.quarter ? `Q${match.basketballData.quarter}` : '';
        centerInfo = 'Live';
    } else if (match.sport === 'football') {
        if (match.homeTeam.score && match.awayTeam.score) {
            centerInfo = `${match.homeTeam.score} - ${match.awayTeam.score}`;
        }
    }

    // Generate a fallback ID if missing to prevent key clashes
    const safeId = match.id || match._id || `temp-${Math.random().toString(36).substr(2, 9)}`;

    return {
        id: safeId,
        sport: match.sport,
        status: match.status,
        displayStatus: match.displayStatus,
        league: match.league,
        date: match.date || match.dateStart, // Pass date
        time: match.time, // Pass time

        // Detailed Info Objects
        leagueInfo: match.leagueInfo,
        venue: match.venue,

        // Sport Specific Details
        matchType: match.matchType,
        toss: match.toss,
        manOfMatch: match.manOfMatch,

        homeTeam: {
            name: match.homeTeam?.name || 'Unknown Team',
            logo: match.homeTeam?.logo,
            score: match.sport === 'cricket'
                ? formatCricketScore(match.homeTeam?.score, match.scorecard, 'home')
                : match.homeTeam?.score,
            formation: match.homeTeam?.formation, // Pass formation
            id: match.homeTeam?.id
        },
        awayTeam: {
            name: match.awayTeam?.name || 'Unknown Team',
            logo: match.awayTeam?.logo,
            score: match.sport === 'cricket'
                ? formatCricketScore(match.awayTeam?.score, match.scorecard, 'away')
                : match.awayTeam?.score,
            formation: match.awayTeam?.formation, // Pass formation
            id: match.awayTeam?.id
        },
        score: centerInfo,
        timer: timer,
        // Pass through detailed data for specific views
        scorecard: match.scorecard,
        lineups: match.lineups,
        statistics: match.statistics,

        // Synthesize Events for Football
        events: match.sport === 'football' ? [
            ...(match.goalscorers || []).map(g => ({
                type: 'goal',
                time: g.time,
                player: g.home_scorer || g.away_scorer,
                team: g.home_scorer ? 'home' : 'away'
            })),
            ...(match.cards || []).map(c => ({
                type: 'card',
                time: c.time,
                player: c.home_fault || c.away_fault,
                team: c.home_fault ? 'home' : 'away',
                cardType: c.card
            }))
        ].sort((a, b) => parseInt(a.time) - parseInt(b.time)) : match.events,

        // Parse Basketball Quarters
        basketballData: match.sport === 'basketball' && match.score?.quarters ? (() => {
            // Example format "25-20, 18-22, ..." or array
            let quarters = [];
            if (typeof match.score.quarters === 'string') {
                quarters = match.score.quarters.split(',').map(s => s.trim().split('-'));
            } else if (Array.isArray(match.score.quarters)) {
                // If it's the object format from backend { '1': [{...}], ... }
                // We typically handle this in the component, but here we can pass it through
                return match.score.quarters;
            }
            if (quarters.length === 0) return match.basketballData || {};

            // Format for frontend consumption if string
            return {
                ...match.basketballData,
                home_q1: quarters[0]?.[0], away_q1: quarters[0]?.[1],
                home_q2: quarters[1]?.[0], away_q2: quarters[1]?.[1],
                home_q3: quarters[2]?.[0], away_q3: quarters[2]?.[1],
                home_q4: quarters[3]?.[0], away_q4: quarters[3]?.[1],
            };
        })() : match.basketballData,

        cricketData: match.cricketData
    };
};
