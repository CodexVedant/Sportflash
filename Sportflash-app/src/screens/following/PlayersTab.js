import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useGetFollowedMatchesMutation } from '@store/api/matchesApi';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PlayersTab() {
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);
    const favoritePlayers = user?.preferences?.favoritePlayers || [];

    // Fetch matches using followed players' teams
    // MatchesTab/Controller already handles extracting teams from players if we pass empty teams list?
    // Actually, getFollowedMatches controller expects { teams: [], players: [] }
    // We should pass players list.
    const [fetchMatches, { data: rawMatches, isLoading }] = useGetFollowedMatchesMutation();
    const matches = Array.isArray(rawMatches) ? rawMatches : (rawMatches?.data || []);

    const loadData = useCallback(() => {
        if (!favoritePlayers.length) return;

        // Pass players explicitly so backend finds their teams' matches
        fetchMatches({ players: favoritePlayers, teams: [] });
    }, [favoritePlayers, fetchMatches]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const getNextMatch = (teamId) => {
        if (!matches || matches.length === 0 || !teamId) return null;
        return matches.find(m =>
            String(m.homeTeam?.id) === String(teamId) ||
            String(m.awayTeam?.id) === String(teamId)
        );
    };

    const renderPlayerItem = ({ item }) => {
        const player = item; // Object { id, name, team: { id, name}, sport }
        const teamId = player.team?.id;
        const nextMatch = getNextMatch(teamId);

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('PlayerProfile', {
                    playerId: player.id,
                    playerName: player.name,
                    team: player.team,
                    sport: player.sport
                })}
            >
                <LinearGradient
                    colors={['#1e293b', '#0f172a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <View style={styles.cardContent}>
                        {/* Left: Player Info */}
                        <View style={styles.playerInfo}>
                            <View style={styles.avatarContainer}>
                                {player.image_path ? (
                                    <Image source={{ uri: player.image_path }} style={styles.avatar} resizeMode="cover" />
                                ) : (
                                    <View style={[styles.avatar, { backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center' }]}>
                                        <Ionicons name="person" size={20} color="#cbd5e1" />
                                    </View>
                                )}
                            </View>
                            <View>
                                <Text style={styles.playerName}>{player.name}</Text>
                                <Text style={styles.teamName}>{player.team?.name || 'Unknown Team'}</Text>
                            </View>
                        </View>

                        {/* Right: Star */}
                        <Ionicons name="star" size={20} color="#FFD700" />
                    </View>

                    {/* Footer: Next Match for their Team */}
                    <View style={styles.matchFooter}>
                        {nextMatch ? (
                            <>
                                <View style={styles.matchBadge}>
                                    <Text style={styles.matchBadgeText}>NEXT MATCH</Text>
                                </View>
                                <Text style={styles.matchText} numberOfLines={1}>
                                    vs {String(nextMatch.homeTeam?.id) === String(teamId) ? nextMatch.awayTeam?.name : nextMatch.homeTeam?.name}
                                </Text>
                                <Text style={styles.dateText}>
                                    {nextMatch.date || nextMatch.startTime}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.noMatchText}>
                                {teamId ? 'No upcoming matches' : 'Team info unavailable'}
                            </Text>
                        )}
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    if (favoritePlayers.length === 0) {
        return (
            <View style={styles.center}>
                <Ionicons name="person-outline" size={64} color={theme.colors.textMuted} />
                <Text style={styles.emptyText}>Follow players to see them listed here.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favoritePlayers}
                renderItem={renderPlayerItem}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: {
        borderRadius: 12,
        marginBottom: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
    },
    playerName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    teamName: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 2,
    },
    matchFooter: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    matchBadge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    matchBadgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },
    matchText: {
        color: '#e2e8f0',
        fontSize: 13,
        flex: 1,
    },
    dateText: {
        color: '#cbd5e1',
        fontSize: 12,
    },
    noMatchText: {
        color: '#64748b',
        fontSize: 12,
        fontStyle: 'italic',
    },
    emptyText: { color: theme.colors.textMuted, fontSize: 16, marginTop: 16, textAlign: 'center' }
});
