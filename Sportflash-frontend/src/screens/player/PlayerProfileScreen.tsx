import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import PlayerHeader from '@components/player/PlayerHeader';
import PlayerStats from '@components/player/PlayerStats';
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

    const { data: playerData, isLoading } = useGetPlayerDetailsQuery({ id: queryId, sport }, { skip: !queryId });

    // Derive display data (API > Initial > Mock)
    const player = playerData || initialPlayer;

    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { showToast } = useToast();

    // Map API stats to UI format
    const stats = playerData ? [
        { label: 'Goals', value: playerData.statistics?.goals || '0', icon: 'football-outline' },
        { label: 'Assists', value: playerData.statistics?.assists || '0', icon: 'flash-outline' },
        { label: 'Red Cards', value: playerData.statistics?.redCards || '0', icon: 'alert-circle-outline' },
        { label: 'Yellow Cards', value: playerData.statistics?.yellowCards || '0', icon: 'warning-outline' },
    ] : [];

    // Temporary placeholder for achievements/form until API supports it
    const form = ['?', '?', '?', '?', '?'];
    const achievements: any[] = [];

    // Merge API data into player object passed to Header (Needed for isActuallyFollowing)
    const displayPlayer = {
        ...player,
        id: player?.id || id, // Ensure ID is present
        image: player?.photo || player?.image || 'https://api.dicebear.com/7.x/avataaars/png?seed=Player',
        team: player?.team?.name || player?.team,
        name: player?.name || 'Unknown Player'
    };

    // Check if following (Robust check)
    const isActuallyFollowing = React.useMemo(() => {
        return user?.preferences?.favoritePlayers?.some((p: any) => {
            const pId = typeof p === 'string' ? p : p.id;
            const targetId = displayPlayer.id;
            // Match by ID if available, else Name
            return (targetId && String(pId) === String(targetId)) ||
                (typeof p === 'string' && p === displayPlayer.name) ||
                (typeof p !== 'string' && p?.name === displayPlayer.name);
        });
    }, [user?.preferences?.favoritePlayers, displayPlayer]);

    // Derived property for UI
    displayPlayer.isFollowing = !!isActuallyFollowing;


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
                // Follow - Save Full Object (Schema Compliant)
                const playerToSave = {
                    id: displayPlayer.id || displayPlayer.name,
                    name: displayPlayer.name,
                    team: typeof displayPlayer.team === 'object' ? (displayPlayer.team?.name || 'Unknown') : (displayPlayer.team || 'Unknown'),
                    teamId: typeof displayPlayer.team === 'object' ? displayPlayer.team?.id : displayPlayer.teamId, // Send ID explicitly
                    sport: sport,
                    image: displayPlayer.image
                };
                console.log('DEBUG: Saving Player:', JSON.stringify(playerToSave, null, 2));

                newPlayers = [...currentPlayers, playerToSave];
                showToast(`Following ${displayPlayer.name}`, 'success');
            }

            // Dispatch update
            await dispatch(updateUserPreferences({ favoritePlayers: newPlayers })).unwrap();
        } catch (error) {
            console.error('Follow Error:', error);
            showToast('Failed to update favorites', 'error');
        }
    };

    if (isLoading && !player) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.container, styles.center]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

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

