import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGetUpcomingMatchesQuery } from '@store/api/matchesApi';
import { styles } from '@utils/style/UpcomingMatchesScreen.styles';
import {
    formatMatchDateTime,
    groupMatchesByDate,
    filterMatchesBySport,
    getNextSevenDays,
    isMatchSoon,
    getMatchCountdown
} from '@utils/script/UpcomingMatchesScreen.helpers';
import { theme } from '@utils/theme';

export default function UpcomingMatchesScreen({ navigation }) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSport, setSelectedSport] = useState('all');

    const dates = useMemo(() => getNextSevenDays(), []);

    const { data: matches, isLoading, error, refetch } = useGetUpcomingMatchesQuery({
        sport: selectedSport === 'all' ? undefined : selectedSport,
        date: selectedDate
    });

    const filteredMatches = useMemo(() => {
        if (!matches) return [];
        return filterMatchesBySport(matches, selectedSport);
    }, [matches, selectedSport]);

    const groupedMatches = useMemo(() => {
        return groupMatchesByDate(filteredMatches);
    }, [filteredMatches]);

    const sportFilters = [
        { label: 'All', value: 'all', icon: 'apps' },
        { label: 'Football', value: 'football', icon: 'football' },
        { label: 'Basketball', value: 'basketball', icon: 'basketball' },
        { label: 'Cricket', value: 'cricket', icon: 'tennisball' },
    ];

    const renderMatchCard = (match) => {
        const { date, time } = formatMatchDateTime(match.date || match.startTime);
        const isSoon = isMatchSoon(match.date || match.startTime);
        const countdown = isSoon ? getMatchCountdown(match.date || match.startTime) : null;

        return (
            <TouchableOpacity
                key={match.id}
                style={styles.matchCard}
                onPress={() => navigation.navigate('MatchDetail', { match })}
                activeOpacity={0.7}
            >
                {/* Sport Badge */}
                <View style={styles.sportBadge}>
                    <Text style={styles.sportBadgeText}>{match.sport}</Text>
                </View>

                {/* Match Header */}
                <View style={styles.matchHeader}>
                    <Text style={styles.leagueName} numberOfLines={1}>
                        {match.league || 'League'}
                    </Text>
                    <Text style={styles.matchTime}>{time}</Text>
                </View>

                {/* Teams */}
                <View style={styles.matchContent}>
                    {/* Home Team */}
                    <View style={styles.teamContainer}>
                        {match.homeTeam?.logo ? (
                            <Image
                                source={{ uri: match.homeTeam.logo }}
                                style={styles.teamLogo}
                            />
                        ) : (
                            <View style={[styles.teamLogo, { backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
                                <Ionicons name="shield" size={24} color={theme.colors.textMuted} />
                            </View>
                        )}
                        <Text style={styles.teamName} numberOfLines={2}>
                            {match.homeTeam?.name || 'Home Team'}
                        </Text>
                        {isSoon && countdown && (
                            <View style={styles.countdownBadge}>
                                <Text style={styles.countdownText}>in {countdown}</Text>
                            </View>
                        )}
                    </View>

                    {/* VS */}
                    <View style={styles.vsContainer}>
                        <Text style={styles.vsText}>VS</Text>
                    </View>

                    {/* Away Team */}
                    <View style={styles.teamContainer}>
                        {match.awayTeam?.logo ? (
                            <Image
                                source={{ uri: match.awayTeam.logo }}
                                style={styles.teamLogo}
                            />
                        ) : (
                            <View style={[styles.teamLogo, { backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
                                <Ionicons name="shield" size={24} color={theme.colors.textMuted} />
                            </View>
                        )}
                        <Text style={styles.teamName} numberOfLines={2}>
                            {match.awayTeam?.name || 'Away Team'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={{ color: theme.colors.textMuted, marginTop: theme.spacing.md }}>
                        Loading upcoming matches...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.emptyContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={theme.colors.textMuted} style={styles.emptyIcon} />
                    <Text style={styles.emptyTitle}>Error Loading Matches</Text>
                    <Text style={styles.emptyText}>{error.message || 'Something went wrong'}</Text>
                    <TouchableOpacity
                        onPress={refetch}
                        style={{ marginTop: theme.spacing.lg, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md, backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.md }}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Upcoming Matches</Text>
                <Text style={styles.subtitle}>
                    {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'} scheduled
                </Text>
            </View>

            {/* Date Selector */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.dateScrollContainer}
                contentContainerStyle={{ paddingRight: theme.spacing.lg }}
            >
                {dates.map((dateObj) => (
                    <TouchableOpacity
                        key={dateObj.value}
                        style={[
                            styles.dateItem,
                            selectedDate === dateObj.value && styles.dateItemActive
                        ]}
                        onPress={() => setSelectedDate(dateObj.value)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.dateDay,
                            selectedDate === dateObj.value && styles.dateDayActive
                        ]}>
                            {dateObj.dayOfWeek}
                        </Text>
                        <Text style={[
                            styles.dateNumber,
                            selectedDate === dateObj.value && styles.dateNumberActive
                        ]}>
                            {dateObj.date}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Sport Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterContainer}
            >
                {sportFilters.map((filter) => (
                    <TouchableOpacity
                        key={filter.value}
                        style={[
                            styles.filterChip,
                            selectedSport === filter.value && styles.filterChipActive
                        ]}
                        onPress={() => setSelectedSport(filter.value)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.filterChipText,
                            selectedSport === filter.value && styles.filterChipTextActive
                        ]}>
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Matches List */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={refetch}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                {filteredMatches.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={64} color={theme.colors.textMuted} style={styles.emptyIcon} />
                        <Text style={styles.emptyTitle}>No Matches Scheduled</Text>
                        <Text style={styles.emptyText}>
                            There are no upcoming matches for the selected date and sport.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.matchesList}>
                        {filteredMatches.map(renderMatchCard)}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
