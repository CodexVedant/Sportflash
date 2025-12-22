import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

export default function MatchHeader({
    match,
    homeScore,
    awayScore,
    timer,
    onFollow,
    isFollowingHome,
    isFollowingAway
}) {
    if (!match) return null;

    return (
        <View style={styles.scoreHero}>
            <View style={styles.teamContainer}>
                <View style={styles.logoLg}><Text style={{ fontSize: 32 }}>{match.homeTeam.logo}</Text></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.teamNameHero}>{match.homeTeam.name}</Text>
                    <TouchableOpacity onPress={() => onFollow(match.homeTeam.name)}>
                        <Ionicons name={isFollowingHome ? "star" : "star-outline"} size={16} color={isFollowingHome ? theme.colors.warning : theme.colors.textMuted} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.scoreBoard}>
                <Animated.Text style={[styles.mainScore]}>
                    {homeScore}
                </Animated.Text>
                <Text style={styles.vsText}>VS</Text>
                <Text style={styles.mainScore}>{awayScore}</Text>
                <Text style={styles.statusBadge}>{timer || match.status.toUpperCase()}</Text>
            </View>

            <View style={styles.teamContainer}>
                <View style={styles.logoLg}><Text style={{ fontSize: 32 }}>{match.awayTeam.logo}</Text></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.teamNameHero}>{match.awayTeam.name}</Text>
                    <TouchableOpacity onPress={() => onFollow(match.awayTeam.name)}>
                        <Ionicons name={isFollowingAway ? "star" : "star-outline"} size={16} color={isFollowingAway ? theme.colors.warning : theme.colors.textMuted} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scoreHero: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    teamContainer: {
        alignItems: 'center',
    },
    logoLg: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    teamNameHero: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    scoreBoard: {
        alignItems: 'center',
    },
    mainScore: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    vsText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginBottom: 4,
    },
    statusBadge: {
        color: theme.colors.danger,
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 4,
    },
});
