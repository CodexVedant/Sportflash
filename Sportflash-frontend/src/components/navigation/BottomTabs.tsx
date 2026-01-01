import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

// Screens
import HomeScreen from '@screens/home/HomeScreen';
import MatchesScreen from '@screens/matches/MatchesScreen';
import NewsScreen from '@screens/news/NewsScreen';
import StandingsScreen from '@screens/standings/StandingsScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';

// Theme
import { theme } from '@utils/theme';
import { styles } from '@utils/style/BottomTabs.styles';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Matches') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'News') {
                        iconName = focused ? 'newspaper' : 'newspaper-outline';
                    } else if (route.name === 'Standings') {
                        iconName = focused ? 'trophy' : 'trophy-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarBackground: () => (
                    <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFill} />
                ),
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen as any} />
            <Tab.Screen name="Matches" component={MatchesScreen as any} />
            <Tab.Screen name="News" component={NewsScreen as any} />
            <Tab.Screen name="Standings" component={StandingsScreen as any} />
            <Tab.Screen name="Profile" component={ProfileScreen as any} />
        </Tab.Navigator>
    );
}
