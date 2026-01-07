import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import MatchCard from '@components/match/MatchCard';
import { Ionicons } from '@expo/vector-icons';
import SearchModal from '@components/common/SearchModal';
import { useGetLiveMatchesQuery } from '@store/api/matchesApi';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationBell, NotificationPanel } from '@components/notifications';
import NotificationOptionsModal from '@components/notifications/NotificationOptionsModal';
import { initSocketListeners } from '@store/thunks/socketThunks';
import { selectAllLiveMatches } from '@store/slices/liveMatchesSlice';
import { updatePreference } from '@store/slices/notificationsSlice';
import { mapMatchToUI } from '@utils/matchMappers';
import LiveMatchesWidget from '@screens/home/LiveMatchesWidget';
import TrendingNewsWidget from '@screens/home/TrendingNewsWidget';
import MenuToggle from '@components/navigation/MenuToggle';
import TopBar from '@components/navigation/TopBar';

import Sidebar, { SidebarContent } from '@components/navigation/Sidebar';

export default function HomeScreen({ navigation }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { width } = useWindowDimensions();

    // UI Local State
    const [searchVisible, setSearchVisible] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [activeSport, setActiveSport] = useState('cricket');

    // Redux State - Single Source of Truth
    const allLiveMatches = useSelector(selectAllLiveMatches);
    const preferences = useSelector(state => state.notifications.preferences || {}); // Get Preferences
    const { isLoading: isMatchesLoading } = useGetLiveMatchesQuery();

    // Notification Logic (Modal & Selection)
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);

    const handleBellPress = (match) => {
        setSelectedMatch(match);
        setModalVisible(true);
    };

    const handleSavePreferences = (newPrefs) => {
        if (!selectedMatch) return;

        // Update Redux state
        const updates = {
            [`match_${selectedMatch.id}`]: newPrefs.match,
            [`series_${selectedMatch.league}`]: newPrefs.series,
            [`team_${selectedMatch.homeTeam?.name}`]: newPrefs.homeTeam,
            [`team_${selectedMatch.awayTeam?.name}`]: newPrefs.awayTeam,
        };

        Object.entries(updates).forEach(([key, value]) => {
            dispatch(updatePreference({ key, value }));
        });
    };

    // Derived State (Filtering)
    const matches = React.useMemo(() => {
        const live = allLiveMatches
            .map(mapMatchToUI)
            .filter(m => m.status === 'live');

        return activeSport === 'all'
            ? live
            : live.filter(m => m.sport?.toLowerCase() === activeSport);
    }, [allLiveMatches, activeSport]);

    const loading = isMatchesLoading && matches.length === 0;

    // Initialize Socket Listeners
    useEffect(() => {
        dispatch(initSocketListeners());
        // Optional: return () => dispatch(stopSocketListeners());
    }, [dispatch]);

    // Mock notifications (Keeping existing logic)
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

    // Responsive Logic
    const isDesktop = width > 768;
    const MAX_WIDTH = 1200;
    const contentWidth = isDesktop ? Math.min(width, MAX_WIDTH) : width;




    return (
        <SafeAreaView style={styles.container}>
            <SearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} />
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

            {/* Notification Subscription Modal */}
            <NotificationOptionsModal
                visible={modalVisible}
                match={selectedMatch}
                onClose={() => setModalVisible(false)}
                onSave={handleSavePreferences}
                initialPreferences={preferences}
            />

            <NotificationPanel
                visible={notificationVisible}
                onClose={() => setNotificationVisible(false)}
                notifications={notifications}
                onNotificationPress={(notification) => {
                    console.log('Notification pressed:', notification);
                    setNotificationVisible(false);
                }}
            />

            {/* Header */}
            <View style={[styles.header, isDesktop && styles.headerDesktop]}>
                {/* Menu Icon (Always Visible) */}
                <MenuToggle onPress={() => setSidebarVisible(true)} />

                <View style={[styles.logoContainer, isDesktop && styles.logoContainerDesktop]}>
                    <Text style={styles.logoText}>Sport<Text style={styles.highlight}>Flash</Text></Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => setSearchVisible(true)}>
                        <Ionicons name="search" size={24} color={theme.colors.text} style={{ marginRight: 16 }} />
                    </TouchableOpacity>

                    {user ? (
                        <NotificationBell
                            count={notifications.filter(n => !n.read).length}
                            onPress={() => setNotificationVisible(true)}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.loginBtn}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.loginBtnText}>Login</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Sport Tabs */}
            <TopBar
                activeTab={activeSport}
                onTabChange={setActiveSport}
                tabs={SPORT_TABS}
            />

            {/* Live Section */}
            <View style={[styles.contentContainer, isDesktop && styles.contentContainerDesktop, { flex: 1 }]}>
                <LiveMatchesWidget
                    matches={matches} // Use filtered/derived matches here
                    loading={loading}
                    width={width}
                    navigation={navigation}
                    gap={theme.spacing.md}
                    preferences={preferences} // Pass preferences so widget knows what's subscribed
                    onNotificationPress={handleBellPress} // Pass handler
                    ListFooterComponent={
                        <>
                            {/* Trending News Placeholder */}
                            <TrendingNewsWidget />
                            {/* Bottom spacing for TabBar */}
                            <View style={{ height: 80 }} />
                        </>
                    }
                />
            </View>
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
        position: 'relative',
    },
    menuBtn: {
        zIndex: 20,
    },
    logoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
    },
    emptyContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: theme.borderRadius.lg,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: theme.sizes.md,
    },
    logoText: {
        fontSize: 24,
        fontFamily: theme.fonts.display,
        fontWeight: 'bold',
        color: theme.colors.text,
        letterSpacing: 1,
    },
    highlight: {
        color: theme.colors.primary,
    },
    actions: {
        flexDirection: 'row',
        zIndex: 10,
        alignItems: 'center', // Fix vertical alignment
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.sm,
        fontWeight: '600',
        marginBottom: theme.spacing.md,
        letterSpacing: 1,
    },
    newsPlaceholder: {
        height: 150,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    // Desktop Styles
    headerDesktop: {
        paddingHorizontal: theme.spacing.xl,
        justifyContent: 'space-between',
    },
    logoContainerDesktop: {
        position: 'relative', // Reset absolute position on desktop
        alignItems: 'flex-start',
        left: 'auto',
        right: 'auto',
    },
    contentContainer: {
        width: '100%',
    },
    contentContainerDesktop: {
        maxWidth: 1200,
        alignSelf: 'center',
    },
    gridContainer: {
        width: '100%',
    },
    loginBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    loginBtnText: {
        color: '#fff',
        fontFamily: theme.fonts.bold,
        fontSize: 14,
    }
});
