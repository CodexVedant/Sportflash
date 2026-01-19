<<<<<<< HEAD
﻿import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, StyleSheet, AppState } from 'react-native';
=======
﻿import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, StyleSheet, ScrollView } from 'react-native';
>>>>>>> origin/main
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
    const [selectedLeague, setSelectedLeague] = useState('all');

    // Redux State - Socket-based live matches (all sports including cricket)
    const allLiveMatches = useAppSelector(selectAllLiveMatches);
    const { isLoading: isMatchesLoading } = useGetLiveMatchesQuery(undefined);

    // Derived State (Filtering)
    // Derived State (Filtering)
    const matches = React.useMemo(() => {
        const liveMatchesArray = Array.isArray(allLiveMatches) ? allLiveMatches : [];
        let live = liveMatchesArray
            .map(mapMatchToUI)
            .filter(m => m.status === 'live');

        if (activeSport !== 'all') {
            live = live.filter(m => m.sport?.toLowerCase() === activeSport);
        }

        if (selectedLeague !== 'all') {
            live = live.filter(m => (typeof m.league === 'string' ? m.league : m.league?.name) === selectedLeague);
        }

        return live;
    }, [allLiveMatches, activeSport, selectedLeague]);

    // Extract available leagues for the current sport
    const availableLeagues = React.useMemo(() => {
        const liveMatchesArray = Array.isArray(allLiveMatches) ? allLiveMatches : [];
        let filteredBySport = liveMatchesArray
            .map(mapMatchToUI)
            .filter(m => m.status === 'live');

        if (activeSport !== 'all') {
            filteredBySport = filteredBySport.filter(m => m.sport?.toLowerCase() === activeSport);
        }

        const leaguesSet = new Set<string>();
        filteredBySport.forEach(match => {
            const name = typeof match.league === 'string' ? match.league : match.league?.name;
            if (name) leaguesSet.add(name);
        });

        return Array.from(leaguesSet).sort();
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

                    // Strategy:
                    // 1. Try Snapshot (Best for closed matches)
                    // 2. Try Live Store (Best for currently live matches if snapshot missing)
                    // 3. Fallback to ID-based fetch (might fail if network issue)

                    let targetMatch = notification.matchSnapshot;

                    if (!targetMatch && notification.matchId) {
                        const liveMatch = (allLiveMatches as Match[]).find(m =>
                            m.id.toString() === notification.matchId?.toString()
                        );
                        if (liveMatch) {
                            console.log('✅ Found match in Live Store during nav:', liveMatch.id);
                            targetMatch = liveMatch;
                        }
                    }

                    if (targetMatch) {
                        // Ensure mapped to UI format if needed (MatchDetail expects full object)
                        // But usually Live store data is raw? No, MatchDetail handles raw 'fetchedMatch' structure usually.
                        // Wait, MatchDetail expects 'match' param. 
                        // LiveMatchesWidget passes mapped data?
                        // Let's pass what we have. MatchDetail handles it.
                    }

                    navigation.navigate('MatchDetail', {
                        matchId: notification.matchId,
                        sport: notification.sport || 'football',
                        match: targetMatch // 🚀 Pass Data (Snapshot or Live Lookup)
                    });
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
            {/* Sport Tabs */}
            <TopBar
                activeTab={activeSport}
                onTabChange={(sport) => {
                    setActiveSport(sport);
                    setSelectedLeague('all'); // Reset league filter on sport change
                }}
                tabs={SPORT_TABS}
            />

            {/* League Filters (Horizontal, only if leagues exist) */}
            {availableLeagues.length > 0 && (
                <View style={{ marginBottom: 8 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: theme.spacing.md, gap: 8, paddingVertical: 8 }}
                    >
                        <TouchableOpacity
                            style={[
                                styles.leagueChip,
                                selectedLeague === 'all' && styles.leagueChipActive
                            ]}
                            onPress={() => setSelectedLeague('all')}
                        >
                            <Text style={[
                                styles.leagueChipText,
                                selectedLeague === 'all' && styles.leagueChipTextActive
                            ]}>All</Text>
                        </TouchableOpacity>
                        {availableLeagues.map(leagueName => (
                            <TouchableOpacity
                                key={leagueName}
                                style={[
                                    styles.leagueChip,
                                    selectedLeague === leagueName && styles.leagueChipActive
                                ]}
                                onPress={() => setSelectedLeague(selectedLeague === leagueName ? 'all' : leagueName)}
                            >
                                <Text style={[
                                    styles.leagueChipText,
                                    selectedLeague === leagueName && styles.leagueChipTextActive
                                ]}>{leagueName}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

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

