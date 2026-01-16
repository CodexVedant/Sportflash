import { useEffect } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { store, persistor } from '@store/store';
import AppNavigator from '@navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@context/ToastContext';
import { theme } from '@utils/theme';
import { useGetLiveMatchesQuery, useGetUpcomingMatchesQuery } from '@store/api/matchesApi';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { PersistGate } from 'redux-persist/integration/react';

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
    // Load fonts before rendering
    const [fontsLoaded] = useFonts({
        ...Ionicons.font,
    });

    // Force dark background on Web to prevent white flash
    useEffect(() => {
        if (Platform.OS === 'web') {
            document.body.style.backgroundColor = theme.colors.background;
        }
    }, []);

    // Show loading screen while fonts are loading
    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SafeAreaProvider>
                    <ToastProvider>
                        <DataPrefetcher />
                        <AppNavigator />
                    </ToastProvider>
                </SafeAreaProvider>
            </PersistGate>
        </Provider>
    );
}
