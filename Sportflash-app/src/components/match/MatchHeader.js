import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { styles } from '@utils/style/MatchHeader.styles';

// Define the functional component
const MatchHeader = ({ match, homeScore, awayScore, timer, onFollow, onTeamPress, isFollowingHome, isFollowingAway }) => {

    const isCricket = match.sport === 'cricket';
    // Layout for Football/Basketball (Score in Center)
    if (!isCricket) {
        return (
            <View style={styles.scoreHero}>
                {/* Home Team Side */}
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
                </View>

                {/* Center Scoreboard */}
                <View style={styles.centerScoreBoard}>
                    <Text style={styles.dateText}>{match.date || 'Today'} {match.time || ''}</Text>
                    <View style={styles.scoreRow}>
                        <Text style={styles.bigScore}>{homeScore}</Text>
                        <Text style={styles.scoreDash}>-</Text>
                        <Text style={styles.bigScore}>{awayScore}</Text>
                    </View>
                    <Text style={styles.statusBadge}>{timer || match.status?.toUpperCase()}</Text>
                </View>

                {/* Away Team Side */}
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
                </View>
            </View>
        );
    }

    // Layout for Cricket (Score under Teams)
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

            <View style={styles.cricketCenterBoard}>
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

