import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import MatchCard from '@components/match/MatchCard';
import Sidebar from '@components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import { SkeletonList, EmptyState, NetworkError } from '@components/common';
import { FilterPanel } from '@components/filter';
import { NotificationBell, NotificationPanel } from '@components/notifications';
import { AuthContext } from '@context/AuthContext';
import TopBar from '@components/navigation/TopBar';
import { useGetLiveMatchesQuery } from '@store/api/matchesApi';

export default function MatchesScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const [activeSport, setActiveSport] = useState('all');
    const [activeTab, setActiveTab] = useState('Live');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [filters, setFilters] = useState({
        sport: 'all',
        status: 'all',
        league: 'all',
        dateRange: { start: null, end: null },
    });

    // Fetch matches using RTK Query
    const { data: allMatches = [], isLoading, error: apiError, refetch } = useGetLiveMatchesQuery();
    const [filteredMatches, setFilteredMatches] = useState([]);

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
        { id: 'all', label: 'All Sports', icon: 'globe-outline' },
        { id: 'cricket', label: 'Cricket', icon: 'baseball-outline' },
        { id: 'football', label: 'Football', icon: 'football-outline' },
        { id: 'basketball', label: 'Basketball', icon: 'basketball-outline' },
    ];

    const STATUS_TABS = ['Live', 'Upcoming', 'Results'];

    // Filter matches based on sport and status
    useEffect(() => {
        let matches = [...allMatches];

        // Filter by sport
        if (activeSport !== 'all') {
            matches = matches.filter(match => match.sport?.toLowerCase() === activeSport);
        }

        // Filter by status
        if (activeTab === 'Live') {
            matches = matches.filter(match => match.status === 'live');
        } else if (activeTab === 'Upcoming') {
            matches = matches.filter(match => match.status === 'upcoming');
        } else if (activeTab === 'Results') {
            matches = matches.filter(match => match.status === 'finished');
        }

        // Apply additional filters
        if (filters.league !== 'all') {
            matches = matches.filter(match => match.league?.toLowerCase().includes(filters.league.toLowerCase()));
        }

        setFilteredMatches(matches);
    }, [allMatches, activeSport, activeTab, filters]);

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        setFilterVisible(false);
    };

    const renderMatchItem = ({ item }) => (
        <View style={{ marginBottom: 16 }}>
            <MatchCard
                sport={item.sport}
                status={item.status}
                league={item.league}
                homeTeam={item.homeTeam}
                awayTeam={item.awayTeam}
                score={item.status === 'finished' || item.status === 'live' ?
                    (item.homeTeam.score && item.awayTeam.score ? `${item.homeTeam.score} - ${item.awayTeam.score}` : 'vs')
                    : null
                }
                timer={
                    item.sport === 'cricket'
                        ? (item.cricketData?.overs ? `${item.cricketData.overs} Overs` : '')
                        : item.sport === 'basketball'
                            ? (item.basketballData?.quarter ? `Q${item.basketballData.quarter}` : '')
                            : item.currentMinute || (item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')
                }
                onPress={() => navigation.navigate('MatchDetail', { match: item })}
            />
        </View>
    );

    const unreadCount = notifications.filter(n => !n.read).length;

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
                    <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.iconBtn}>
                        <Ionicons name="options-outline" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
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

            {/* Content */}
            {isLoading ? (
                <SkeletonList type="match" count={5} />
            ) : apiError ? (
                <NetworkError onRetry={refetch} />
            ) : (
                <FlatList
                    data={filteredMatches}
                    keyExtractor={item => item._id}
                    renderItem={renderMatchItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <EmptyState
                            variant="noMatches"
                            message={`No ${activeTab.toLowerCase()} matches found for ${activeSport === 'all' ? 'all sports' : activeSport}`}
                            actionLabel="Clear Filters"
                            onAction={() => {
                                setActiveSport('all');
                                setFilters({
                                    sport: 'all',
                                    status: 'all',
                                    league: 'all',
                                    dateRange: { start: null, end: null },
                                });
                            }}
                        />
                    }
                />
            )}

            {/* Filter Panel */}
            <FilterPanel
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={handleApplyFilters}
                initialFilters={filters}
            />

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
    iconBtn: {
        padding: 8,
    },
    menuBtn: {
        marginRight: 16,
    },
    tabsContainer: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        gap: 12,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    activeTab: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    tabText: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
    },
    activeTabText: {
        color: '#fff',
    },
    listContent: {
        padding: theme.spacing.lg,
        paddingBottom: 100,
    },
});

