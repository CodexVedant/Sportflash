import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

// Define the functional component
const MatchHeader = ({ match, homeScore, awayScore, timer, onFollow, onTeamPress, isFollowingHome, isFollowingAway }) => {
    return (
        <View style={styles.scoreHero}>
            <View style={styles.teamContainer}>
                <TouchableOpacity onPress={() => onTeamPress && onTeamPress(match.homeTeam)}>
                    <View style={styles.logoLg}>
                        <Image
                            source={{ uri: match.homeTeam.logo }}
                            style={{ width: 60, height: 60, borderRadius: 30 }}
                            resizeMode="cover"
                        />
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.teamNameHero}>{match.homeTeam.name}</Text>
                    <TouchableOpacity onPress={() => onFollow(match.homeTeam.name)}>
                        <Ionicons name={isFollowingHome ? "star" : "star-outline"} size={16} color={isFollowingHome ? theme.colors.warning : theme.colors.textMuted} />
                    </TouchableOpacity>
                </View>
                <Animated.Text style={styles.teamScore}>
                    {homeScore}
                </Animated.Text>
            </View>

            <View style={styles.scoreBoard}>
                <Text style={styles.vsText}>VS</Text>
                <Text style={styles.statusBadge}>{timer || match.status.toUpperCase()}</Text>
            </View>

            <View style={styles.teamContainer}>
                <TouchableOpacity onPress={() => onTeamPress && onTeamPress(match.awayTeam)}>
                    <View style={styles.logoLg}>
                        <Image
                            source={{ uri: match.awayTeam.logo }}
                            style={{ width: 60, height: 60, borderRadius: 30 }}
                            resizeMode="cover"
                        />
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.teamNameHero}>{match.awayTeam.name}</Text>
                    <TouchableOpacity onPress={() => onFollow(match.awayTeam.name)}>
                        <Ionicons name={isFollowingAway ? "star" : "star-outline"} size={16} color={isFollowingAway ? theme.colors.warning : theme.colors.textMuted} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.teamScore}>{awayScore}</Text>
            </View>
        </View>
    );
}

// Memoize specifically to prevent re-renders on parent state changes (like tab switching)
export default React.memo(MatchHeader, (prevProps, nextProps) => {
    return (
        prevProps.match?.id === nextProps.match?.id &&
        prevProps.homeScore === nextProps.homeScore &&
        prevProps.awayScore === nextProps.awayScore &&
        prevProps.timer === nextProps.timer &&
        prevProps.isFollowingHome === nextProps.isFollowingHome &&
        prevProps.isFollowingAway === nextProps.isFollowingAway
    );
});


const styles = StyleSheet.create({
    scoreHero: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.xl,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    teamContainer: {
        alignItems: 'center',
        flex: 1,
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
        textAlign: 'center',
    },
    scoreBoard: {
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 35,
    },
    teamScore: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
    },
    vsText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statusBadge: {
        color: theme.colors.danger,
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 8,
    },
});
