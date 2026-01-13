import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, StyleSheet, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import SearchModal from '@components/common/SearchModal';
import { useGetLiveMatchesQuery } from '@store/api/matchesApi';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationBell, NotificationPanel, NotificationOptionsModal } from '@components/notifications';
import { updatePreference } from '@store/slices/notificationsSlice';
import { useToast } from '@context/ToastContext';
import { Match } from '@app-types/models/match';
import { initSocketListeners, forceRefreshScores } from '@store/thunks/socketThunks';
import { selectAllLiveMatches } from '@store/slices/liveMatchesSlice';
import { mapMatchToUI } from '@utils/matchMappers';
import LiveMatchesWidget from '@screens/home/LiveMatchesWidget';
import TrendingNewsWidget from '@screens/home/TrendingNewsWidget';
import MenuToggle from '@components/navigation/MenuToggle';
import TopBar from '@components/navigation/TopBar';
import Sidebar from '@components/navigation/Sidebar';
import { styles } from '@utils/style/HomeScreen.styles';
import { SPORT_TABS, isDesktopSize } from '@utils/script/HomeScreen.helpers';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { showToast } = useToast();
    const { width } = useWindowDimensions();
    const preferences = useAppSelector(state => state.notifications.preferences || {});

    // Notification Logic (Modal & Selection)
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    const handleBellPress = (match: Match) => {
        setSelectedMatch(match);
        setModalVisible(true);
    };

    const handleSavePreferences = (newPrefs: any) => {
        if (!selectedMatch) return;

        // Update Redux state
        const updates = {
            [`match_${selectedMatch.id}`]: newPrefs.match,
            [`series_${selectedMatch.league}`]: newPrefs.series, // Ensure league is string or handle object
            [`team_${selectedMatch.homeTeam?.name}`]: newPrefs.homeTeam,
            [`team_${selectedMatch.awayTeam?.name}`]: newPrefs.awayTeam,
        };

        Object.entries(updates).forEach(([key, value]) => {
            dispatch(updatePreference({ key, value: Boolean(value) }));
        });

        showToast("Notification preferences updated", "success");
    };

    // UI Local State
    const [searchVisible, setSearchVisible] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [activeSport, setActiveSport] = useState('cricket');

    // Redux State - Single Source of Truth
    const allLiveMatches = useAppSelector(selectAllLiveMatches);
    // Explicitly type the result of the query hook if needed, but standard usage usually infers correctly
    const { isLoading: isMatchesLoading } = useGetLiveMatchesQuery(undefined);

    // Derived State (Filtering)
    const matches = React.useMemo(() => {
        // Ensure allLiveMatches is an array
        const liveMatchesArray = Array.isArray(allLiveMatches) ? allLiveMatches : [];

        const live = liveMatchesArray
            .map(mapMatchToUI)
            .filter(m => m.status === 'live');

        return activeSport === 'all'
            ? live
            : live.filter(m => m.sport?.toLowerCase() === activeSport);
    }, [allLiveMatches, activeSport]);

    const loading = isMatchesLoading && matches.length === 0;

    // Initialize Socket Listeners & AppState handling

    // Initialize Socket Listeners & AppState handling
    useEffect(() => {
        dispatch(initSocketListeners());

        // Refresh scores immediately on mount (in case socket was already connected)
        dispatch(forceRefreshScores());

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                console.log('📱 App has come to the foreground! Refreshing scores...');
                dispatch(forceRefreshScores());
            }
        });

        return () => {
            subscription.remove();
            // dispatch(stopSocketListeners()); // Optional
        };
    }, [dispatch]);

    // Notifications from Redux
    const notifications = useAppSelector(state => state.notifications.items);

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
                    matches={matches}
                    loading={loading}
                    width={width}
                    navigation={navigation}
                    gap={theme.spacing.md}
                    ListFooterComponent={
                        <>
                            <TrendingNewsWidget sport={activeSport} />
                            <View style={{ height: 80 }} />
                        </>
                    }
                    preferences={preferences}
                    onNotificationPress={handleBellPress}
                />
            </View>
        </SafeAreaView>
    );
}

