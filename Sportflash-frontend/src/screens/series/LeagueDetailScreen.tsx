import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/LeagueDetailScreen.styles';
import { useGetLeagueMatchesQuery } from '@store/api/leaguesApi';
import { useGetMatchStandingsQuery } from '@store/api/matchesApi';
import { EmptyState, NetworkError } from '@components/common';

type LeagueDetailRouteProp = RouteProp<{
    params: {
        league: {
            id: string;
            name: string;
            sport: string;
            country?: { name: string };
            logo?: string;
            season?: string;
        };
    };
}, 'params'>;

export default function LeagueDetailScreen() {
    const route = useRoute<LeagueDetailRouteProp>();
    const navigation = useNavigation();
    const { league } = route.params;

    const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'standings'>('overview');
    const [matchStatus, setMatchStatus] = useState<'upcoming' | 'live' | 'finished'>('upcoming');

    // Fetch league matches
    const {
        data: matches = [],
        isLoading: matchesLoading,
        error: matchesError,
        refetch: refetchMatches
    } = useGetLeagueMatchesQuery({
        leagueId: league.id,
        sport: league.sport,
        status: matchStatus
    });

    // Fetch standings
    const {
        data: standings = [],
        isLoading: standingsLoading,
        error: standingsError,
        refetch: refetchStandings
    } = useGetMatchStandingsQuery({
        sport: league.sport,
        leagueId: league.id
    });

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <ScrollView style={styles.tabContent}>
                        {/* League Info */}
                        <View style={styles.infoCard}>
                            <Text style={styles.sectionTitle}>League Information</Text>
                            {league.country?.name && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Country:</Text>
                                    <Text style={styles.infoValue}>{league.country.name}</Text>
                                </View>
                            )}
                            {league.season && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Season:</Text>
                                    <Text style={styles.infoValue}>{league.season}</Text>
                                </View>
                            )}
                        </View>

                        {/* Standings Preview */}
                        <View style={styles.infoCard}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Current Standings</Text>
                                <TouchableOpacity onPress={() => setActiveTab('standings')}>
                                    <Text style={styles.viewAllText}>View All →</Text>
                                </TouchableOpacity>
                            </View>
                            {standingsLoading ? (
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            ) : standings.length > 0 ? (
                                <View style={styles.standingsPreview}>
                                    {standings.slice(0, 5).map((team: any, index: number) => (
                                        <View key={index} style={styles.standingRow}>
                                            <Text style={styles.position}>{team.position || index + 1}</Text>
                                            <Text style={styles.teamName} numberOfLines={1}>{team.team?.name || team.name}</Text>
                                            <Text style={styles.points}>{team.points || team.pts} pts</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text style={styles.noDataText}>No standings available</Text>
                            )}
                        </View>
                    </ScrollView>
                );

            case 'matches':
                return (
                    <View style={styles.tabContent}>
                        {/* Match Status Filter */}
                        <View style={styles.filterBar}>
                            {['upcoming', 'live', 'finished'].map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    style={[
                                        styles.filterButton,
                                        matchStatus === status && styles.filterButtonActive
                                    ]}
                                    onPress={() => setMatchStatus(status as any)}
                                >
                                    <Text style={[
                                        styles.filterButtonText,
                                        matchStatus === status && styles.filterButtonTextActive
                                    ]}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Matches List */}
                        <ScrollView style={styles.matchesList}>
                            {matchesLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={theme.colors.primary} />
                                </View>
                            ) : matchesError ? (
                                <NetworkError onRetry={refetchMatches} />
                            ) : matches.length === 0 ? (
                                <EmptyState
                                    variant="noMatches"
                                    message={`No ${matchStatus} matches found`}
                                />
                            ) : (
                                matches.map((match: any, index: number) => (
                                    <View key={index} style={styles.matchCard}>
                                        <Text style={styles.matchDate}>
                                            {new Date(match.date || match.startTime).toLocaleDateString()}
                                        </Text>
                                        <View style={styles.matchTeams}>
                                            <Text style={styles.teamText}>{match.homeTeam?.name || match.team1?.name}</Text>
                                            <Text style={styles.vsText}>vs</Text>
                                            <Text style={styles.teamText}>{match.awayTeam?.name || match.team2?.name}</Text>
                                        </View>
                                        {match.status && (
                                            <Text style={styles.matchStatus}>{match.status}</Text>
                                        )}
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View>
                );

            case 'standings':
                return (
                    <ScrollView style={styles.tabContent}>
                        {standingsLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                            </View>
                        ) : standingsError ? (
                            <NetworkError onRetry={refetchStandings} />
                        ) : standings.length === 0 ? (
                            <EmptyState
                                variant="noMatches"
                                message="No standings available"
                            />
                        ) : (
                            <View style={styles.standingsTable}>
                                {/* Table Header */}
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>#</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Team</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>P</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>W</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>D</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>L</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 0.7 }]}>Pts</Text>
                                </View>

                                {/* Table Rows */}
                                {standings.map((team: any, index: number) => (
                                    <View key={index} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { flex: 0.5 }]}>{team.position || index + 1}</Text>
                                        <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>{team.team?.name || team.name}</Text>
                                        <Text style={[styles.tableCell, { flex: 0.5 }]}>{team.played || team.p || 0}</Text>
                                        <Text style={[styles.tableCell, { flex: 0.5 }]}>{team.won || team.w || 0}</Text>
                                        <Text style={[styles.tableCell, { flex: 0.5 }]}>{team.drawn || team.d || 0}</Text>
                                        <Text style={[styles.tableCell, { flex: 0.5 }]}>{team.lost || team.l || 0}</Text>
                                        <Text style={[styles.tableCell, { flex: 0.7, fontWeight: 'bold' }]}>{team.points || team.pts || 0}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.leagueName} numberOfLines={1}>{league.name}</Text>
                    {league.country?.name && (
                        <Text style={styles.leagueCountry}>{league.country.name}</Text>
                    )}
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'matches', label: 'Matches' },
                    { id: 'standings', label: 'Standings' }
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                        onPress={() => setActiveTab(tab.id as any)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tab Content */}
            {renderTabContent()}
        </SafeAreaView>
    );
}
