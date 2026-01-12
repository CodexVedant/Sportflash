/**
 * Cricbuzz Data Mappers
 * Transforms Cricbuzz API responses to unified Sportflash format
 */

/**
 * Map Cricbuzz match to unified format
 */
const mapCricbuzzMatch = (match) => {
    if (!match || !match.matchInfo) return null;

    const { matchInfo, matchScore } = match;

    return {
        _id: matchInfo.matchId,
        id: matchInfo.matchId,
        sport: 'cricket',
        status: mapCricbuzzStatus(matchInfo.state),
        displayStatus: matchInfo.stateTitle || matchInfo.status,
        statusInfo: matchInfo.stateTitle,
        dateStart: matchInfo.startDate ? new Date(parseInt(matchInfo.startDate)).toISOString().split('T')[0] : null,
        time: matchInfo.matchStartTimestamp ? new Date(parseInt(matchInfo.matchStartTimestamp)).toISOString() : null,
        league: matchInfo.seriesName,
        leagueInfo: {
            id: matchInfo.seriesId,
            name: matchInfo.seriesName,
            round: matchInfo.matchDesc,
            season: matchInfo.season
        },
        homeTeam: {
            id: matchInfo.team1?.teamId,
            name: matchInfo.team1?.teamName,
            logo: matchInfo.team1?.imageId ?
                `https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/${matchInfo.team1.imageId}.jpg` : null,
            score: formatCricbuzzScore(matchScore?.team1Score),
            shortName: matchInfo.team1?.teamSName
        },
        awayTeam: {
            id: matchInfo.team2?.teamId,
            name: matchInfo.team2?.teamName,
            logo: matchInfo.team2?.imageId ?
                `https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/${matchInfo.team2.imageId}.jpg` : null,
            score: formatCricbuzzScore(matchScore?.team2Score),
            shortName: matchInfo.team2?.teamSName
        },
        venue: {
            name: matchInfo.venueInfo?.ground,
            city: matchInfo.venueInfo?.city
        },
        matchType: matchInfo.matchFormat, // TEST, ODI, T20, etc.
        currentBattingTeam: matchInfo.currBatTeamId,
        isLive: matchInfo.state === 'In Progress' || matchInfo.state === 'Live',
        // Cricbuzz specific data
        cricbuzzData: {
            seriesId: matchInfo.seriesId,
            matchDesc: matchInfo.matchDesc,
            matchFormat: matchInfo.matchFormat,
            team1Innings: matchScore?.team1Score,
            team2Innings: matchScore?.team2Score,
            currentSession: matchInfo.stateTitle
        }
    };
};

/**
 * Format Cricbuzz score (innings breakdown)
 */
const formatCricbuzzScore = (teamScore) => {
    if (!teamScore) return null;

    const innings = [];

    // First innings
    if (teamScore.inngs1) {
        const { runs, wickets, overs } = teamScore.inngs1;
        innings.push(`${runs}/${wickets} (${overs} ov)`);
    }

    // Second innings
    if (teamScore.inngs2) {
        const { runs, wickets, overs } = teamScore.inngs2;
        innings.push(`${runs}/${wickets} (${overs} ov)`);
    }

    return innings.length > 0 ? innings.join(' & ') : null;
};

/**
 * Map Cricbuzz status to unified format
 */
const mapCricbuzzStatus = (state) => {
    if (!state) return 'upcoming';

    const lowerState = state.toLowerCase();

    if (lowerState.includes('in progress') || lowerState === 'live') {
        return 'live';
    }
    if (lowerState.includes('complete') || lowerState.includes('finished')) {
        return 'finished';
    }
    if (lowerState.includes('preview') || lowerState.includes('upcoming')) {
        return 'upcoming';
    }
    if (lowerState.includes('abandon') || lowerState.includes('cancel')) {
        return 'postponed';
    }

    return 'upcoming';
};

/**
 * Map Cricbuzz team to unified format
 */
const mapCricbuzzTeam = (team) => {
    if (!team) return null;

    return {
        id: team.teamId,
        name: team.teamName,
        sport: 'cricket',
        logo: team.imageId ?
            `https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/${team.imageId}.jpg` : null,
        shortName: team.teamSName,
        country: team.teamName, // Cricbuzz doesn't have separate country field
        // Additional Cricbuzz data
        players: team.players || []
    };
};

/**
 * Map Cricbuzz player to unified format
 */
const mapCricbuzzPlayer = (player) => {
    if (!player) return null;

    return {
        id: player.id || player.playerId,
        name: player.name || player.playerName,
        sport: 'cricket',
        role: player.role || player.playerRole,
        battingStyle: player.bat || player.battingStyle,
        bowlingStyle: player.bowl || player.bowlingStyle,
        nationality: player.intlTeam || player.country,
        age: player.age,
        photo: player.imageId ?
            `https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/${player.imageId}.jpg` : null,
        // Career statistics
        statistics: {
            test: player.stats?.test || null,
            odi: player.stats?.odi || null,
            t20i: player.stats?.t20i || null,
            t20: player.stats?.t20 || null
        }
    };
};

/**
 * Map Cricbuzz commentary to unified format
 */
const mapCricbuzzCommentary = (commentary) => {
    if (!commentary || !commentary.commentaryList) return [];

    return commentary.commentaryList.map(comm => ({
        text: comm.commText,
        timestamp: comm.timestamp,
        over: comm.overNumber,
        ball: comm.ballNbr,
        batsman: comm.batStrikerName,
        batsmanRuns: comm.batStrikerRuns,
        batsmanBalls: comm.batStrikerBalls,
        bowler: comm.bowlName,
        bowlerOvers: comm.bowlOvs,
        bowlerRuns: comm.bowlRuns,
        bowlerWickets: comm.bowlWkts,
        event: comm.event, // SIX, FOUR, WICKET, etc.
        isWicket: comm.event === 'WICKET',
        isBoundary: comm.event === 'FOUR' || comm.event === 'SIX'
    }));
};

/**
 * Map Cricbuzz scorecard to unified format
 */
const mapCricbuzzScorecard = (scorecard) => {
    if (!scorecard) return null;

    const innings = {};

    // Process each innings
    if (scorecard.scoreDetails) {
        scorecard.scoreDetails.forEach((inning, index) => {
            innings[`innings${index + 1}`] = {
                battingTeam: inning.batTeamName,
                score: `${inning.runs}/${inning.wickets} (${inning.overs} ov)`,
                batting: mapBattingScorecard(inning.batsmen),
                bowling: mapBowlingScorecard(inning.bowlers),
                extras: inning.extras,
                total: inning.runs
            };
        });
    }

    return innings;
};

/**
 * Map batting scorecard
 */
const mapBattingScorecard = (batsmen) => {
    if (!batsmen || !Array.isArray(batsmen)) return [];

    return batsmen.map(bat => ({
        player: bat.batName,
        dismissal: bat.outDesc || 'not out',
        runs: bat.runs,
        balls: bat.balls,
        fours: bat.fours,
        sixes: bat.sixes,
        strikeRate: bat.strikeRate
    }));
};

/**
 * Map bowling scorecard
 */
const mapBowlingScorecard = (bowlers) => {
    if (!bowlers || !Array.isArray(bowlers)) return [];

    return bowlers.map(bowl => ({
        player: bowl.bowlName,
        overs: bowl.overs,
        maidens: bowl.maidens,
        runs: bowl.runs,
        wickets: bowl.wickets,
        economy: bowl.economy,
        wides: bowl.wides,
        noBalls: bowl.noBalls
    }));
};

/**
 * Map Cricbuzz rankings to unified format
 */
const mapCricbuzzRankings = (rankings) => {
    if (!rankings || !rankings.rank) return [];

    return rankings.rank.map(rank => ({
        position: rank.rank,
        player: rank.name,
        team: rank.country,
        rating: rank.rating,
        points: rank.points
    }));
};

/**
 * Extract matches from Cricbuzz response
 */
const extractCricbuzzMatches = (response) => {
    if (!response || !response.typeMatches) return [];

    const matches = [];

    response.typeMatches.forEach(typeMatch => {
        if (typeMatch.seriesMatches) {
            typeMatch.seriesMatches.forEach(seriesMatch => {
                if (seriesMatch.seriesAdWrapper && seriesMatch.seriesAdWrapper.matches) {
                    seriesMatch.seriesAdWrapper.matches.forEach(match => {
                        const mappedMatch = mapCricbuzzMatch(match);
                        if (mappedMatch) {
                            matches.push(mappedMatch);
                        }
                    });
                }
            });
        }
    });

    return matches;
};

module.exports = {
    mapCricbuzzMatch,
    formatCricbuzzScore,
    mapCricbuzzStatus,
    mapCricbuzzTeam,
    mapCricbuzzPlayer,
    mapCricbuzzCommentary,
    mapCricbuzzScorecard,
    mapBattingScorecard,
    mapBowlingScorecard,
    mapCricbuzzRankings,
    extractCricbuzzMatches
};
