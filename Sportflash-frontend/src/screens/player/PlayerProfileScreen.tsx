import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import PlayerHeader from '@components/player/PlayerHeader';
import PlayerStats from '@components/player/PlayerStats';
import { useGetPlayerDetailsQuery } from '@store/api/playersApi';
import { styles } from '@utils/style/PlayerProfileScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerProfile'>;

export default function PlayerProfileScreen({ route, navigation }: Props) {
    const { player: initialPlayer, playerId, sport = 'football' } = route.params || {};
    const id = playerId || initialPlayer?.id;

    // Fetch player data with polling for real-time updates
    const {
        data: playerData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetPlayerDetailsQuery(
        { id: id!, sport },
        {
            skip: !id,
            pollingInterval: 60000, // Poll every 60 seconds for updates
        }
    );

    const [isFollowing, setIsFollowing] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Pull to refresh handler
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

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

    const stats = getStatsForSport();

    // Placeholder for form and achievements (to be implemented with match history)
    const form = ['?', '?', '?', '?', '?'];
    const achievements: any[] = [];

    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
        // TODO: Implement actual follow/unfollow API call
    };

    // Loading state
    if (isLoading && !player) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ color: theme.colors.textMuted, marginTop: 16 }}>
                    Loading player data...
                </Text>
            </View>
        );
    }

    // Error state
    if (error && !player) {
        return (
            <View style={[styles.container, styles.center]}>
                <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
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
            <View style={[styles.container, styles.center]}>
                <Ionicons name="person-outline" size={64} color={theme.colors.textMuted} />
                <Text style={{ color: theme.colors.textMuted, marginTop: 16 }}>
                    Player not found
                </Text>
            </View>
        );
    }

    // Prepare display player object
    const displayPlayer = {
        ...player,
        image: player.photo || player.image || `https://api.dicebear.com/7.x/avataaars/png?seed=${player.name}`,
        team: typeof player.team === 'object' ? player.team.name : player.team,
        nationality: player.nationality || 'Unknown',
        position: player.position || 'Player',
        number: player.number || '-',
        age: player.age,
        isFollowing: isFollowing
    };

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
                    {/* Player Info Card */}
                    {playerData && (
                        <View style={{
                            backgroundColor: theme.colors.card,
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 16
                        }}>
                            <Text style={{
                                color: theme.colors.text,
                                fontSize: 16,
                                fontWeight: '600',
                                marginBottom: 12
                            }}>
                                Player Information
                            </Text>

                            <View style={{ gap: 8 }}>
                                {player.number && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: theme.colors.textMuted }}>Number</Text>
                                        <Text style={{ color: theme.colors.text, fontWeight: '500' }}>
                                            #{player.number}
                                        </Text>
                                    </View>
                                )}

                                {player.position && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: theme.colors.textMuted }}>Position</Text>
                                        <Text style={{ color: theme.colors.text, fontWeight: '500' }}>
                                            {player.position}
                                        </Text>
                                    </View>
                                )}

                                {player.age && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: theme.colors.textMuted }}>Age</Text>
                                        <Text style={{ color: theme.colors.text, fontWeight: '500' }}>
                                            {player.age} years
                                        </Text>
                                    </View>
                                )}

                                {player.nationality && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: theme.colors.textMuted }}>Nationality</Text>
                                        <Text style={{ color: theme.colors.text, fontWeight: '500' }}>
                                            {player.nationality}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Statistics */}
                    <PlayerStats
                        stats={stats}
                        form={form}
                        achievements={achievements}
                    />

                    {/* Data source note */}
                    <View style={{
                        marginTop: 16,
                        padding: 12,
                        backgroundColor: theme.colors.card,
                        borderRadius: 8,
                        opacity: 0.7
                    }}>
                        <Text style={{
                            color: theme.colors.textMuted,
                            fontSize: 12,
                            textAlign: 'center'
                        }}>
                            {playerData ?
                                `Last updated: ${new Date().toLocaleTimeString()}` :
                                'Limited player data available'
                            }
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
