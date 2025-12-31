import { Match } from '@app-types/models/match';

export const mapMatchToUI = (match: any): Match => {
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

    const mapped: Match = {
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
            id: match.homeTeam?.id,
            name: match.homeTeam?.name || 'Unknown Team',
            logo: match.homeTeam?.logo,
            sport: match.sport,
            // Custom UI fields usually not in Team model but handled by JS flexibility
            // casting to any to allow extra props if needed or extending Team
        } as any,
        awayTeam: {
            id: match.awayTeam?.id,
            name: match.awayTeam?.name || 'Unknown Team',
            logo: match.awayTeam?.logo,
            sport: match.sport,
        } as any,
        score: centerInfo,
        timer: timer,
        // Pass through detailed data for specific views
        scorecard: match.scorecard,
        lineups: match.lineups,
        statistics: match.statistics,

        // Synthesize Events for Football
        events: match.sport === 'football' ? [
            ...(match.goalscorers || []).map((g: any) => ({
                type: 'goal',
                time: g.time,
                player: g.home_scorer || g.away_scorer,
                team: g.home_scorer ? 'home' : 'away'
            })),
            ...(match.cards || []).map((c: any) => ({
                type: 'card',
                time: c.time,
                player: c.home_fault || c.away_fault,
                team: c.home_fault ? 'home' : 'away',
                cardType: c.card
            }))
        ].sort((a: any, b: any) => parseInt(a.time) - parseInt(b.time)) : match.events,

        // Parse Basketball Quarters
        basketballData: match.sport === 'basketball' && match.score?.quarters ? (() => {
            // Example format "25-20, 18-22, ..." or array
            let quarters: any[] = [];
            if (typeof match.score.quarters === 'string') {
                quarters = match.score.quarters.split(',').map((s: string) => s.trim().split('-'));
            } else if (Array.isArray(match.score.quarters)) {
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

    return mapped;
};

