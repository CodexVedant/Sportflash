import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import Sidebar from '@components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import { FilterPanel } from '@components/filter';
import TopBar from '@components/navigation/TopBar';
import { styles } from '@utils/style/MatchesScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { useMatchLogic } from '@hooks/useMatchLogic';
import MatchesList from '@components/match/MatchesList';
import { NotificationOptionsModal } from '@components/notifications';
import { Match } from '@app-types/models/match';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { updatePreference } from '@store/slices/notificationsSlice';
import { updateUserPreferences } from '@store/slices/authSlice'; // Needed for syncing
import { useToast } from '@context/ToastContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Matches'>;

export default function MatchesScreen({ navigation }: Props) {
    const dispatch = useAppDispatch();
    const { showToast } = useToast();
    const notificationPreferences = useAppSelector(state => state.notifications.preferences || {});
    const {
        activeSport, setActiveSport,
        activeTab, setActiveTab,
        sidebarVisible, setSidebarVisible,
        filterVisible, setFilterVisible,
        filters, setFilters,
        groupedMatches,
        availableLeagues,
        isLoading,
        apiError,
        user,
        refetch,
        // handleNotificationToggle, // We use local logic now
        handleApplyFilters
    } = useMatchLogic();

    const preferences = user?.preferences || {};

    // Notification Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    const handleBellPress = (match: Match) => {
        if (!user) {
            (navigation as any).navigate('Auth', { screen: 'Login' });
            return;
        }
        if (!user.isPremium) {
            showToast("Upgrade to Premium to enable match notifications", "info");
            (navigation as any).navigate('Premium');
            return;
        }
        setSelectedMatch(match);
        setModalVisible(true);
    };

    const handleSavePreferences = (newPrefs: any) => {
        if (!selectedMatch) return;

        // 1. Update Redux (Local)
        const updates = {
            [`match_${selectedMatch.id}`]: newPrefs.match,
            [`series_${selectedMatch.league}`]: newPrefs.series,
            [`team_${selectedMatch.homeTeam?.name}`]: newPrefs.homeTeam,
            [`team_${selectedMatch.awayTeam?.name}`]: newPrefs.awayTeam,
        };
        Object.entries(updates).forEach(([key, value]) => {
            dispatch(updatePreference({ key, value: Boolean(value) }));
        });

        // 2. Sync with Backend
        // Construct the preferences object expected by updateUserPreferences
        let apiUpdates: any = {};

        // Followed Matches
        const currentFollowed = user?.preferences?.followedMatches || [];
        let newFollowed = [...currentFollowed];
        const matchIdStr = String(selectedMatch.id);

        if (newPrefs.match) {
            if (!newFollowed.includes(matchIdStr)) newFollowed.push(matchIdStr);
        } else {
            newFollowed = newFollowed.filter(id => id !== matchIdStr);
        }
        apiUpdates.followedMatches = newFollowed;

        // Favorite Teams
        const currentTeams = user?.preferences?.favoriteTeams || [];
        // Map to just names or IDs for easier checking, but we need to respect object structure if it's objects
        // Assuming favoriteTeams is array of objects { _id, name, ... } or strings? 
        // Based on notificationsSlice it seems they can be strings or objects. Let's handle both or standardized.
        // Best approach: Filter out the specific teams being toggled, then add back if true.

        let newTeams = currentTeams.filter((t: any) => {
            const tName = typeof t === 'string' ? t : t.name;
            return tName !== selectedMatch.homeTeam?.name && tName !== selectedMatch.awayTeam?.name;
        });

        if (newPrefs.homeTeam && selectedMatch.homeTeam) {
            // Add Home Team - structure depends on backend. Safe bet: { name: ... } or just match existing pattern
            // Looking at HomeScreen logic (if available) would be ideal but let's assume { name: ... } object structure
            newTeams.push({ name: selectedMatch.homeTeam.name, id: selectedMatch.homeTeam.id || selectedMatch.homeTeam._id });
        }
        if (newPrefs.awayTeam && selectedMatch.awayTeam) {
            newTeams.push({ name: selectedMatch.awayTeam.name, id: selectedMatch.awayTeam.id || selectedMatch.awayTeam._id });
        }
        apiUpdates.favoriteTeams = newTeams;

        // Favorite Leagues (Series)
        const currentLeagues = user?.preferences?.favoriteLeagues || [];
        let newLeagues = currentLeagues.filter((l: any) => {
            const lName = typeof l === 'string' ? l : l.name;
            return lName !== selectedMatch.league;
        });

        if (newPrefs.series && selectedMatch.league) {
            newLeagues.push({ name: selectedMatch.league });
        }
        apiUpdates.favoriteLeagues = newLeagues;

        dispatch(updateUserPreferences(apiUpdates));

        showToast("Preferences updated", "success");
    };

    const SPORT_TABS = [
        { id: 'cricket', label: 'Cricket', icon: 'baseball-outline' },
        { id: 'football', label: 'Football', icon: 'football-outline' },
        { id: 'basketball', label: 'Basketball', icon: 'basketball-outline' },
    ];

    const STATUS_TABS = ['Live', 'Upcoming', 'Results'];

    const handleClearFilters = () => {
        setActiveSport('all');
        handleApplyFilters({
            sport: 'all',
            status: 'all',
            league: 'all',
            dateRange: { start: null, end: null },
        });
    };

    // Calculate current preferences for the modal
    const currentModalParams = {
        [`match_${selectedMatch?.id}`]: (user?.preferences?.followedMatches || []).includes(String(selectedMatch?.id)),
        // Add others if we want accurate initial state for teams/leagues from user object
        // For now using the simple one passed
    };

    return (
        <SafeAreaView style={styles.container}>
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

            <NotificationOptionsModal
                visible={modalVisible}
                match={selectedMatch}
                onClose={() => setModalVisible(false)}
                onSave={handleSavePreferences}
                initialPreferences={{
                    // Use user.preferences for source of truth or Redux notification slice? 
                    // Usually NotificationSlice is better for UI instant updates, but User object is persistence.
                    // Let's use logic from MatchesTab/Home
                    [`match_${selectedMatch?.id}`]: (user?.preferences?.followedMatches || []).includes(String(selectedMatch?.id))
                }}
            />

            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuBtn}>
                        <Ionicons name="menu" size={28} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Matches</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('UpcomingMatches', {})}
                        style={[styles.iconBtn, { marginRight: 8 }]}
                    >
                        <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.iconBtn}>
                        <Ionicons name="options-outline" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Sport Tabs */}
            <TopBar
                activeTab={activeSport}
                onTabChange={setActiveSport}
                tabs={SPORT_TABS}
            />

            {/* Status Tabs */}
            <View style={styles.tabsContainer}>
                {STATUS_TABS.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content List */}
            <MatchesList
                isLoading={isLoading}
                apiError={apiError}
                groupedMatches={groupedMatches}
                activeTab={activeTab}
                activeSport={activeSport}
                onRetry={refetch}
                onClearFilters={handleClearFilters}
                onNotificationToggle={handleBellPress}
                notificationPreferences={notificationPreferences}
            />

            {/* Filter Panel */}
            <FilterPanel
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={handleApplyFilters}
                initialFilters={filters}
                availableLeagues={availableLeagues}
            />
        </SafeAreaView>
    );
}

