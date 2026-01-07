import socket from '@services/socket';
import { upsertMatches } from '../slices/liveMatchesSlice';
import { setStickyNotification } from '../slices/notificationsSlice';
import { scheduleLocalNotification } from '@services/NotificationService';


let isListening = false;

export const initSocketListeners = () => (dispatch, getState) => {
    if (isListening) return;

    // console.log('🔌 Initializing Redux Socket Listeners...');
    isListening = true;

    // Helper to check for notifications
    const checkNotificationTriggers = (newMatch) => {
        const state = getState();
        const prefs = state.notifications.preferences || {};
        const globalSettings = state.notifications.globalSettings || {
            cricket: { wickets: true, boundaries: true, milestones: true, toss: true, status: true },
            football: { goals: true, cards: true, status: true },
            basketball: { status: true, closeGame: true }
        };
        const oldMatch = state.liveMatches.entities[newMatch.id];

        // 1. Check Subscription
        const isSubscribed =
            prefs[`match_${newMatch.id}`] ||
            prefs[`series_${newMatch.league}`] ||
            prefs[`team_${newMatch.homeTeam?.name}`] ||
            prefs[`team_${newMatch.awayTeam?.name}`];

        if (!isSubscribed) return;


        // Helper to format score safely
        const getScoreString = (match) => {
            // Football Logic
            if (match.sport === 'football') {
                return `${match.homeTeam?.score || 0} - ${match.awayTeam?.score || 0}`;
            }
            // Cricket Logic
            if (match.sport === 'cricket') {
                const home = match.homeTeam?.score || '';
                const away = match.awayTeam?.score || '';
                if (!home && !away) return '';
                return `${match.homeTeam?.name} ${home} vs ${match.awayTeam?.name} ${away}`.trim();
            }
            // Basketball Logic
            if (match.sport === 'basketball') {
                return `${match.homeTeam?.score || 0} - ${match.awayTeam?.score || 0}`;
            }

            // Fallback
            if (match.score && typeof match.score === 'string') return match.score;
            if (match.score && match.score.display) return match.score.display;

            return match.status || '';
        };

        const newScoreStr = getScoreString(newMatch);
        const oldScoreStr = oldMatch ? getScoreString(oldMatch) : '';

        // 2. Check for Significant Changes (Simple version: Score change or Status change)
        // In a real app, backend ideally sends an "event" type (wicket, goal, etc.)
        // Here we infer from data changes.

        let shouldNotify = false;
        let title = '';
        let message = '';
        const matchGlobals = globalSettings[newMatch.sport] || {};

        // Case A: Status Change (Includes Basketball Quarter Updates)
        if (oldMatch && oldMatch.status !== newMatch.status) {
            if (matchGlobals.status !== false) {
                shouldNotify = true;
                title = 'Match Status Update';
                // Include Score in Status Update (Useful for "End of Q1", "FT", etc.)
                message = `${newMatch.homeTeam?.name} vs ${newMatch.awayTeam?.name}: ${newMatch.status} (${newScoreStr})`;
            }
        }
        // Case B: Score Change (Exclude Basketball to avoid spam)
        else if (oldMatch && newScoreStr !== oldScoreStr && newScoreStr && newMatch.sport !== 'basketball') {
            // Football Goals check
            if (newMatch.sport === 'football' && matchGlobals.goals === false) {
                // Skip notification
            } else {
                shouldNotify = true;
                title = 'Score Update';
                message = `${newMatch.homeTeam?.name} vs ${newMatch.awayTeam?.name}: ${newScoreStr}`;
            }
        }
        // Case C: New Match appearing live
        else if (!oldMatch) {
            shouldNotify = true;
            title = 'Match Started';
            message = `${newMatch.homeTeam?.name} vs ${newMatch.awayTeam?.name} is now live!`;
        }

        // --- CRICKET SMART NOTIFICATIONS ---
        if (newMatch.sport === 'cricket' && oldMatch) {
            // 1. WICKET DETECTION (Disabled)
            /*
            if (matchGlobals.wickets !== false) {
                const getWickets = (m) => {
                    if (m.wickets) return parseInt(m.wickets) || 0;
                    // Fallback: Parse from score string "123/4"
                    const score = m.score || '';
                    const match = score.match(/\/(\d+)/);
                    return match ? parseInt(match[1]) : 0;
                };

                const oldW = getWickets(oldMatch);
                const newW = getWickets(newMatch);

                if (newW > oldW) {
                    shouldNotify = true;
                    title = 'WICKET!';
                    // Try to find who got out (optional enhancement for future)
                    message = `${newMatch.homeTeam?.name} vs ${newMatch.awayTeam?.name}: ${newScoreStr}`;
                }
            }
            */

            // 2. MILESTONE DETECTION (50s / 100s)
            if (newMatch.scorecard && oldMatch.scorecard) {
                const checkMilestone = (inningsKey) => {
                    const newInning = newMatch.scorecard[inningsKey];
                    const oldInning = oldMatch.scorecard[inningsKey];
                    if (!newInning?.batting || !oldInning?.batting) return;

                    newInning.batting.forEach(batter => {
                        const runs = parseInt(batter.runs) || 0;
                        const oldBatter = oldInning.batting.find(b => b.player === batter.player);
                        const oldRuns = oldBatter ? (parseInt(oldBatter.runs) || 0) : 0;

                        if (matchGlobals.milestones !== false) {
                            // Check 50
                            if (runs >= 50 && oldRuns < 50) {
                                shouldNotify = true;
                                title = 'HALF CENTURY! 👏';
                                message = `${batter.player} has scored 50 runs!`;
                            }
                            // Check 100
                            if (runs >= 100 && oldRuns < 100) {
                                shouldNotify = true;
                                title = 'CENTURY! 💯';
                                message = `${batter.player} has scored a brilliant 100!`;
                            }
                        }

                        // Check Boundaries (Disabled)
                        /*
                        if (matchGlobals.boundaries !== false) {
                            const fours = parseInt(batter.fours) || 0;
                            const oldFours = oldBatter ? (parseInt(oldBatter.fours) || 0) : 0;
                            const sixes = parseInt(batter.sixes) || 0;
                            const oldSixes = oldBatter ? (parseInt(oldBatter.sixes) || 0) : 0;

                            if (fours > oldFours) {
                                shouldNotify = true;
                                title = 'FOUR! 4️⃣';
                                message = `${batter.player} hits a boundary!`;
                            }
                            if (sixes > oldSixes) {
                                shouldNotify = true;
                                title = 'SIX! 🚀';
                                message = `${batter.player} hits a maximum!`;
                            }
                        }
                        */
                    });
                };

                // Check all innings
                Object.keys(newMatch.scorecard).forEach(checkMilestone);
            }

            // 3. TOSS NOTIFICATION
            if (matchGlobals.toss !== false && newMatch.toss && (!oldMatch.toss || oldMatch.toss !== newMatch.toss)) {
                shouldNotify = true;
                title = 'Toss Update 🪙';
                message = `Toss Update: ${newMatch.toss}`;
            }

            // 4. TEAM MILESTONES (50, 100, 200 runs)
            if (matchGlobals.milestones !== false) {
                const checkTeamRuns = (teamStr, teamName) => {
                    const getRuns = (s) => parseInt((s || '').split('/')[0]) || 0;
                    const newRuns = getRuns(newMatch[teamStr]?.score);
                    const oldRuns = getRuns(oldMatch[teamStr]?.score);

                    // Check 50, 100, 150, 200...
                    const milestones = [50, 100, 150, 200, 250, 300, 350, 400];
                    const reached = milestones.find(m => newRuns >= m && oldRuns < m);

                    if (reached) {
                        shouldNotify = true;
                        title = 'Team Milestone 🏏';
                        message = `${teamName} has crossed ${reached} runs!`;
                    }
                };
                checkTeamRuns('homeTeam', newMatch.homeTeam?.name);
                checkTeamRuns('awayTeam', newMatch.awayTeam?.name);
            }

            // 5. STATUS EVENTS (Innings Break, Tea, etc.)
            const statusEvents = ['Innings Break', 'Tea Break', 'Lunch', 'Stumps', 'Rain Delay'];
            if (matchGlobals.status !== false && statusEvents.includes(newMatch.status) && oldMatch.status !== newMatch.status) {
                shouldNotify = true;
                title = 'Match Update';
                message = `${newMatch.status} in ${newMatch.homeTeam?.name} vs ${newMatch.awayTeam?.name}`;
            }
        }

        // --- FOOTBALL SMART NOTIFICATIONS ---
        if (newMatch.sport === 'football' && oldMatch) {
            if (matchGlobals.cards !== false) {
                // 1. RED CARDS
                const newCards = newMatch.cards || [];
                const oldCards = oldMatch.cards || [];

                if (newCards.length > oldCards.length) {
                    const latestCard = newCards[newCards.length - 1]; // Assume appended
                    // API usually gives 'Red Card' or card type 
                    const isRed = latestCard.card === 'Red Card' || latestCard.card === 'Red' || latestCard.info?.includes('Red');

                    if (isRed) {
                        shouldNotify = true;
                        title = 'RED CARD! 🟥';
                        const player = latestCard.home_fault || latestCard.away_fault || 'Player';
                        message = `${player} sent off! Advantage ${latestCard.home_fault ? newMatch.awayTeam?.name : newMatch.homeTeam?.name}`;
                    }
                }
            }

            if (matchGlobals.goals !== false) { // Goals check usually implicit in score, but penalties are special
                // 2. PENALTIES (Check Goalscorers info)
                const newGoals = newMatch.goalscorers || [];
                const oldGoals = oldMatch.goalscorers || [];
                if (newGoals.length > oldGoals.length) {
                    const latestGoal = newGoals[newGoals.length - 1];
                    const isPenalty = latestGoal.info?.toLowerCase().includes('penalty') || latestGoal.score_info?.includes('penalty');

                    if (isPenalty) {
                        shouldNotify = true;
                        title = 'PENALTY GOAL! ⚽';
                        message = `Penalty converted by ${latestGoal.home_scorer || latestGoal.away_scorer}!`;
                    }
                }
            }
        }

        // --- BASKETBALL SMART NOTIFICATIONS ---
        if (newMatch.sport === 'basketball' && oldMatch) {
            if (matchGlobals.closeGame !== false) {
                // 1. CLOSE GAME ALERT (Q4 or Later, Diff <= 5)
                const home = parseInt(newMatch.homeTeam?.score) || 0;
                const away = parseInt(newMatch.awayTeam?.score) || 0;
                const diff = Math.abs(home - away);
                const isLateGame = ['4th Quarter', 'Overtime'].includes(newMatch.status);

                // Trigger only if previously diff > 5 or status wasn't late game (to avoid spam)
                const wasDiff = Math.abs((parseInt(oldMatch.homeTeam?.score) || 0) - (parseInt(oldMatch.awayTeam?.score) || 0));
                const wasLate = ['4th Quarter', 'Overtime'].includes(oldMatch.status);

                if (isLateGame && diff <= 5 && (diff !== wasDiff || !wasLate)) {
                    // Throttle: Only notify if score changed
                    if (newScoreStr !== oldScoreStr) {
                        shouldNotify = true;
                        title = 'THRILLER ALERT! 🔥'; // User requested "Close game"
                        message = `Close Game! ${home} - ${away} in ${newMatch.status}`;
                    }
                }
            }
        }
        // -----------------------------------

        if (shouldNotify) {
            // Determine type for icon/styling
            let type = 'info';
            if (newMatch.sport === 'football' && message.toLowerCase().includes('goal')) type = 'goal';
            if (newMatch.sport === 'cricket' && message.toLowerCase().includes('wicket')) type = 'wicket';

            // 1. Dispatch In-App Sticky Notification
            dispatch(setStickyNotification({
                type,
                title,
                message,
                matchId: newMatch.id
            }));

            // 2. Schedule System Notification (System Tray)
            // This ensures it appears even if app is backgrounded (but not killed)
            scheduleLocalNotification(title, message, { matchId: newMatch.id });
        }
    };

    // Helper to normalize and dispatch
    const handleUpdate = (matches, sportType) => {
        if (matches && matches.length > 0) {
            // Ensure IDs are strings for EntityAdapter and Sport is tagged
            const normalized = matches.map(m => ({
                ...m,
                id: (m.id || m._id)?.toString(),
                sport: sportType || m.sport || 'unknown' // Enforce sport tag
            }));

            // Trigger Notifications BEFORE updating state (so we can compare with old state)
            normalized.forEach(match => checkNotificationTriggers(match));

            dispatch(upsertMatches(normalized));
        }
    };

    // Listeners - Force sport tag based on channel
    socket.on('cricket_update', (data) => handleUpdate(data, 'cricket'));
    socket.on('football_update', (data) => handleUpdate(data, 'football'));
    socket.on('basketball_update', (data) => handleUpdate(data, 'basketball'));

    // Also listen for general updates if your backend emits them
    socket.on('all_scores_update', (data) => {
        if (data.cricket) handleUpdate(data.cricket);
        if (data.football) handleUpdate(data.football);
    });
};

export const stopSocketListeners = () => () => {
    // console.log('🔌 Stopping Redux Socket Listeners...');
    socket.off('cricket_update');
    socket.off('football_update');
    socket.off('basketball_update');
    socket.off('all_scores_update');

    isListening = false;
};
