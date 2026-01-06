import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import AppNavigator from '@navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@context/ToastContext';
import { theme } from '@utils/theme';
import { useGetLiveMatchesQuery, useGetUpcomingMatchesQuery } from '@store/api/matchesApi';

// Prefetch component to load data on app start
function DataPrefetcher() {
    // Prefetch live matches
    useGetLiveMatchesQuery();

    // Prefetch upcoming matches for all sports
    useGetUpcomingMatchesQuery({ sport: 'cricket' });
    useGetUpcomingMatchesQuery({ sport: 'football' });
    useGetUpcomingMatchesQuery({ sport: 'basketball' });

    return null; // This component doesn't render anything
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
            <SafeAreaProvider>
                <ToastProvider>
                    <DataPrefetcher />
                    <AppNavigator />
                </ToastProvider>
            </SafeAreaProvider>
        </Provider>
    );
}
