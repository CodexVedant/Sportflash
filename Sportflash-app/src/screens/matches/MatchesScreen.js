import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import MatchCard from '@components/match/MatchCard';
import BasketballMatchCard from '@components/match/BasketballMatchCard';
import Sidebar from '@components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import { SkeletonList, EmptyState, NetworkError } from '@components/common';
import { FilterPanel } from '@components/filter';
import { NotificationBell, NotificationPanel } from '@components/notifications';
import { useSelector } from 'react-redux';
import TopBar from '@components/navigation/TopBar';
import { useGetLiveMatchesQuery } from '@store/api/matchesApi';
import { styles } from '@utils/style/MatchesScreen.styles';

export default function MatchesScreen({ navigation }) {
    const { user } = useSelector(state => state.auth);
    const [activeSport, setActiveSport] = useState('cricket');
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

    // Group matches by league
    const groupedMatches = React.useMemo(() => {
        if (!filteredMatches.length) return [];

        const groups = filteredMatches.reduce((acc, match) => {
            const leagueName = match.league || 'Others';
            if (!acc[leagueName]) {
                acc[leagueName] = [];
            }
            acc[leagueName].push(match);
            return acc;
        }, {});

        return Object.keys(groups).sort().map(league => ({
            title: league,
            data: groups[league]
        }));
    }, [filteredMatches]);

    const renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    const renderMatchItem = ({ item }) => (
        <View style={{ marginBottom: 16 }}>
            {item.sport === 'basketball' ? (
                <BasketballMatchCard
                    match={item}
                    onPress={() => navigation.navigate('MatchDetail', { match: item })}
                />
            ) : (
                <MatchCard
                    sport={item.sport}
                    status={item.status}
                    displayStatus={item.displayStatus}
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
                            : (item.sport === 'basketball' && typeof item.timer === 'string' && item.timer.includes('Quarter'))
                                ? item.timer
                                : item.currentMinute || (item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')
                    }
                    onPress={() => navigation.navigate('MatchDetail', { match: item })}
                />
            )}
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
                <SectionList
                    sections={groupedMatches}
                    keyExtractor={item => item._id}
                    renderItem={renderMatchItem}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={styles.listContent}
                    stickySectionHeadersEnabled={true}
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
