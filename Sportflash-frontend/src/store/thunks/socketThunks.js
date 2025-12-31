import socket from '@services/socket';
import { upsertMatches } from '../slices/liveMatchesSlice';

let isListening = false;

export const initSocketListeners = () => (dispatch) => {
    if (isListening) return;

    // console.log('🔌 Initializing Redux Socket Listeners...');
    isListening = true;

    // Helper to normalize and dispatch
    const handleUpdate = (matches) => {
        if (matches && matches.length > 0) {
            // Ensure IDs are strings for EntityAdapter
            const normalized = matches.map(m => ({
                ...m,
                id: (m.id || m._id)?.toString()
            }));
            dispatch(upsertMatches(normalized));
        }
    };

    // Listeners
    socket.on('cricket_update', handleUpdate);
    socket.on('football_update', handleUpdate);
    socket.on('basketball_update', handleUpdate);

    // Also listen for general updates if your backend emits them
    socket.on('all_scores_update', (data) => {
        if (data.cricket) handleUpdate(data.cricket);
        if (data.football) handleUpdate(data.football);
        // ... etc
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
