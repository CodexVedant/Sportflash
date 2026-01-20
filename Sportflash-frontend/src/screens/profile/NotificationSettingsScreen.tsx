import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions, ActivityIndicator, TouchableOpacity, RefreshControl, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MatchCard from '@components/match/MatchCard';
import { useGetUpcomingMatchesQuery } from '@store/api/matchesApi';
import { useUpdatePreferencesMutation } from '@store/api/usersApi';
import { useToast } from '@context/ToastContext';
import { useAppSelector, useAppDispatch } from '@hooks/redux';
import { updatePreference, updateGlobalSetting } from '@store/slices/notificationsSlice';
import { mapMatchToUI } from '@utils/matchMappers';
import { NotificationOptionsModal } from '@components/notifications';
import { Match } from '@app-types/models/match';
import { Theme } from '@utils/theme';

interface SettingToggleProps {
    label: string;
    value: boolean;
    onToggle: (val: boolean) => void;
}

const SettingToggle: React.FC<SettingToggleProps> = ({ label, value, onToggle }) => {
    const theme = useTheme();
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
            <Text style={{ color: theme.colors.text, fontSize: 16 }}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: theme.colors.surface, true: theme.colors.primary }} // 'card' in JS -> 'surface' or check theme
                thumbColor={'#fff'}
            />
        </View>
    );
};

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';

export default function NotificationSettingsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const theme = useTheme();
    const { showToast } = useToast();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const { width } = useWindowDimensions();

    const [activeTab, setActiveTab] = useState('Cricket');

    // State for Modal
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Get Preferences from Redux
    const preferences = useAppSelector(state => state.notifications.preferences || {});
    const globalSettings = useAppSelector(state => state.notifications.globalSettings || {});

    const dispatch = useAppDispatch();

    // Premium Logic
    const user = useAppSelector(state => state.auth.user);
    const isPremium = user?.isPremium;

    const handlePremiumToggle = (key: string, currentValue: boolean) => {
        if (!isPremium) {
            navigation.navigate('Premium');
            return;
        }

        const newValue = !currentValue;

        // 1. Update Redux (Optimistic)
        dispatch(updatePreference({ key: 'placeholder', value: false })); // Dummy call if needed, but we need updateGlobalSetting
        // We need to import updateGlobalSetting from slice
        // dispatch(updateGlobalSetting({ key, value: newValue })); 
        // NOTE: updatePreference in slice is generic, but let's check slice again. 
        // slice has updateGlobalSetting. Ideally dispatch that.

        // 2. Sync with Backend
        // We construct a partial update object.
        // The backend expects "globalSettings" object inside preferences.
        // But our useUpdatePreferencesMutation usually takes a flattened object or structured?
        // Let's look at authController.js or existing usages.
        // HomeScreen sends: { favoriteTeams: [], ... }
        // We likely need to send { globalSettings: { ...oldSettings, [key]: newValue } }

        const newGlobalSettings = { ...globalSettings, [key]: newValue };

        updatePreferencesApi({ globalSettings: newGlobalSettings })
            .unwrap()
            .then(() => {
                showToast("Settings saved", "success");
                // Manually update local state if not auto-synced by mutation result
                // (The slice matcher should handle it if mutation returns user object)
            })
            .catch(() => showToast("Failed to save settings", "error"));
    };

    const [updatePreferencesApi] = useUpdatePreferencesMutation();

    // Fetch Real Data (UPCOMING)
    const { data: apiData = [], isLoading, refetch } = useGetUpcomingMatchesQuery({
        sport: activeTab.toLowerCase()
    });

    const upcomingMatches = apiData; // Assuming apiData is Match[] (matchesApi transformResponse handles this)

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refetch();
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    }, [refetch]);

    const handleBellPress = (match: Match) => {
        if (!isPremium) {
            navigation.navigate('Premium');
            return;
        }
        setSelectedMatch(match);
        setModalVisible(true);
    };

    const handleSavePreferences = (newPrefs: any) => {
        if (!selectedMatch) return;

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
        const activeSport = activeTab.toLowerCase();

        // 1. Followed Matches
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

            const toggleTeam = (team: any, shouldAdd: boolean) => {
                if (!team || !team.name) return;
                const exists = currentTeams.some(t => t.name === team.name);

                if (shouldAdd && !exists) {
                    currentTeams = [...currentTeams, {
                        id: team.id?.toString() || team.name,
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
            const leagueName = typeof selectedMatch.league === 'string' ? selectedMatch.league : selectedMatch.league?.name;
            const leagueId = (selectedMatch as any).league_id || leagueName;

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

        if (Object.keys(apiUpdates).length > 0) {
            updatePreferencesApi(apiUpdates)
                .unwrap()
                .then(() => console.log('✅ Preferences synced to backend (Settings Screen)'))
                .catch((err: any) => console.error('❌ Failed to sync preferences:', err));
        }

        showToast("Notification preferences updated", "success");
    };

    const currentMatches = useMemo(() => {
        const targetSport = activeTab.toLowerCase();

        // 1. Map to match UI structure if needed (assuming API returns correct structure already or matchesApi transforms it)
        // If mapMatchToUI is idempotent or needed, use it. strict typing suggests keeping as Match
        // checking mapMatchToUI implementation might be needed. assuming direct use for now or consistent with HomeScreen.

        // 2. De-duplicate
        const uniqueMatches: Match[] = [];
        const seenIds = new Set();
        upcomingMatches.forEach(match => {
            // ensure id is string/number consistent
            const uniqueKey = match.id || `${match.homeTeam?.name}_${match.awayTeam?.name}`;
            if (!seenIds.has(uniqueKey)) {
                seenIds.add(uniqueKey);
                uniqueMatches.push(match);
            }
        });

        // 3. Filter by Tab
        return uniqueMatches.filter(match => {
            if (!match.sport || match.sport.toLowerCase().trim() !== targetSport) {
                return false;
            }
            return true;
        });
    }, [activeTab, upcomingMatches]);

    // Featured Matches Logic
    const featuredMatches = useMemo(() => {
        return upcomingMatches.slice(0, 5);
    }, [upcomingMatches]);

    const getTabColor = (tab: string) => {
        switch (tab.toLowerCase()) {
            case 'cricket': return '#2196F3'; // Hardcoded or from theme if available
            case 'football': return '#4CAF50';
            case 'basketball': return '#FF9800';
            default: return theme.colors.primary;
        }
    };

    const renderMatchItem = ({ item }: { item: Match }) => {
        // Check if anything related to this match is subscribed
        const isSubscribed =
            preferences[`match_${item.id}`] ||
            preferences[`series_${item.league}`] ||
            preferences[`team_${item.homeTeam?.name}`] ||
            preferences[`team_${item.awayTeam?.name}`];

        return (
            <View style={{ marginBottom: 10 }}>
                <MatchCard
                    {...item}
                    league={typeof item.league === 'string' ? item.league : (item.league as any)?.name}
                    onPress={() => { }} // Maybe navigate to details
                    onNotificationPress={() => handleBellPress(item)}
                    isSubscribed={!!isSubscribed}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Match Notifications</Text>
            </View>

            {/* Main List with Header Component for Scrollability */}
            <FlatList
                data={isLoading ? [] : currentMatches}
                renderItem={renderMatchItem}
                keyExtractor={item => `${item.sport}_${item.id}`}
                extraData={[activeTab, preferences]}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
                ListHeaderComponent={
                    <>
                        {/* Tabs */}
                        <View style={styles.tabContainer}>
                            {['Cricket', 'Football', 'Basketball'].map(tab => (
                                <TouchableOpacity
                                    key={tab}
                                    style={[
                                        styles.tab,
                                        activeTab === tab && { borderBottomColor: getTabColor(tab), borderBottomWidth: 3 }
                                    ]}
                                    onPress={() => setActiveTab(tab)}
                                >
                                    <Text style={[
                                        styles.tabText,
                                        activeTab === tab && { color: getTabColor(tab), fontWeight: 'bold' }
                                    ]}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.divider} />

                        {/* Premium Email Section */}
                        <View style={styles.globalSettingsContainer}>
                            <View style={[styles.sectionHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                                <Text style={styles.sectionTitle}>Premium Email Alerts 📧</Text>
                                {isPremium ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" style={{ marginRight: 4 }} />
                                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#4CAF50' }}>ACCESS GRANTED</Text>
                                    </View>
                                ) : (
                                    <View style={{ backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#000' }}>PRO</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={{ color: '#aaa', fontSize: 12, marginBottom: 15 }}>
                                Get email summaries for big matches and daily digests.
                            </Text>

                            <SettingToggle
                                label="Upcoming Big Matches"
                                value={!!globalSettings['email_big_matches']}
                                onToggle={() => handlePremiumToggle('email_big_matches', !!globalSettings['email_big_matches'])}
                            />

                            {/* Horizontal Featured Matches List */}
                            <View style={{ marginTop: 12, marginBottom: 8 }}>
                                <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginBottom: 8, fontStyle: 'italic' }}>
                                    {isPremium
                                        ? "Tap to enable priority alerts for these matches:"
                                        : "Upgrade to unlock alerts for these featured matches:"}
                                </Text>
                                <FlatList
                                    horizontal
                                    data={featuredMatches}
                                    keyExtractor={(item) => `featured_${item.id}`}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[
                                                styles.featuredCard,
                                                { borderColor: isPremium ? theme.colors.border : '#FFD700', borderWidth: 1 }
                                            ]}
                                            onPress={() => {
                                                if (isPremium) {
                                                    handleBellPress(item);
                                                } else {
                                                    Alert.alert("Premium", "Premium subscription feature coming soon!");
                                                    // navigation.navigate('Premium');
                                                }
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <Text style={[styles.featuredTeam, { color: theme.colors.text }]}>{item.homeTeam?.name || 'TBA'}</Text>
                                                <Text style={[styles.featuredVs, { color: theme.colors.textMuted }]}>vs</Text>
                                                <Text style={[styles.featuredTeam, { color: theme.colors.text }]}>{item.awayTeam?.name || 'TBA'}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 10, color: theme.colors.textMuted }}>{typeof item.league === 'string' ? item.league : (item.league as any)?.name}</Text>
                                                {!isPremium && <Ionicons name="lock-closed" size={12} color="#FFD700" />}
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                                />
                            </View>

                            <SettingToggle
                                label="Daily Match Digest"
                                value={!!globalSettings['email_daily_digest']}
                                onToggle={() => handlePremiumToggle('email_daily_digest', !!globalSettings['email_daily_digest'])}
                            />
                        </View>

                        <View style={styles.divider} />
                        <Text style={[styles.sectionHeader, { paddingHorizontal: 16, marginTop: 16 }]}>Upcoming Matches</Text>

                        {isLoading && currentMatches.length === 0 && (
                            <View style={[styles.centerContainer, { padding: 40 }]}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                            </View>
                        )}
                    </>
                }
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="calendar-outline" size={48} color={theme.colors.textMuted} style={{ marginBottom: 12 }} />
                            <Text style={styles.emptyText}>No matches found.</Text>
                            <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 8 }}>Pull to refresh</Text>
                        </View>
                    ) : null
                }
            />

            <NotificationOptionsModal
                visible={modalVisible}
                match={selectedMatch}
                onClose={() => setModalVisible(false)}
                onSave={handleSavePreferences}
                initialPreferences={preferences}
            />
        </SafeAreaView>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing?.lg || 16,
        paddingVertical: theme.spacing?.md || 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backBtn: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold', // theme.fonts.bold
        color: theme.colors.text,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
    },
    tabText: {
        fontSize: 16,
        color: theme.colors.textMuted,
    },
    listContent: {
        padding: theme.spacing?.lg || 16,
    },
    globalSettingsContainer: {
        paddingHorizontal: theme.spacing?.lg || 16,
        paddingTop: 16,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: theme.colors.text,
    },
    sectionTitle: { // Mapping sectionTitle used in logic to this style or sectionHeader
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 8,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontSize: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    featuredCard: {
        width: 200,
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    featuredTeam: {
        fontSize: 12,
        fontWeight: 'bold',
        maxWidth: 80,
    },
    featuredVs: {
        fontSize: 10,
        fontStyle: 'italic',
    }
});
