import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import BackButton from '@components/common/BackButton';
import { Ionicons } from '@expo/vector-icons';
import MatchCard from '@components/match/MatchCard';
import { useGetUpcomingMatchesQuery } from '@store/api/matchesApi';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllLiveMatches, clearAllMatches } from '@store/slices/liveMatchesSlice';
import { updatePreference, updateGlobalSetting } from '@store/slices/notificationsSlice';
import { mapMatchToUI } from '@utils/matchMappers';
import { Switch } from 'react-native';

import NotificationOptionsModal from '@components/notifications/NotificationOptionsModal';

const SettingToggle = ({ label, value, onToggle }) => {
    const theme = useTheme();
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
            <Text style={{ color: theme.colors.text, fontSize: 16 }}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: theme.colors.card, true: theme.colors.primary }}
                thumbColor={'#fff'}
            />
        </View>
    );
};

export default function NotificationSettingsScreen() {
    const navigation = useNavigation();
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const { width } = useWindowDimensions();

    const [activeTab, setActiveTab] = useState('Cricket');

    // State for Modal
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Get Preferences from Redux
    const preferences = useSelector(state => state.notifications.preferences || {});
    const globalSettings = useSelector(state => state.notifications.globalSettings || {});
    // Merge for easier access in UI
    const mergedPrefs = { ...preferences, global: globalSettings };

    const dispatch = useDispatch();

    // Premium Logic
    const user = useSelector(state => state.auth.user);
    const isPremium = user?.isPremium;

    const handlePremiumToggle = () => {
        if (!isPremium) {
            navigation.navigate('Premium');
        } else {
            // Already Premium - Toggle logic would go here
            Alert.alert("Premium Active", "You can manage these settings.");
        }
    };

    // Fetch Real Data (UPCOMING)
    const { data: apiData = [], isLoading, refetch } = useGetUpcomingMatchesQuery({
        sport: activeTab.toLowerCase()
    });
    const upcomingMatches = apiData;

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            // Clear current list to remove any stale/bad data
            // dispatch(clearAllMatches()); // No longer using live store for this screen
            // Re-fetch fresh data
            await refetch();
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    }, [refetch, dispatch]);

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

    const currentMatches = useMemo(() => {
        const targetSport = activeTab.toLowerCase();

        // 1. Map to UI format
        const mapped = upcomingMatches.map(mapMatchToUI);

        // 2. De-duplicate (Just in case API sends dupes)
        const uniqueMatches = [];
        const seenIds = new Set();
        mapped.forEach(match => {
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

    // Featured Matches Logic (Take top 5 from the SAME upcoming source)
    const featuredMatches = useMemo(() => {
        return upcomingMatches
            .map(mapMatchToUI)
            .slice(0, 5);
    }, [upcomingMatches]);

    const getTabColor = (tab) => {
        switch (tab.toLowerCase()) {
            case 'cricket': return theme.colors.cricket;
            case 'football': return theme.colors.football;
            case 'basketball': return theme.colors.basketball;
            default: return theme.colors.primary;
        }
    };

    const renderMatchItem = ({ item }) => {
        // Check if anything related to this match is subscribed
        const isSubscribed =
            preferences[`match_${item.id}`] ||
            preferences[`series_${item.league}`] ||
            preferences[`team_${item.homeTeam?.name}`] ||
            preferences[`team_${item.awayTeam?.name}`];

        return (
            <MatchCard
                sport={item.sport}
                status={item.status || 'Upcoming'}
                displayStatus={item.displayStatus}
                league={item.league}
                homeTeam={item.homeTeam}
                awayTeam={item.awayTeam}
                score={item.score || 'VS'}
                timer={item.timer}
                onPress={() => { }} // Maybe navigate to details
                onNotificationPress={() => handleBellPress(item)}
                isSubscribed={!!isSubscribed}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton color={theme.colors.text} style={styles.backBtn} />
                <Text style={styles.headerTitle}>Match Notifications</Text>
            </View>

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

            {/* Event Preferences Removed as per request */}
            <View style={styles.divider} />

            {/* --- NEW: Premium Email Section --- */}
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
                    value={isPremium}
                    onToggle={handlePremiumToggle}
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
                                    { borderColor: isPremium ? theme.colors.border : '#FFD700', borderWidth: isPremium ? 1 : 1 }
                                ]}
                                onPress={() => {
                                    if (isPremium) {
                                        handleBellPress(item);
                                    } else {
                                        navigation.navigate('Premium');
                                    }
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text style={[styles.featuredTeam, { color: theme.colors.text }]}>{item.homeTeam?.name || 'TBA'}</Text>
                                    <Text style={[styles.featuredVs, { color: theme.colors.textMuted }]}>vs</Text>
                                    <Text style={[styles.featuredTeam, { color: theme.colors.text }]}>{item.awayTeam?.name || 'TBA'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 10, color: theme.colors.textMuted }}>{item.league}</Text>
                                    {!isPremium && <Ionicons name="lock-closed" size={12} color="#FFD700" />}
                                </View>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                    />
                </View>

                <SettingToggle
                    label="Daily Match Digest"
                    value={isPremium}
                    onToggle={handlePremiumToggle}
                />
            </View>

            <View style={styles.divider} />
            <View style={styles.divider} />
            <Text style={[styles.sectionHeader, { paddingHorizontal: 16, marginTop: 16 }]}>Upcoming Matches</Text>

            {isLoading && currentMatches.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={currentMatches}
                    renderItem={renderMatchItem}
                    keyExtractor={item => `${item.sport}_${item.id}`}
                    extraData={[activeTab, preferences]} // Force re-render when prefs change
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="calendar-outline" size={48} color={theme.colors.textMuted} style={{ marginBottom: 12 }} />
                            <Text style={styles.emptyText}>No matches found.</Text>
                            <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 8 }}>Pull to refresh</Text>
                        </View>
                    }
                />
            )}

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

const makeStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backBtn: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: theme.fonts.bold,
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
        padding: theme.spacing.lg,
    },
    globalSettingsContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 16,
    },
    sectionHeader: {
        fontSize: 18,
        fontFamily: theme.fonts.bold,
        marginBottom: 8,
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
