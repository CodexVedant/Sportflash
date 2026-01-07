import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
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
import Sidebar from '@components/navigation/Sidebar';
import { styles } from '@utils/style/HomeScreen.styles';
import { SPORT_TABS, isDesktopSize, getMockNotifications } from '@utils/script/HomeScreen.helpers';

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
    const [notifications] = useState(getMockNotifications());

    // Responsive Logic
    const isDesktop = isDesktopSize(width);




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


