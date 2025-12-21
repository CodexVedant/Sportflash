import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@utils/theme';

export default function PlayerCard({ player, onPress, compact = false }) {
    if (compact) {
        return (
            <TouchableOpacity style={styles.compactCard} onPress={onPress}>
                <Image source={{ uri: player.image }} style={styles.compactImage} />
                <View style={styles.compactInfo}>
                    <Text style={styles.compactName} numberOfLines={1}>{player.name}</Text>
                    <Text style={styles.compactRole}>{player.position} • {player.team}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']}
                style={styles.gradient}
            />

            <View style={styles.imageWrapper}>
                <Image source={{ uri: player.image }} style={styles.image} />
                <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>{player.number}</Text>
                </View>
            </View>

            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{player.name}</Text>
                <Text style={styles.team}>{player.team}</Text>

                <View style={styles.detailsRow}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{player.position}</Text>
                    </View>
                    <View style={[styles.badge, styles.nationBadge]}>
                        <Text style={styles.badgeText}>{player.nationality}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 160,
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#1E293B',
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    imageWrapper: {
        height: 120,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
    },
    numberBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    info: {
        padding: 12,
    },
    name: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    team: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginBottom: 8,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 6,
    },
    badge: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    nationBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    badgeText: {
        color: theme.colors.textMuted,
        fontSize: 10,
        fontWeight: '500',
    },

    // Compact styles
    compactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 8,
    },
    compactImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    compactInfo: {
        flex: 1,
    },
    compactName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    compactRole: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
});
