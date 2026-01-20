import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { NotificationItem } from '@app-types/models/notification';
import { login, loadUser, updateUserPreferences, logout } from './authSlice'; // Import actions

export interface NotificationsState {
    items: NotificationItem[];
    unreadCount: number;
    preferences: { [key: string]: boolean };
    globalSettings: { [key: string]: any };
}

const initialState: NotificationsState = {
    items: [],
    unreadCount: 0,
    preferences: {},
    globalSettings: {},
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        updatePreference: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
            state.preferences[action.payload.key] = action.payload.value;
        },
        updateGlobalSetting: (state, action: PayloadAction<{ key: string; value: any }>) => {
            state.globalSettings[action.payload.key] = action.payload.value;
        },
        addNotification: (state, action: PayloadAction<NotificationItem>) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
        markAsRead: (state, action: PayloadAction<string>) => {
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
        setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
            state.items = action.payload;
            state.unreadCount = action.payload.filter(n => !n.read).length;
        }
    },
    extraReducers: (builder) => {
        // Hydrate preferences from User object on Login / Load User / Update Preferences
        builder.addMatcher(
            isAnyOf(login.fulfilled, loadUser.fulfilled, updateUserPreferences.fulfilled),
            (state, action) => {
                if (!action.payload) return;

                // Handle both User object (update) and AuthResponse (login/load)
                // 'token' exists in AuthResponseData, but not in User
                let user;
                if ('token' in action.payload) {
                    user = action.payload.user;
                } else {
                    user = action.payload;
                }

                if (user && user.preferences) {
                    // 1. Sync Followed Matches
                    if (user.preferences.followedMatches) {
                        user.preferences.followedMatches.forEach((matchId: string) => {
                            state.preferences[`match_${matchId}`] = true;
                        });
                    }

                    // 2. Sync Global Notifications Toggle
                    if (user.preferences.notifications !== undefined) {
                        state.globalSettings['notifications'] = user.preferences.notifications;
                    }
                }
            }
        );

        // CLEAR Notifications on Logout
        builder.addMatcher(
            isAnyOf(logout.fulfilled),
            (state) => {
                state.items = [];
                state.unreadCount = 0;
                state.preferences = {};
                state.globalSettings = {};
            }
        );
    }
});

export const { addNotification, markAsRead, markAllAsRead, setNotifications, updatePreference, updateGlobalSetting } = notificationsSlice.actions;
export default notificationsSlice.reducer;
