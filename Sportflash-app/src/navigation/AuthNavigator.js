import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator({ route }) {
    const { setIsAuthenticated } = route.params || {};
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="Register" component={RegisterScreen} initialParams={{ setIsAuthenticated }} />
        </Stack.Navigator>
    );
}
