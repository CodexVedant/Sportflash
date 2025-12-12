import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

// Navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import MatchDetailScreen from '../screens/matches/MatchDetailScreen'; // Added

// Mock Auth Context (replace with real redux later)
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to false

    // Fonts temporary disabled
    const fontsLoaded = true;

    useEffect(() => {
        async function prepare() {
            SplashScreen.hideAsync();
        }
        prepare();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name="Main" component={MainNavigator} />
                        <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} initialParams={{ setIsAuthenticated }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
