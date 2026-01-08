import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import PlayerHeader from '@components/player/PlayerHeader';
import PlayerStats from '@components/player/PlayerStats';
import { useGetPlayerDetailsQuery } from '@store/api/playersApi';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserPreferences } from '@store/slices/authSlice';
import { styles } from '@utils/style/PlayerProfileScreen.styles';

export default function PlayerProfileScreen({ route, navigation }) {
    // Get player from params
    const { player: initialPlayer, playerId, sport: paramSport } = route.params || {};

    // Determine Sport: passed explicitly or inside player object or default
    const sport = paramSport || initialPlayer?.sport || 'football';

    // Determine ID: passed explicitly or inside player object
    // Determine ID: passed explicitly or inside player object
    const id = playerId || initialPlayer?.id;

    const { data: playerData, isLoading, error, refetch } = useGetPlayerDetailsQuery(
        { id, sport },
        {
            skip: !id,
            refetchOnMountOrArgChange: true
        }
    );

    // Force refetch on mount to ensure we get the latest backend enrichment
    useEffect(() => {
        if (id) refetch();
    }, [id]);

    // Derive display data (API > Initial > Mock)
    // Derived display data
    const player = playerData || initialPlayer;

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const favoritePlayers = user?.preferences?.favoritePlayers || [];

    // Check if following
    const isInitiallyFollowing = favoritePlayers.some(p => p.id === id);

    const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);

    // Sync state if favorites change externally (or on first load)
    useEffect(() => {
        setIsFollowing(favoritePlayers.some(p => p.id === id));
    }, [favoritePlayers, id]);

    // Map API stats to UI format
    const stats = playerData ? [
        { label: 'Goals', value: playerData.statistics?.goals || '0', icon: 'football-outline' },
        { label: 'Assists', value: playerData.statistics?.assists || '0', icon: 'flash-outline' },
        { label: 'Red Cards', value: playerData.statistics?.redCards || '0', icon: 'alert-circle-outline' },
        { label: 'Yellow Cards', value: playerData.statistics?.yellowCards || '0', icon: 'warning-outline' },
    ] : [];

    // Temporary placeholder for achievements/form until API supports it
    const form = ['?', '?', '?', '?', '?'];
    const achievements = [];

    const toggleFollow = () => {
        const newStatus = !isFollowing;
        setIsFollowing(newStatus); // Optimistic UI update

        let newFavorites;
        if (newStatus) {
            // Add to favorites
            // Construct player object to save
            const playerToSave = {
                id: player.id || playerId,
                name: player.name || player.player_name || 'Unknown Player',
                sport: sport,
                team: player.team?.name || player.team || '',
                image: player.photo || player.image
            };
            newFavorites = [...favoritePlayers, playerToSave];
        } else {
            // Remove from favorites
            newFavorites = favoritePlayers.filter(p => p.id !== id);
        }

        dispatch(updateUserPreferences({ favoritePlayers: newFavorites }));
    };

    if (isLoading && !player) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!player) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={{ color: theme.colors.textMuted }}>Player not found.</Text>
            </View>
        );
    }

    // Merge API data into player object passed to Header
    const displayPlayer = {
        ...player,
        image: player.photo || player.image || 'https://api.dicebear.com/7.x/avataaars/png?seed=Player',
        team: player.team?.name || player.team,
        isFollowing: isFollowing
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <PlayerHeader
                    player={displayPlayer}
                    onFollow={toggleFollow}
                />

                <View style={styles.content}>
                    <PlayerStats
                        stats={stats}
                        form={form}
                        achievements={achievements}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
