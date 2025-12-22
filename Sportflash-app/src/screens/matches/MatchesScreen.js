import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import Sidebar from '@components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import { NotificationBell, NotificationPanel } from '@components/notifications';
import { AuthContext } from '@context/AuthContext';
import TopBar from '@components/navigation/TopBar';
import CricketMatchScreen from './CricketMatchScreen';
import FootballMatchScreen from './FootballMatchScreen';
import BasketballMatchScreen from './BasketballMatchScreen';

export default function MatchesScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [activeSport, setActiveSport] = useState('cricket');

    // Mock notifications
    const [notifications] = useState([
        {
            id: 1,
            type: 'match_start',
            title: 'Match Starting Soon',
            message: 'India vs Australia starts in 15 minutes',
            timestamp: new Date(),
            read: false,
        },
        {
            id: 2,
            type: 'goal',
            title: 'GOAL!',
            message: 'Manchester United scored! 1-0',
            timestamp: new Date(Date.now() - 300000),
            read: false,
        },
    ]);

    const SPORT_TABS = [
        { id: 'cricket', label: 'Cricket', icon: 'baseball-outline' },
        { id: 'football', label: 'Football', icon: 'football-outline' },
        { id: 'basketball', label: 'Basketball', icon: 'basketball-outline' },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    const renderSportScreen = () => {
        switch (activeSport) {
            case 'cricket':
                return <CricketMatchScreen navigation={navigation} />;
            case 'football':
                return <FootballMatchScreen navigation={navigation} />;
            case 'basketball':
                return <BasketballMatchScreen navigation={navigation} />;
            default:
                return <CricketMatchScreen navigation={navigation} />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuBtn}>
                        <Ionicons name="menu" size={28} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Matches</Text>
                </View>
                <View style={styles.headerActions}>
                    {user && (
                        <NotificationBell
                            count={unreadCount}
                            onPress={() => setNotificationVisible(true)}
                        />
                    )}
                </View>
            </View>

            {/* Sport Tabs */}
            <TopBar
                activeTab={activeSport}
                onTabChange={setActiveSport}
                tabs={SPORT_TABS}
            />

            {/* Sport-specific Content */}
            {renderSportScreen()}

            {/* Notification Panel */}
            <NotificationPanel
                visible={notificationVisible}
                onClose={() => setNotificationVisible(false)}
                notifications={notifications}
                onNotificationPress={(notification) => {
                    console.log('Notification pressed:', notification);
                    setNotificationVisible(false);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: theme.sizes.xl,
        fontFamily: theme.fonts.display,
        color: theme.colors.text,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    menuBtn: {
        marginRight: 16,
    },
});

