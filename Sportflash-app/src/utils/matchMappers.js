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
        homeTeam: {
            name: match.homeTeam?.name || 'Unknown Team',
            logo: match.homeTeam?.logo,
            score: match.homeTeam?.score
        },
        awayTeam: {
            name: match.awayTeam?.name || 'Unknown Team',
            logo: match.awayTeam?.logo,
            score: match.awayTeam?.score
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
                // Assume it might be an array of objects or strings, but handle gracefully
                return match.basketballData || {};
            }
            if (quarters.length === 0) return match.basketballData || {};
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
