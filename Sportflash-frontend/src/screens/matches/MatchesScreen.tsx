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
import { useSelector } from 'react-redux';
import TopBar from '@components/navigation/TopBar';
import { useGetLiveMatchesQuery, useGetUpcomingMatchesQuery, useGetFinishedMatchesQuery } from '@store/api/matchesApi';
import { styles } from '@utils/style/MatchesScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { useAppSelector, useAppDispatch } from '@hooks/redux';
import { updateUserPreferences } from '@store/slices/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Matches'>;

export default function MatchesScreen({ navigation }: Props) {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const [activeSport, setActiveSport] = useState('cricket');
    const [activeTab, setActiveTab] = useState('Live');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [filters, setFilters] = useState({
        sport: 'all',
        status: 'all',
        league: 'all',
        dateRange: { start: null, end: null },
    });

    // Fetch all live matches (including cricket from AllSportsAPI)
    const { data: allLiveMatches = [], isLoading: isLoadingLive, error: liveError, refetch: refetchLive } = useGetLiveMatchesQuery(
        undefined
    );

    const liveMatches = allLiveMatches;

    // Fetch all upcoming matches (including cricket)
    const { data: allUpcomingMatches = [], isLoading: isLoadingUpcoming, error: upcomingError, refetch: refetchUpcoming } = useGetUpcomingMatchesQuery({});

    const upcomingMatches = allUpcomingMatches;

    // Fetch finished matches (Results)
    const { data: allFinishedMatches = [], isLoading: isLoadingFinished, error: finishedError, refetch: refetchFinished } = useGetFinishedMatchesQuery(
        activeTab === 'Results' ? { sport: activeSport !== 'all' ? activeSport : undefined, days: 3 } : undefined,
        { skip: activeTab !== 'Results' }
    );

    const finishedMatches = allFinishedMatches;

    // Determine which data to use - memoized to prevent infinite loops
    const allMatches = React.useMemo(() => {
        if (activeTab === 'Upcoming') return upcomingMatches;
        if (activeTab === 'Results') return finishedMatches;
        return liveMatches;
    }, [activeTab, upcomingMatches, liveMatches, finishedMatches]);

    const isLoading = activeTab === 'Upcoming' ? isLoadingUpcoming : (activeTab === 'Results' ? isLoadingFinished : isLoadingLive);
    const apiError = activeTab === 'Upcoming' ? upcomingError : (activeTab === 'Results' ? finishedError : liveError);
    const refetch = activeTab === 'Upcoming' ? refetchUpcoming : (activeTab === 'Results' ? refetchFinished : refetchLive);

    // Filter matches based on sport and status - use useMemo instead of useEffect
    const filteredMatches = React.useMemo(() => {
        let matches = Array.isArray(allMatches) ? [...allMatches] : [];

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
            // Already filtered by backend, but ensure status check if needed
            // matches = matches.filter(match => match.status === 'finished');
            // Backend returns finished, so we just take them.
        }

        // Apply additional filters
        if (filters.league !== 'all') {
            matches = matches.filter(match => {
                const leagueName = typeof match.league === 'string' ? match.league : match.league?.name;
                return leagueName?.toLowerCase().includes(filters.league.toLowerCase());
            });
        }

        return matches;
    }, [allMatches, activeSport, activeTab, filters]);

    const SPORT_TABS = [
        { id: 'cricket', label: 'Cricket', icon: 'baseball-outline' },
        { id: 'football', label: 'Football', icon: 'football-outline' },
        { id: 'basketball', label: 'Basketball', icon: 'basketball-outline' },
    ];

    const STATUS_TABS = ['Live', 'Upcoming', 'Results'];

    // Extract unique leagues from current matches for filter
    const availableLeagues = React.useMemo(() => {
        let sourceMatches = Array.isArray(allMatches) ? allMatches : [];
        if (activeSport !== 'all') {
            sourceMatches = sourceMatches.filter(m => m.sport?.toLowerCase() === activeSport);
        }

        const leaguesMap = new Map();
        sourceMatches.forEach(match => {
            const id = match.league?.id || match.league || 'unknown';
            const name = match.league?.name || match.league || 'Unknown League';
            if (!leaguesMap.has(name)) {
                leaguesMap.set(name, { id: name, name }); // Use name as ID for easier string comparison
            }
        });

        return Array.from(leaguesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [allMatches, activeSport]);

    const handleNotificationToggle = async (matchId: string) => {
        if (!user) {
            (navigation as any).navigate('Auth', { screen: 'Login' });
            return;
        }

        const currentFollowed = user.preferences?.followedMatches || [];
        const isFollowed = currentFollowed.includes(matchId);

        let newFollowed;
        if (isFollowed) {
            newFollowed = currentFollowed.filter(id => id !== matchId);
        } else {
            newFollowed = [...currentFollowed, matchId];
        }

        try {
            // Optimistic update locally could be done if we had a local slice for this, 
            // but for now we wait for API response which updates user in Redux.
            await dispatch(updateUserPreferences({ followedMatches: newFollowed })).unwrap();
        } catch (error) {
            console.error('Failed to update matched preference:', error);
        }
    };

    const handleApplyFilters = (newFilters: any) => {
        setFilters(newFilters);
        setFilterVisible(false);
    };

    // Group matches by league
    const groupedMatches = React.useMemo(() => {
        if (!filteredMatches.length) return [];

        const groups = filteredMatches.reduce((acc, match) => {
            const leagueName = (typeof match.league === 'string' ? match.league : match.league?.name) || 'Others';
            if (!acc[leagueName]) {
                acc[leagueName] = [];
            }
            acc[leagueName].push(match);
            return acc;
        }, {} as Record<string, any[]>);

        return Object.keys(groups).sort().map(league => ({
            title: league,
            data: groups[league]
        }));
    }, [filteredMatches]);

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    const renderMatchItem = React.useCallback(({ item }: { item: any }) => {
        const isFinished = item.status === 'finished' || item.status === 'FT' || item.status === 'Ended';

        const matchId = (item.id || item._id)?.toString();
        const followed = user?.preferences?.followedMatches || [];
        const isSubscribed = followed.includes(matchId);

        return (
            <View style={{ marginBottom: 16 }}>
                {item.sport === 'basketball' ? (
                    <BasketballMatchCard
                        match={item}
                        onPress={() => navigation.navigate('MatchDetail', { match: item })}
                        onNotificationPress={!isFinished ? () => handleNotificationToggle(matchId) : undefined}
                        isSubscribed={isSubscribed}
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
                            : undefined
                        }
                        timer={
                            item.sport === 'cricket'
                                ? (item.cricketData?.overs ? `${item.cricketData.overs} Overs` : '')
                                : (item.sport === 'basketball' && typeof item.timer === 'string' && item.timer.includes('Quarter'))
                                    ? item.timer
                                    : item.currentMinute || (item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')
                        }
                        match={item}
                        onPress={() => navigation.navigate('MatchDetail', { match: item })}
                        onNotificationPress={!isFinished ? () => handleNotificationToggle(matchId) : undefined}
                        isSubscribed={isSubscribed}
                    />
                )}
            </View>
        )
    }, [navigation, user, handleNotificationToggle]);



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

            {/* Content */}
            {isLoading ? (
                <SkeletonList type="match" count={5} />
            ) : apiError ? (
                <NetworkError onRetry={refetch as any} />
            ) : (
                <SectionList
                    style={styles.scrollContainer}
                    sections={groupedMatches}
                    keyExtractor={item => item._id || item.id}
                    renderItem={renderMatchItem}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={styles.listContent}
                    stickySectionHeadersEnabled={true}
                    showsVerticalScrollIndicator={false}
                    extraData={user?.preferences?.followedMatches} // More specific dependency
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
                availableLeagues={availableLeagues}
            />
        </SafeAreaView>
    );
}

