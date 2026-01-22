import React, { useState, useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@hooks/redux';
import { useGetLiveMatchesQuery, useGetUpcomingMatchesQuery, useGetFinishedMatchesQuery } from '@store/api/matchesApi';
import { updateUserPreferences } from '@store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '@context/ToastContext';

export const useMatchLogic = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { user } = useAppSelector(state => state.auth);
    const { showToast } = useToast();

    // State
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

    // API Calls
    const { data: liveMatches = [], isLoading: isLoadingLive, error: liveError, refetch: refetchLive } = useGetLiveMatchesQuery(undefined);
    const { data: upcomingMatches = [], isLoading: isLoadingUpcoming, error: upcomingError, refetch: refetchUpcoming } = useGetUpcomingMatchesQuery({});
    const {
        data: finishedMatches = [],
        isLoading: isLoadingFinished,
        error: finishedError,
        refetch: refetchFinished
    } = useGetFinishedMatchesQuery(
        activeTab === 'Results' ? { sport: activeSport !== 'all' ? activeSport : undefined, days: 3 } : undefined,
        { skip: activeTab !== 'Results' }
    );

    // Derived Data: Current Data Source
    const allMatches = useMemo(() => {
        if (activeTab === 'Upcoming') return upcomingMatches;
        if (activeTab === 'Results') return finishedMatches;
        return liveMatches;
    }, [activeTab, upcomingMatches, liveMatches, finishedMatches]);

    // Derived Data: Current Loading/Error State
    const isLoading = activeTab === 'Upcoming' ? isLoadingUpcoming : (activeTab === 'Results' ? isLoadingFinished : isLoadingLive);
    const apiError = activeTab === 'Upcoming' ? upcomingError : (activeTab === 'Results' ? finishedError : liveError);
    const refetch = activeTab === 'Upcoming' ? refetchUpcoming : (activeTab === 'Results' ? refetchFinished : refetchLive);

    // Derived Data: Filtered Matches
    const filteredMatches = useMemo(() => {
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
        }

        // Filter by League
        if (filters.league !== 'all') {
            matches = matches.filter(match => {
                const leagueName = typeof match.league === 'string' ? match.league : match.league?.name;
                return leagueName?.toLowerCase().includes(filters.league.toLowerCase());
            });
        }

        return matches;
    }, [allMatches, activeSport, activeTab, filters]);

    // Derived Data: Grouped Matches
    const groupedMatches = useMemo(() => {
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

    // Derived Data: Available Leagues for Filter
    const availableLeagues = useMemo(() => {
        let sourceMatches = Array.isArray(allMatches) ? allMatches : [];
        if (activeSport !== 'all') {
            sourceMatches = sourceMatches.filter(m => m.sport?.toLowerCase() === activeSport);
        }

        const leaguesMap = new Map();
        sourceMatches.forEach(match => {
            const name = match.league?.name || match.league || 'Unknown League';
            if (!leaguesMap.has(name)) {
                leaguesMap.set(name, { id: name, name });
            }
        });

        return Array.from(leaguesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [allMatches, activeSport]);

    // Handlers
    const handleNotificationToggle = async (matchId: string) => {
        if (!user) {
            (navigation as any).navigate('Auth', { screen: 'Login' });
            return;
        }

        if (!user.isPremium) {
            showToast("Upgrade to Premium to enable match notifications", "info");
            (navigation as any).navigate('Premium');
            return;
        }

        const currentFollowed = user.preferences?.followedMatches || [];
        const isFollowed = currentFollowed.includes(matchId);

        let newFollowed;
        if (isFollowed) {
            newFollowed = currentFollowed.filter((id: string) => id !== matchId);
        } else {
            newFollowed = [...currentFollowed, matchId];
        }

        try {
            await dispatch(updateUserPreferences({ followedMatches: newFollowed })).unwrap();
        } catch (error) {
            console.error('Failed to update matched preference:', error);
        }
    };

    const handleApplyFilters = (newFilters: any) => {
        setFilters(newFilters);
        setFilterVisible(false);
    };

    return {
        // State
        activeSport, setActiveSport,
        activeTab, setActiveTab,
        sidebarVisible, setSidebarVisible,
        filterVisible, setFilterVisible,
        filters, setFilters,

        // Data
        groupedMatches,
        availableLeagues,
        isLoading,
        apiError,
        user,

        // Handlers
        refetch,
        handleNotificationToggle,
        handleApplyFilters
    };
};
