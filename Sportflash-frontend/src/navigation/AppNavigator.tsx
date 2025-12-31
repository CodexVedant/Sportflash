import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, Theme as NavigationThemeType } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { loadUser } from '@store/slices/authSlice';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from '@app-types/navigation';
import { theme } from '@utils/theme';

// Navigators
import MainNavigator from '@navigation/MainNavigator';
// Screens
import LoginScreen from '@screens/auth/LoginScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import MatchDetailScreen from '@screens/matches/MatchDetailScreen';
import SeriesScreen from '@screens/series/SeriesScreen';
import FollowingScreen from '@screens/following/FollowingScreen';
import BookmarksScreen from '@screens/profile/BookmarksScreen';
import SettingsScreen from '@screens/profile/SettingsScreen';
import PlayerProfileScreen from '@screens/player/PlayerProfileScreen';
import NotificationsScreen from '@screens/profile/NotificationsScreen';
import PreferencesScreen from '@screens/profile/PreferencesScreen';
import NewsDetailScreen from '@screens/news/NewsDetailScreen';
import LeagueDetailsScreen from '@screens/league/LeagueDetailsScreen';
import TeamProfileScreen from '@screens/team/TeamProfileScreen';
import UpcomingMatchesScreen from '@screens/matches/UpcomingMatchesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationTheme: NavigationThemeType = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: 'transparent',
    },
};

export default function AppNavigator() {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.auth);

    useEffect(() => {
        async function prepare() {
            try {
                await dispatch(loadUser());
            } catch (e) {
                console.warn(e);
            } finally {
                await SplashScreen.hideAsync();
            }
        }
        prepare();
    }, [dispatch]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer theme={NavigationTheme}>
            <StatusBar style="light" />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.background }
                }}
            >
                <Stack.Screen name="Main" component={MainNavigator} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
                <Stack.Screen name="Series" component={SeriesScreen} />
                <Stack.Screen name="Following" component={FollowingScreen} />
                <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="LeagueDetails" component={LeagueDetailsScreen} />
                <Stack.Screen name="TeamProfile" component={TeamProfileScreen} />
                <Stack.Screen name="PlayerProfile" component={PlayerProfileScreen} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} />
                <Stack.Screen name="Preferences" component={PreferencesScreen} />
                <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
                <Stack.Screen name="UpcomingMatches" component={UpcomingMatchesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

