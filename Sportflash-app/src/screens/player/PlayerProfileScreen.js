import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import PlayerHeader from '@components/player/PlayerHeader';
import PlayerStats from '@components/player/PlayerStats';
import { useGetPlayerDetailsQuery } from '@store/api/playersApi';
import { styles } from '@utils/style/PlayerProfileScreen.styles';

export default function PlayerProfileScreen({ route, navigation }) {
    // Get player from params
    const { player: initialPlayer, playerId, sport = 'football' } = route.params || {};

    // Determine ID: passed explicitly or inside player object
    const id = playerId || initialPlayer?.id;

    const { data: playerData, isLoading, error } = useGetPlayerDetailsQuery({ id, sport }, { skip: !id });

    // Derive display data (API > Initial > Mock)
    const player = playerData || initialPlayer;

    const [isFollowing, setIsFollowing] = useState(false);

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
        setIsFollowing(!isFollowing);
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
        image: player.photo || player.image || 'https://api.dicebear.com/7.x/avataaars/png?seed=Player', // API field is 'photo', mock was 'image'
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
