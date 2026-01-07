import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        unreadCount: 0,
        preferences: {}, // { match_ID: bool, team_NAME: bool, series_NAME: bool }
        // NEW: Global Event Preferences (Defaults to TRUE to preserve existing behavior)
        globalSettings: {
            cricket: {
                wickets: true,
                boundaries: true,
                milestones: true, // 50s, 100s
                toss: true,
                status: true,     // Innings break, etc.
            },
            football: {
                goals: true,
                cards: true,      // Red cards, penalties
                status: true,     // HT, FT
            },
            basketball: {
                status: true,     // Q1, HT, etc.
                closeGame: true,
            }
        },
        stickyNotification: null, // { message, type, matchId, ... }
    },
    reducers: {
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
        updatePreference: (state, action) => {
            // Payload: { key: 'match_123', value: true }
            const { key, value } = action.payload;
            state.preferences[key] = value;
        },
        updateGlobalSetting: (state, action) => {
            // Payload: { sport: 'cricket', category: 'wickets', value: false }
            const { sport, category, value } = action.payload;
            if (state.globalSettings[sport]) {
                state.globalSettings[sport][category] = value;
            }
        },
        setStickyNotification: (state, action) => {
            state.stickyNotification = action.payload;
        },
        clearStickyNotification: (state) => {
            state.stickyNotification = null;
        },
        markAsRead: (state, action) => {
            const notification = state.items.find(n => n.id === action.payload);
            if (notification && !notification.read) {
                notification.read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state) => {
            state.items.forEach(n => n.read = true);
            state.unreadCount = 0;
        },
        setNotifications: (state, action) => {
            state.items = action.payload;
            state.unreadCount = action.payload.filter(n => !n.read).length;
        }
    },
});

export const {
    addNotification,
    markAsRead,
    markAllAsRead,
    setNotifications,
    updatePreference,
    updateGlobalSetting,
    setStickyNotification,
    clearStickyNotification
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
