import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/PlayerHeader.styles';
import { Player } from './PlayerCard';

interface PlayerHeaderProps {
    player: Player;
    onFollow?: () => void;
}

export default function PlayerHeader({ player, onFollow }: PlayerHeaderProps) {

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(59, 130, 246, 0.2)', 'transparent']}
                style={styles.gradient}
            />

            {/* Profile Content */}
            <View style={styles.content}>
                <View style={[styles.imageContainer, { marginTop: 40 }]}>
                    {player.image ? (
                        <Image source={{ uri: player.image }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Text style={styles.placeholderText}>
                                {player.name?.charAt(0)}
                            </Text>
                        </View>
                    )}
                    <View style={styles.numberBadge}>
                        <Text style={styles.numberText}>{player.number || '#'}</Text>
                    </View>
                </View>

                <Text style={styles.name}>{player.name}</Text>
                <Text style={styles.role}>{player.position} • {player.team}</Text>

                <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={14} color={theme.colors.textMuted} />
                    <Text style={styles.location}>{player.nationality}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.followButton, player.isFollowing && styles.followingButton]}
                        onPress={onFollow}
                    >
                        <Ionicons
                            name={player.isFollowing ? "checkmark" : "add"}
                            size={20}
                            color="#fff"
                        />
                        <Text style={styles.followButtonText}>
                            {player.isFollowing ? 'Following' : 'Follow'}
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>

    );
}
