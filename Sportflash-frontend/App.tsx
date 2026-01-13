import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store, persistor } from '@store/store';
import AppNavigator from '@navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@context/ToastContext';
import { theme } from '@utils/theme';
import { useGetLiveMatchesQuery, useGetUpcomingMatchesQuery } from '@store/api/matchesApi';
import Toast from 'react-native-toast-message';
import { PersistGate } from 'redux-persist/integration/react';
import { savePushToken } from './src/store/slices/authSlice';
import { registerForPushNotificationsAsync } from './src/services/NotificationService';
import * as Notifications from 'expo-notifications';
import { useAppDispatch, useAppSelector } from './src/hooks/redux';

// Prefetch component to load data on app start
function DataPrefetcher() {
    // Prefetch live matches
    useGetLiveMatchesQuery();

    // Prefetch upcoming matches for all sports
    useGetUpcomingMatchesQuery({ sport: 'cricket' });
    useGetUpcomingMatchesQuery({ sport: 'football' });
    useGetUpcomingMatchesQuery({ sport: 'basketball' });

    return null;
}

function AppContent() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        // Register for Push Notifications
        // Register for Push Notifications
        registerForPushNotificationsAsync().then(token => {
            console.log('📌 Push Registration Result:', token ? 'Success' : 'Failed', 'User:', user ? 'Logged In' : 'Logged Out');
            if (token && user) {
                console.log('📌 Dispatching savePushToken to Backend...');
                dispatch(savePushToken(token));
            } else if (!user) {
                console.log('📌 User not logged in, skipping token save.');
            }
        });

        // Listen for incoming notifications (foreground)
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            // console.log('Notification Received:', notification);
        });

        // Listen for user interacting with notification
        const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
            // console.log('Notification Response:', response);
            // Navigate based on data if needed
        });

        return () => {
            subscription.remove();
            responseSubscription.remove();
        };
    }, [dispatch, user]);

    return (
        <SafeAreaProvider>
            <ToastProvider>
                <DataPrefetcher />
                <AppNavigator />
            </ToastProvider>
            <Toast />
        </SafeAreaProvider>
    );
}

export default function App() {
    // Force dark background on Web to prevent white flash
    useEffect(() => {
        if (Platform.OS === 'web') {
            document.body.style.backgroundColor = theme.colors.background;
        }
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AppContent />
            </PersistGate>
        </Provider>
    );
}
