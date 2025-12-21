import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

export default function MatchCard({ sport, status, league, homeTeam, awayTeam, score, timer, onPress }) {

    // Determine Colors based on Sport
    const getSportColor = () => {
        switch (sport?.toLowerCase()) {
            case 'cricket': return theme.colors.cricket;
            case 'football': return theme.colors.football;
            case 'basketball': return theme.colors.basketball;
            default: return theme.colors.primary;
        }
    };

    const sportColor = getSportColor();

    // Pulsing Animation for 'LIVE'
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        if (status === 'live') {
            opacity.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 1000 }),
                    withTiming(0.5, { duration: 1000 })
                ),
                -1, // Infinite
                true // Reverse
            );
        }
    }, [status]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
            <LinearGradient
                colors={[
                    `${sportColor}33`, // 20% opacity (hex 33)
                    'rgba(15, 23, 42, 0.9)'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card, { borderColor: sportColor }]}
            >
                {/* Header: Live Badge + League */}
                <View style={styles.header}>
                    <View style={styles.badgeContainer}>
                        {status === 'live' && (
                            <Animated.View style={[styles.dot, { backgroundColor: theme.colors.danger }, animatedStyle]} />
                        )}
                        <Text style={[styles.statusText, { color: status === 'live' ? theme.colors.danger : theme.colors.textMuted }]}>
                            {status === 'live' ? `LIVE ${sport.toUpperCase()}` : status.toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.league}>{league}</Text>
                </View>

                {/* Scores Area */}
                <View style={styles.scoreContainer}>
                    {/* Home Team */}
                    <View style={styles.team}>
                        <View style={styles.logoPlaceholder}>
                            {homeTeam.logo?.startsWith('http') ? (
                                <Image source={{ uri: homeTeam.logo }} style={{ width: 32, height: 32, resizeMode: 'contain' }} />
                            ) : (
                                <Text style={{ fontSize: 24 }}>{homeTeam.logo}</Text>
                            )}
                        </View>
                        <Text style={styles.teamName}>{homeTeam.name}</Text>
                        <Text style={styles.score}>{homeTeam.score}</Text>
                    </View>

                    {/* VS or Time */}
                    <View style={styles.centerInfo}>
                        {status === 'live' ? (
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.liveScore, { color: sportColor }]}>{score ? score : 'VS'}</Text>
                                <Text style={styles.timer}>{timer || homeTeam.overs || ''}</Text>
                            </View>
                        ) : (
                            <Text style={styles.vs}>VS</Text>
                        )}
                    </View>

                    {/* Away Team */}
                    <View style={styles.team}>
                        <View style={styles.logoPlaceholder}>
                            {awayTeam.logo?.startsWith('http') ? (
                                <Image source={{ uri: awayTeam.logo }} style={{ width: 32, height: 32, resizeMode: 'contain' }} />
                            ) : (
                                <Text style={{ fontSize: 24 }}>{awayTeam.logo}</Text>
                            )}
                        </View>
                        <Text style={styles.teamName}>{awayTeam.name}</Text>
                        <Text style={styles.score}>{awayTeam.score}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: sportColor }]}>Click to view Dashboard</Text>
                </View>

            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: theme.sizes.xs,
        fontWeight: 'bold',
    },
    league: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.xs,
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    team: {
        alignItems: 'center',
        flex: 1,
    },
    logoPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    teamName: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 16, // theme.sizes.md,
        marginBottom: 4,
    },
    score: {
        color: theme.colors.text,
        fontSize: 14,
        opacity: 0.8,
    },
    centerInfo: {
        alignItems: 'center',
        width: 80,
    },
    vs: {
        color: theme.colors.textMuted,
        fontSize: 20,
        fontWeight: 'bold',
        opacity: 0.5,
    },
    liveScore: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    timer: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    footer: {
        alignItems: 'center',
        marginTop: 8,
    },
    footerText: {
        fontSize: 12,
        opacity: 0.9,
    }
});
