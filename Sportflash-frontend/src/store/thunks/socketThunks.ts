import socket from '@services/socket';
import { upsertMatches } from '../slices/liveMatchesSlice';
import { addNotification } from '../slices/notificationsSlice';
import { AppDispatch, RootState } from '../store';
import { Match } from '@app-types/models/match';
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
        else if (oldMatch && newScore !== oldScore && newMatch.sport !== 'basketball') {
            shouldNotify = true;
            title = 'Score Update';
            message = `${newMatch.homeTeam?.name} vs ${newMatch.awayTeam?.name}: ${newScore}`;
        }

        if (shouldNotify) {
            // Dispatch to Notification History
            dispatch(addNotification({
                id: Date.now(), // Generate ID
                title,
                message,
                type: 'match_start', // Generic type for now
                timestamp: new Date().toISOString(),
                read: false,
                createdAt: new Date().toISOString() // BaseEntity
            }));

            // Show Toast (Immediate Feedback)
            Toast.show({
                type: 'info',
                text1: title,
                text2: message,
                position: 'top',
                visibilityTime: 4000,
            });
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
