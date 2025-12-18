import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

// Navigators
import MainNavigator from './MainNavigator';
// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MatchDetailScreen from '../screens/matches/MatchDetailScreen';
import SeriesScreen from '../screens/series/SeriesScreen';
import FollowingScreen from '../screens/following/FollowingScreen';
import BookmarksScreen from '../screens/bookmarks/BookmarksScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import PlayerProfileScreen from '../screens/player/PlayerProfileScreen';

import { AuthContext } from '../context/AuthContext';
import { theme } from '../utils/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { loading } = useContext(AuthContext);

    useEffect(() => {
        async function prepare() {
            SplashScreen.hideAsync();
        }
        prepare();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainNavigator} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
                <Stack.Screen name="Series" component={SeriesScreen} />
                <Stack.Screen name="Following" component={FollowingScreen} />
                <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="PlayerProfile" component={PlayerProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
