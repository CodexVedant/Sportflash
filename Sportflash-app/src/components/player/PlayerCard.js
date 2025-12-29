import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/PlayerCard.styles';

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
