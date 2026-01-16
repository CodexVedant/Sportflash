import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image as RNImage } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/LeagueDetailScreen.styles';
import { useGetLeagueMatchesQuery, useGetLeagueTopScorersQuery } from '@store/api/leaguesApi';
import { useGetMatchStandingsQuery } from '@store/api/matchesApi';
import { EmptyState, NetworkError } from '@components/common';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { updateUserPreferences } from '@store/slices/authSlice';
import { FavoriteLeague } from '@app-types/models/user';

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
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // Normalize params from potentially different route structures (LeagueDetails vs LeagueDetail)
    const rawParams = route.params as any;
    const league = rawParams.league || {
        id: rawParams.leagueId,
        name: rawParams.name || 'Unknown League',
        sport: rawParams.sport || 'football',
        country: { name: '' },
        season: ''
    };

    const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'standings' | 'teams' | 'stats'>('overview');
    const [matchStatus, setMatchStatus] = useState<'upcoming' | 'live' | 'finished'>('upcoming');

    // Favorites Logic
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const isFavorite = user?.preferences?.favoriteLeagues?.some(l => l.id === league.id);

    const toggleFavorite = () => {
        if (!user) return;

        const currentFavorites = user.preferences?.favoriteLeagues || [];
        let newFavorites: FavoriteLeague[];

        if (isFavorite) {
            newFavorites = currentFavorites.filter(l => l.id !== league.id);
        } else {
            newFavorites = [...currentFavorites, {
                id: league.id,
                name: league.name,
                sport: league.sport,
                country: league.country?.name,
                logo: league.logo
            }];
        }

        dispatch(updateUserPreferences({ favoriteLeagues: newFavorites }));
    };

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
    }, {
        skip: activeTab !== 'matches'
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

    // Fetch top scorers (Football only)
    const {
        data: topScorers = [],
        isLoading: scorersLoading,
        error: scorersError,
        refetch: refetchScorers
    } = useGetLeagueTopScorersQuery({
        leagueId: league.id,
        sport: league.sport
    }, {
        skip: activeTab !== 'stats' || league.sport !== 'football'
    });

    const onRefresh = useCallback(() => {
        if (activeTab === 'matches') refetchMatches();
        if (activeTab === 'standings') refetchStandings();
        if (activeTab === 'overview') refetchStandings();
        if (activeTab === 'teams') refetchStandings();
        if (activeTab === 'stats') refetchScorers();
    }, [activeTab, refetchMatches, refetchStandings, refetchScorers]);

    const handleTeamPress = (team: any) => {
        if (team?.id) {
            navigation.navigate('TeamProfile', {
                teamId: team.id,
                teamName: team.name || team.team?.name,
                sport: league.sport
            });
        }
    };

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
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.standingRow}
                                            onPress={() => handleTeamPress(team.team || team)}
                                        >
                                            <Text style={styles.position}>{team.position || index + 1}</Text>
                                            <Text style={styles.teamName} numberOfLines={1}>{team.team?.name || team.name}</Text>
                                            <Text style={styles.points}>{team.points || team.pts} pts</Text>
                                        </TouchableOpacity>
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
                        <ScrollView
                            style={styles.matchesList}
                            refreshControl={
                                <RefreshControl
                                    refreshing={matchesLoading}
                                    onRefresh={onRefresh}
                                    tintColor={theme.colors.primary}
                                />
                            }
                        >
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
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.matchCard}
                                        onPress={() => navigation.navigate('MatchDetail', { match })}
                                    >
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
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                );

            case 'standings':
                return (
                    <ScrollView
                        style={styles.tabContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={standingsLoading}
                                onRefresh={onRefresh}
                                tintColor={theme.colors.primary}
                            />
                        }
                    >
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
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.tableRow}
                                        onPress={() => handleTeamPress(team.team || team)}
                                    >
                                        <Text style={[styles.tableCell, { flex: 0.5 }]}>{team.position || index + 1}</Text>
                                        <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>{team.team?.name || team.name}</Text>
                                        <Text style={[styles.tableCell, { flex: 0.5 }]}>{team.played || team.p || 0}</Text>
                                        <Text style={[styles.tableCell, { flex: 0.5 }]}>{team.won || team.w || 0}</Text>
                                        <Text style={[styles.tableCell, { flex: 0.5 }]}>{team.drawn || team.d || 0}</Text>
                                        <Text style={[styles.tableCell, { flex: 0.5 }]}>{team.lost || team.l || 0}</Text>
                                        <Text style={[styles.tableCell, { flex: 0.7, fontWeight: 'bold' }]}>{team.points || team.pts || 0}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                );
            case 'teams':
                return (
                    <ScrollView
                        style={styles.tabContent}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={standingsLoading}
                                onRefresh={onRefresh}
                                tintColor={theme.colors.primary}
                            />
                        }
                    >
                        {standingsLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                            </View>
                        ) : standingsError ? (
                            <NetworkError onRetry={refetchStandings} />
                        ) : standings.length === 0 ? (
                            <EmptyState
                                variant="noMatches"
                                message="No teams available"
                            />
                        ) : (
                            <View style={styles.teamsGrid}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                    {standings.map((team: any, index: number) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.teamCard}
                                            onPress={() => handleTeamPress(team.team || team)}
                                        >
                                            {team.team?.logo || team.logo ? (
                                                <RNImage
                                                    source={{ uri: team.team?.logo || team.logo }}
                                                    style={styles.teamLogo}
                                                    resizeMode="contain"
                                                />
                                            ) : (
                                                <View style={styles.teamLogoPlaceholder}>
                                                    <Text style={styles.teamLogoText}>🛡️</Text>
                                                </View>
                                            )}
                                            <Text style={styles.teamCardName} numberOfLines={2}>{team.team?.name || team.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </ScrollView>
                );

            case 'stats':
                if (league.sport !== 'football') return null;
                return (
                    <ScrollView
                        style={styles.tabContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={scorersLoading}
                                onRefresh={onRefresh}
                                tintColor={theme.colors.primary}
                            />
                        }
                    >
                        {scorersLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                            </View>
                        ) : scorersError ? (
                            <NetworkError onRetry={refetchScorers} />
                        ) : topScorers.length === 0 ? (
                            <EmptyState
                                variant="noMatches"
                                message="No top scorers available"
                            />
                        ) : (
                            <View style={styles.standingsTable}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>#</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 2, textAlign: 'left', paddingLeft: 8 }]}>Player</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 0.7 }]}>Goals</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 0.7 }]}>Assists</Text>
                                </View>
                                {topScorers.map((player: any, index: number) => (
                                    <View key={index} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { flex: 0.5 }]}>{player.place || index + 1}</Text>
                                        <View style={{ flex: 2, paddingLeft: 8 }}>
                                            <Text style={[styles.tableCell, { textAlign: 'left', fontWeight: '500' }]}>{player.player_name}</Text>
                                            <Text style={[styles.tableCell, { textAlign: 'left', fontSize: 11, color: theme.colors.textMuted }]}>{player.team_name}</Text>
                                        </View>
                                        <Text style={[styles.tableCell, { flex: 0.7, fontWeight: 'bold' }]}>{player.goals}</Text>
                                        <Text style={[styles.tableCell, { flex: 0.7 }]}>{player.assists || '-'}</Text>
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
                    <View style={styles.headerTitleRow}>
                        <Text style={styles.leagueName} numberOfLines={1}>{league.name}</Text>
                        {user && (
                            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteBtn}>
                                <Ionicons
                                    name={isFavorite ? "heart" : "heart-outline"}
                                    size={24}
                                    color={isFavorite ? theme.colors.danger : theme.colors.textMuted}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
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
                    { id: 'standings', label: 'Standings' },
                    { id: 'teams', label: 'Teams' },
                    ...(league.sport === 'football' ? [{ id: 'stats', label: 'Stats' }] : [])
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
