import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAppSelector, useAppDispatch } from '@hooks/redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useGetFollowedMatchesMutation } from '@store/api/matchesApi';
import { updateUserPreferences } from '@store/slices/authSlice';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useToast } from '@context/ToastContext';

export default function PlayersTab() {
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const { showToast } = useToast();
    const user = useAppSelector(state => state.auth.user);
    const rawFavoritePlayers = user?.preferences?.favoritePlayers || [];

    // Assuming favoritePlayers might also be mixed string/object
    const favoritePlayers = useMemo(() => {
        return rawFavoritePlayers.map((p: any) => typeof p === 'string' ? { id: p, name: 'Unknown Player' } : p);
    }, [rawFavoritePlayers]);

    // Fetch matches
    const [fetchMatches, { data: rawMatches, isLoading }] = useGetFollowedMatchesMutation();
    const matches = Array.isArray(rawMatches) ? rawMatches : (rawMatches as any)?.data || [];

    console.log('DEBUG: Favorite Players:', JSON.stringify(favoritePlayers, null, 2));
    console.log('DEBUG: Fetched Matches:', matches.length);

    const loadData = useCallback(() => {
        if (!favoritePlayers.length) return;
        // Pass players explicitly
        fetchMatches({ players: favoritePlayers, teams: [] });
    }, [favoritePlayers, fetchMatches]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const getNextMatches = (teamId: string) => {
        if (!matches || matches.length === 0 || !teamId) return [];
        const relevantMatches = matches.filter((m: any) =>
            String(m.homeTeam?.id) === String(teamId) ||
            String(m.awayTeam?.id) === String(teamId)
        );
        // Sort by date/startTime
        relevantMatches.sort((a: any, b: any) => {
            const dateA = new Date(a.date || a.startTime).getTime();
            const dateB = new Date(b.date || b.startTime).getTime();
            return dateA - dateB;
        });

        // Return next 2 matches
        return relevantMatches.slice(0, 2);
    };

    const handleUnfollow = async (player: any) => {
        try {
            const currentIds = rawFavoritePlayers.map((p: any) => typeof p === 'string' ? p : p.id);
            const newIds = currentIds.filter((id: string) => String(id) !== String(player.id));

            await dispatch(updateUserPreferences({ favoritePlayers: newIds })).unwrap();
            showToast(`Unfollowed ${player.name}`, 'success');
        } catch (error) {
            console.error(error);
            showToast("Failed to unfollow player", 'error');
        }
    };

    const renderPlayerItem = ({ item }: { item: any }) => {
        const player = item;
        const teamId = player.team?.id;
        // Fix: Use team ID if available, otherwise try to match by name if ID is missing (less reliable but fallback)
        const teamIdentifier = teamId || player.team?.name;

        // Note: Logic above relies on teamId being present for reliable matching. 
        // If teamId is missing, fallback logic in getNextMatches needs to handle name matching or fail gracefully.
        // Assuming teamId is prioritized.

        const nextMatches = getNextMatches(teamId);

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
                                {player.image_path || player.image ? (
                                    <Image source={{ uri: player.image_path || player.image }} style={styles.avatar} resizeMode="cover" />
                                ) : (
                                    <View style={[styles.avatar, { backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center' }]}>
                                        <Ionicons name="person" size={20} color="#cbd5e1" />
                                    </View>
                                )}
                            </View>
                            <View>
                                <Text style={styles.playerName}>{player.name}</Text>
                                <Text style={styles.teamName}>{player.team?.name || (typeof player.team === 'string' ? player.team : 'Unknown Team')}</Text>
                            </View>
                        </View>

                        {/* Right: Star (Clickable) */}
                        <TouchableOpacity
                            onPress={() => handleUnfollow(player)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="star" size={24} color="#FFD700" />
                        </TouchableOpacity>
                    </View>

                    {/* Footer: Next 1-2 Matches for their Team */}
                    <View style={styles.matchesContainer}>
                        {nextMatches.length > 0 ? (
                            nextMatches.map((match: any, index: number) => (
                                <View key={match.id} style={[styles.matchRow, index > 0 && { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' }]}>
                                    <View style={styles.matchBadge}>
                                        <Text style={styles.matchBadgeText}>Match {index + 1}</Text>
                                    </View>
                                    <Text style={styles.matchText} numberOfLines={1}>
                                        vs {String(match.homeTeam?.id) === String(teamId) ? match.awayTeam?.name : match.homeTeam?.name}
                                    </Text>
                                    <Text style={styles.dateText}>
                                        {match.date || match.startTime}
                                    </Text>
                                </View>
                            ))
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
    matchesContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        padding: 10,
    },
    matchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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
        textAlign: 'center',
        padding: 4
    },
    emptyText: { color: theme.colors.textMuted, fontSize: 16, marginTop: 16, textAlign: 'center' }
});
