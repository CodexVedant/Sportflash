import socket from '@services/socket';
import { upsertMatches } from '../slices/liveMatchesSlice';
import { addNotification } from '../slices/notificationsSlice';
import { AppDispatch, RootState } from '../store';
import { Match } from '@app-types/models/match';
import { navigate } from '@services/NavigationService';
import Toast from 'react-native-toast-message';

let isListening = false;

export const initSocketListeners = () => (dispatch: AppDispatch, getState: () => RootState) => {
    if (isListening) return;

    // console.log('🔌 Initializing Redux Socket Listeners...');
    isListening = true;

    // Helper to check for notifications
    const checkNotificationTriggers = (newMatch: Match, oldMatch?: Match) => {
        const state = getState();
        const prefs = state.notifications.preferences || {};

        // 1. Check Subscription
        const isSubscribed =
            prefs[`match_${newMatch.id}`] ||
            prefs[`series_${newMatch.league}`] ||
            prefs[`team_${newMatch.homeTeam?.name}`] ||
            prefs[`team_${newMatch.awayTeam?.name}`];

        if (!isSubscribed) return;

        let shouldNotify = false;
        let title = '';
        let message = '';

        const newScore = getScoreString(newMatch);
        const oldScore = oldMatch ? getScoreString(oldMatch) : '';

        // Status Change
        if (oldMatch && oldMatch.status !== newMatch.status) {
            shouldNotify = true;
            title = 'Match Status Update';
            message = `${newMatch.homeTeam?.name} vs ${newMatch.awayTeam?.name}: ${newMatch.status} (${newScore})`;
        }
        // Score Change (if not basketball to reduce spam)
        else if (oldMatch && newScore !== oldScore && newMatch.sport !== 'basketball' && newMatch.sport !== 'cricket') {
            shouldNotify = true;
            title = 'Score Update';
            message = `${newMatch.homeTeam?.name} vs ${newMatch.awayTeam?.name}: ${newScore}`;
        }

        // --- CRICKET SMART NOTIFICATIONS ---
        if (newMatch.sport === 'cricket' && oldMatch) {
            // 1. WICKET DETECTION
            const getWickets = (s: string) => {
                if (!s) return 0;
                const matchW = s.match(/\/(\d+)/);
                return matchW ? parseInt(matchW[1]) : 0;
            };

            const oldW = getWickets(oldMatch.homeTeam?.score as string) + getWickets(oldMatch.awayTeam?.score as string);
            const newW = getWickets(newMatch.homeTeam?.score as string) + getWickets(newMatch.awayTeam?.score as string);

            if (newW > oldW) {
                shouldNotify = true;
                title = 'WICKET! ☝️';
                message = `${newMatch.homeTeam?.name} vs ${newMatch.awayTeam?.name}: ${newScore}`;
            }

            // 2. MILESTONE DETECTION (50s / 100s)
            if (newMatch.scorecard && oldMatch.scorecard) {
                try {
                    Object.keys(newMatch.scorecard).forEach((inningKey) => {
                        const newInning = (newMatch.scorecard as any)[inningKey];
                        const oldInning = (oldMatch.scorecard as any)[inningKey];
                        if (!newInning?.batting || !oldInning?.batting) return;

                        newInning.batting.forEach((batter: any) => {
                            const runs = parseInt(batter.runs) || 0;
                            const oldBatter = oldInning.batting.find((b: any) => b.player === batter.player);
                            const oldRuns = oldBatter ? (parseInt(oldBatter.runs) || 0) : 0;

                            if (runs >= 50 && oldRuns < 50) {
                                shouldNotify = true;
                                title = 'HALF CENTURY! 👏';
                                message = `${batter.player} has scored 50 runs!`;
                            }
                            if (runs >= 100 && oldRuns < 100) {
                                shouldNotify = true;
                                title = 'CENTURY! 💯';
                                message = `${batter.player} has scored a brilliant 100!`;
                            }
                        });
                    });
                } catch (e) {
                    console.warn('Error processing milestones', e);
                }
            }

            // 3. STATUS EVENTS
            const statusEvents = ['Innings Break', 'Tea Break', 'Lunch', 'Stumps', 'Rain Delay'];
            if (oldMatch.status !== newMatch.status && statusEvents.includes(newMatch.status)) {
                shouldNotify = true;
                title = 'Match Update';
                message = `${newMatch.status}: ${newMatch.homeTeam?.name} vs ${newMatch.awayTeam?.name}`;
            }
        }

        if (shouldNotify) {
            // 1. Show In-App Toast (Foreground)
            Toast.show({
                type: 'match_update', // Use Custom Bell Icon Toast
                text1: title,
                text2: message,
                position: 'top',
                visibilityTime: 4000,
                onPress: () => {
                    console.log('🍞 Toast Clicked! Navigating to:', newMatch.id);
                    Toast.hide(); // Hide the notification toast

                    // Show feedback toast
                    Toast.show({
                        type: 'success',
                        text1: 'Redirecting...',
                        text2: `Opening Match ${newMatch.id}`,
                        visibilityTime: 1500
                    });

                    navigate('MatchDetail', {
                        matchId: newMatch.id.toString(),
                        sport: newMatch.sport || 'football',
                        match: newMatch // 🚀 PASS FULL DATA direct to screen
                    });
                }
            });

            // 2. Add to Notification History (Redux)
            dispatch(addNotification({
                id: Date.now().toString(), // Simple ID generation
                type: 'match_update',
                title: title,
                message: message,
                timestamp: new Date().toISOString(),
                read: false,
                link: `/match/${newMatch.id}`,
                matchId: newMatch.id.toString(),
                sport: newMatch.sport,
                matchSnapshot: newMatch // 📸 Save Snapshot for History Navigation
            }));
        }
    };

    const getScoreString = (match: Match): string => {
        if (match.sport === 'football') {
            return `${match.homeTeam?.score || 0} - ${match.awayTeam?.score || 0}`;
        }
        if (match.sport === 'cricket') {
            return `${match.homeTeam?.score || ''} - ${match.awayTeam?.score || ''}`;
        }
        // Fallback
        return (typeof match.score === 'string' ? match.score : (match.score as any)?.display) || '';
    };

    // Helper to normalize and dispatch
    const handleUpdate = (matches: any[], sportType?: string) => {
        if (matches && matches.length > 0) {
            const state = getState();

            // Ensure IDs are strings for EntityAdapter
            const normalized = matches.map(m => ({
                ...m,
                id: (m.id || m._id)?.toString(),
                sport: sportType || m.sport || 'unknown'
            }));

            // Check triggers for each match against OLD state
            normalized.forEach(match => {
                const oldMatch = state.liveMatches.entities[match.id];
                checkNotificationTriggers(match, oldMatch);
            });

            dispatch(upsertMatches(normalized));
        }
    };

    // Listeners
    socket.on('cricket_update', (data: any) => handleUpdate(data, 'cricket'));
    socket.on('football_update', (data: any) => handleUpdate(data, 'football'));
    socket.on('basketball_update', (data: any) => handleUpdate(data, 'basketball'));

    socket.on('all_scores_update', (data: any) => {
        if (data.cricket) handleUpdate(data.cricket, 'cricket');
        if (data.football) handleUpdate(data.football, 'football');
    });
};

export const stopSocketListeners = () => () => {
    socket.off('cricket_update');
    socket.off('football_update');
    socket.off('basketball_update');
    socket.off('all_scores_update');
    isListening = false;
};

export const forceRefreshScores = () => (dispatch: AppDispatch) => {
    // console.log('🔄 Forcing Score Refresh via Socket...');
    socket.emit('request_scores', 'all');
};
