import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from '@app-types/models/notification';

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
});

export const { addNotification, markAsRead, markAllAsRead, setNotifications, updatePreference, updateGlobalSetting } = notificationsSlice.actions;
export default notificationsSlice.reducer;

