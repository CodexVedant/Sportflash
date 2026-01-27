import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, StyleSheet, ScrollView, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import SearchModal from '@components/common/SearchModal';
import { useGetLiveMatchesQuery } from '@store/api/matchesApi';
import { useUpdatePreferencesMutation } from '@store/api/usersApi';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationBell, NotificationPanel, NotificationOptionsModal } from '@components/notifications';
import { updatePreference } from '@store/slices/notificationsSlice';
import { updateUserPreferences, loadUser } from '@store/slices/authSlice';
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
    const [updatePreferencesApi] = useUpdatePreferencesMutation();

    // Notification Logic (Modal & Selection)
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    const handleBellPress = (match: Match) => {
        if (!user) {
            showToast('Please login to follow matches', 'error');
            navigation.navigate('Login');
            return;
        }

        setSelectedMatch(match);
        setModalVisible(true);
    };

    const handleSavePreferences = (newPrefs: any) => {
        if (!selectedMatch) return;

        // Update Redux state (Local Notifications)
        const updates = {
            [`match_${selectedMatch.id}`]: newPrefs.match,
            [`series_${selectedMatch.league}`]: newPrefs.series,
            [`team_${selectedMatch.homeTeam?.name}`]: newPrefs.homeTeam,
            [`team_${selectedMatch.awayTeam?.name}`]: newPrefs.awayTeam,
        };

        Object.entries(updates).forEach(([key, value]) => {
            dispatch(updatePreference({ key, value: Boolean(value) }));
        });

        // ================= SYNC WITH BACKEND =================
        const apiUpdates: any = {};

        // 1. Followed Matches (Existing Logic)
        if (newPrefs.match !== undefined) {
            const currentFollowed = Object.keys(preferences)
                .filter(k => k.startsWith('match_') && preferences[k])
                .map(k => k.replace('match_', ''));

            let newFollowed = new Set(currentFollowed);
            if (newPrefs.match) {
                newFollowed.add(String(selectedMatch.id));
            } else {
                newFollowed.delete(String(selectedMatch.id));
            }
            apiUpdates.followedMatches = Array.from(newFollowed);
        }

        // 2. Favorite Teams
        if (newPrefs.homeTeam !== undefined || newPrefs.awayTeam !== undefined) {
            let currentTeams = user?.preferences?.favoriteTeams || [];

            // Helper to toggle team
            const toggleTeam = (team: any, shouldAdd: boolean) => {
                if (!team || !team.name) return;
                const exists = currentTeams.some(t => t.name === team.name); // Using Name as ID for now if ID missing

                if (shouldAdd && !exists) {
                    currentTeams = [...currentTeams, {
                        id: team.id?.toString() || team.name, // Fallback to name if ID missing
                        name: team.name,
                        sport: activeSport,
                        logo: team.logo_path || ''
                    }];
                } else if (!shouldAdd && exists) {
                    currentTeams = currentTeams.filter(t => t.name !== team.name);
                }
            };

            if (newPrefs.homeTeam !== undefined) toggleTeam(selectedMatch.homeTeam, newPrefs.homeTeam);
            if (newPrefs.awayTeam !== undefined) toggleTeam(selectedMatch.awayTeam, newPrefs.awayTeam);

            apiUpdates.favoriteTeams = currentTeams;
        }

        // 3. Favorite Leagues
        if (newPrefs.series !== undefined) {
            let currentLeagues = user?.preferences?.favoriteLeagues || [];
            // Handle League Object vs String
            const leagueName = typeof selectedMatch.league === 'string' ? selectedMatch.league : selectedMatch.league?.name;
            const leagueId = (selectedMatch as any).league_id || leagueName; // Fallback

            const exists = currentLeagues.some(l => l.name === leagueName);

            if (newPrefs.series && !exists && leagueName) {
                currentLeagues = [...currentLeagues, {
                    id: leagueId?.toString(),
                    name: leagueName,
                    sport: activeSport,
                    country: '', // Optional
                    logo: '' // Optional
                }];
            } else if (!newPrefs.series && exists) {
                currentLeagues = currentLeagues.filter(l => l.name !== leagueName);
            }

            apiUpdates.favoriteLeagues = currentLeagues;
        }

        // Send ONE API Call
        if (Object.keys(apiUpdates).length > 0) {
            dispatch(updateUserPreferences(apiUpdates))
                .unwrap()
                .then(() => { })
                .catch((err: any) => { });
        }

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
    useEffect(() => {
        dispatch(initSocketListeners());

        // Refresh scores immediately on mount (in case socket was already connected)
        dispatch(forceRefreshScores());

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                dispatch(forceRefreshScores());
                dispatch(loadUser()); // Sync user profile (notifications etc)
            }
        });

        return () => {
            subscription.remove();
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
                    setNotificationVisible(false);

                    let targetMatch = notification.matchSnapshot;

                    if (!targetMatch && notification.matchId) {
                        const liveMatch = (allLiveMatches as Match[]).find(m =>
                            m.id.toString() === notification.matchId?.toString()
                        );
                        if (liveMatch) {
                            targetMatch = liveMatch;
                        }
                    }

                    navigation.navigate('MatchDetail', {
                        matchId: notification.matchId,
                        sport: notification.sport || 'football',
                        match: targetMatch
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
