import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import PlayerHeader from '../../components/player/PlayerHeader';
import PlayerStats from '../../components/player/PlayerStats';

export default function PlayerProfileScreen({ route, navigation }) {
    // Get player from params or use mock
    const { player: initialPlayer } = route.params || {};

    // Mock data expansion
    const [player, setPlayer] = useState({
        ...initialPlayer,
        image: initialPlayer?.image || 'https://api.dicebear.com/7.x/avataaars/png?seed=Felix',
        number: initialPlayer?.number || '10',
        nationality: initialPlayer?.nationality || 'Argentina',
        position: initialPlayer?.position || 'Forward',
        team: initialPlayer?.team || 'Inter Miami',
        isFollowing: false,
    });

    // Mock Stats
    const stats = [
        { label: 'Appearances', value: '24', icon: 'shirt-outline' },
        { label: 'Goals', value: '18', icon: 'football-outline' },
        { label: 'Assists', value: '12', icon: 'flash-outline' },
        { label: 'Rating', value: '8.4', icon: 'star-outline' },
    ];

    const form = ['W', 'W', 'D', 'W', 'L'];

    const achievements = [
        { title: 'Ballon d\'Or', year: '2023' },
        { title: 'World Cup', year: '2022' },
        { title: 'Golden Boot', year: '2021' },
    ];

    const toggleFollow = () => {
        setPlayer(prev => ({ ...prev, isFollowing: !prev.isFollowing }));
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
                    player={player}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingBottom: 40,
    }
});
