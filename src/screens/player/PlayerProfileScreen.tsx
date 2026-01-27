import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import PlayerHeader from '@components/player/PlayerHeader';
import PlayerStats from '@components/player/PlayerStats';
import PlayerFixtures from '@components/player/PlayerFixtures';
import { useGetPlayerDetailsQuery } from '@store/api/playersApi';
import { styles } from '@utils/style/PlayerProfileScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { updateUserPreferences } from '@store/slices/authSlice';
import { useToast } from '@context/ToastContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerProfile'>;

export default function PlayerProfileScreen({ route, navigation }: Props) {
    // Get player from params
    console.log('DEBUG: PlayerProfile Params:', JSON.stringify(route.params, null, 2));
    const { player: initialPlayer, playerId, sport: paramSport } = route.params || {};

    // Determine sport: Check param first, then inside player object, default to 'football'
    const sport = paramSport || initialPlayer?.sport || 'football';

    // Determine ID: passed explicitly or inside player object
    const id = playerId || initialPlayer?.id;

    // Fallback: Use "name_" prefix if ID is missing but name is available
    // Robust ID Logic:
    // 1. If explicit ID exists and is a "name-like" string (not numeric, not prefixed), prefix it.
    // 2. If ID is missing, try to construct from initialPlayer.name
    let queryId = id;
    if (id && typeof id === 'string' && isNaN(Number(id)) && !id.startsWith('name_')) {
        queryId = `name_${id}`;
    } else if (!id && initialPlayer?.name) {
        queryId = `name_${initialPlayer.name}`;
    }

    const { data: playerData, isLoading, error, refetch, isFetching } = useGetPlayerDetailsQuery(
        { id: queryId, sport },
        {
            skip: !queryId,
            pollingInterval: 60000
        }
    );

    const [refreshing, setRefreshing] = useState(false);

    // Pull to refresh handler
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { showToast } = useToast();

    // Map API stats to UI format
    const stats = React.useMemo(() => {
        if (!playerData) return [];

        if (sport === 'cricket') {
            return [
                { label: 'Runs', value: playerData.statistics?.runs || '0', icon: 'baseball-outline' },
                { label: 'Wickets', value: playerData.statistics?.wickets || '0', icon: 'hand-left-outline' }, // closest to bowling
                { label: 'SR', value: playerData.statistics?.strikeRate || '0.00', icon: 'speedometer-outline' },
                { label: 'Matches', value: playerData.statistics?.matches || '-', icon: 'calendar-outline' },
            ];
        }

        // Default: Football
        return [
            { label: 'Goals', value: playerData.statistics?.goals || '0', icon: 'football-outline' },
            { label: 'Assists', value: playerData.statistics?.assists || '0', icon: 'flash-outline' },
            { label: 'Red Cards', value: playerData.statistics?.redCards || '0', icon: 'alert-circle-outline' },
            { label: 'Yellow Cards', value: playerData.statistics?.yellowCards || '0', icon: 'warning-outline' },
        ];
    }, [playerData, sport]);

    // Derive display data (API > Initial)
    const player = playerData || initialPlayer;

    // Generate sport-specific stats
    const getStatsForSport = () => {
        if (!playerData?.statistics) return [];

        switch (sport.toLowerCase()) {
            case 'football':
            case 'soccer':
                return [
                    {
                        label: 'Goals',
                        value: String(playerData.statistics.goals || 0),
                        icon: 'football-outline' as const
                    },
                    {
                        label: 'Assists',
                        value: String(playerData.statistics.assists || 0),
                        icon: 'flash-outline' as const
                    },
                    {
                        label: 'Yellow Cards',
                        value: String(playerData.statistics.yellowCards || 0),
                        icon: 'warning-outline' as const
                    },
                    {
                        label: 'Red Cards',
                        value: String(playerData.statistics.redCards || 0),
                        icon: 'alert-circle-outline' as const
                    },
                ];

            case 'basketball':
                return [
                    {
                        label: 'Points',
                        value: String(playerData.statistics.points || 0),
                        icon: 'basketball-outline' as const
                    },
                    {
                        label: 'Rebounds',
                        value: String(playerData.statistics.rebounds || 0),
                        icon: 'trending-up-outline' as const
                    },
                    {
                        label: 'Assists',
                        value: String(playerData.statistics.assists || 0),
                        icon: 'flash-outline' as const
                    },
                    {
                        label: 'Steals',
                        value: String(playerData.statistics.steals || 0),
                        icon: 'hand-left-outline' as const
                    },
                    {
                        label: 'Blocks',
                        value: String(playerData.statistics.blocks || 0),
                        icon: 'shield-outline' as const
                    },
                ];

            case 'cricket':
                return [
                    {
                        label: 'Runs',
                        value: String(playerData.statistics.runs || 0),
                        icon: 'trending-up-outline' as const
                    },
                    {
                        label: 'Wickets',
                        value: String(playerData.statistics.wickets || 0),
                        icon: 'flash-outline' as const
                    },
                    {
                        label: 'Strike Rate',
                        value: playerData.statistics.strikeRate ?
                            String(Number(playerData.statistics.strikeRate).toFixed(2)) : '0.00',
                        icon: 'speedometer-outline' as const
                    },
                ];

            default:
                return [];
        }
    };

    // const stats = getStatsForSport(); // REMOVED DUPLICATE

    // Placeholder for form and achievements (to be implemented with match history)
    const form = ['?', '?', '?', '?', '?'];
    const achievements: any[] = [];

    // Merge API data into player object passed to Header
    const displayPlayer = {
        ...player,
        id: player?.id || id,
        image: player?.photo || player?.image || 'https://api.dicebear.com/7.x/avataaars/png?seed=Player',
        team: player?.team?.name || player?.team,
        teamId: player?.team?.id || player?.teamId || initialPlayer?.teamId,
        name: player?.name || 'Unknown Player',
        // Fallback for bio fields from params/initial
        nationality: player?.nationality || initialPlayer?.nationality || player?.country || initialPlayer?.country,
        position: player?.position || initialPlayer?.position || player?.role || initialPlayer?.role
    };

    // Check if following
    const isActuallyFollowing = React.useMemo(() => {
        return user?.preferences?.favoritePlayers?.some((p: any) => {
            const pId = typeof p === 'string' ? p : p.id;
            const targetId = displayPlayer.id;
            return (targetId && String(pId) === String(targetId)) ||
                (typeof p === 'string' && p === displayPlayer.name) ||
                (typeof p !== 'string' && p?.name === displayPlayer.name);
        });
    }, [user?.preferences?.favoritePlayers, displayPlayer]);

    displayPlayer.isFollowing = !!isActuallyFollowing;

    // Check if stats are empty
    const hasStats = React.useMemo(() => {
        if (!stats.length) return false;
        return stats.some(s => s.value !== '0' && s.value !== '0.00' && s.value !== '-');
    }, [stats]);

    const hasForm = false;

    const toggleFollow = async () => {
        if (!user) {
            showToast('Please login to follow players', 'info');
            return;
        }

        try {
            const currentPlayers = user.preferences?.favoritePlayers || [];
            let newPlayers;

            if (isActuallyFollowing) {
                // Unfollow
                newPlayers = currentPlayers.filter((p: any) => {
                    const pId = typeof p === 'string' ? p : p.id;
                    const pName = typeof p === 'string' ? p : p.name;
                    return String(pId) !== String(displayPlayer.id) && pName !== displayPlayer.name;
                });
                showToast(`Unfollowed ${displayPlayer.name}`, 'success');
            } else {
                // Follow - Save Enhanced Object
                const playerToSave = {
                    id: displayPlayer.id || displayPlayer.name,
                    name: displayPlayer.name,
                    team: typeof displayPlayer.team === 'object' ? (displayPlayer.team?.name || 'Unknown') : (displayPlayer.team || 'Unknown'),
                    teamId: typeof displayPlayer.team === 'object' ? displayPlayer.team?.id : displayPlayer.teamId,
                    sport: sport,
                    image: displayPlayer.image,
                    // Save Bio Info
                    nationality: displayPlayer.nationality,
                    position: displayPlayer.position
                };
                console.log('DEBUG: Saving Player:', JSON.stringify(playerToSave, null, 2));

                newPlayers = [...currentPlayers, playerToSave];
                showToast(`Following ${displayPlayer.name}`, 'success');
            }

            await dispatch(updateUserPreferences({ favoritePlayers: newPlayers })).unwrap();
        } catch (error: any) {
            console.error('Follow Error:', error);
            const msg = error?.message || error || 'Failed to update favorites';
            showToast(msg.toString(), 'error');
        }
    };

    // Loading state
    if (isLoading && !player) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.container, styles.center]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    // Error state
    if (error && !player) {
        return (
            <View style={[styles.container, styles.center]}>
                <Ionicons name="alert-circle-outline" size={64} color={theme.colors.danger} />
                <Text style={{ color: theme.colors.text, marginTop: 16, fontSize: 18, fontWeight: '600' }}>
                    Failed to load player
                </Text>
                <Text style={{ color: theme.colors.textMuted, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}>
                    {(error as any)?.data?.message || 'Unable to fetch player details. Please try again.'}
                </Text>
                <TouchableOpacity
                    onPress={() => refetch()}
                    style={{
                        marginTop: 24,
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        backgroundColor: theme.colors.primary,
                        borderRadius: 8
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // No player data
    if (!player) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.container, styles.center]}>
                    <Text style={{ color: theme.colors.textMuted }}>Player not found.</Text>
                </View>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            {/* Header with back button and refresh indicator */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>

                {isFetching && !refreshing && (
                    <View style={{ position: 'absolute', right: 16 }}>
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                    </View>
                )}
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.colors.primary}
                        colors={[theme.colors.primary]}
                    />
                }
            >
                <PlayerHeader
                    player={displayPlayer}
                    onFollow={toggleFollow}
                />

                <View style={styles.content}>

                    {/* 1. Show Stats ONLY if available */}
                    {
                        hasStats ? (
                            <>
                                <PlayerStats
                                    stats={stats}
                                    form={hasForm ? form : []}
                                    achievements={achievements}
                                />
                                {/* Hide Recent Form if empty/placeholder */}
                                <View style={{ marginBottom: 20 }} />
                            </>
                        ) : (
                            /* 2. Alternative: Player Info Card */
                            <View style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                borderRadius: 16,
                                padding: 20,
                                marginBottom: 24,
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.1)'
                            }}>
                                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Player Details</Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Text style={{ color: theme.colors.textMuted }}>Nationality</Text>
                                    <Text style={{ color: '#fff', fontWeight: '500' }}>{displayPlayer.nationality || displayPlayer.country || 'Unknown'}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Text style={{ color: theme.colors.textMuted }}>Role</Text>
                                    <Text style={{ color: '#fff', fontWeight: '500' }}>{displayPlayer.position || displayPlayer.role || 'Player'}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: theme.colors.textMuted }}>Team</Text>
                                    <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{displayPlayer.team || 'Free Agent'}</Text>
                                </View>
                            </View>
                        )}
                    {/* Upcoming Matches Section */}
                    <View style={{ paddingHorizontal: 4 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: theme.colors.text,
                            marginBottom: 12,
                            fontFamily: theme.fonts.bold
                        }}>
                            Upcoming Matches
                        </Text>
                        <PlayerFixtures teamId={displayPlayer.teamId} sport={sport} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
