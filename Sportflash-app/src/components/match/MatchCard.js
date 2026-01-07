import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@utils/theme';
import LiveBadge from './LiveBadge';
import TeamLogo from './TeamLogo';
import { styles } from '@utils/style/MatchCard.styles';
import { getSportColor } from '@utils/script/MatchCard.helpers';
import { Ionicons } from '@expo/vector-icons';

const MatchCard = ({ sport, status, displayStatus, league, homeTeam, awayTeam, score, timer, onPress, onNotificationPress, isSubscribed }) => {
    if (!homeTeam || !awayTeam) return null;

    const sportColor = getSportColor(sport);

    // Pulsing Animation for 'LIVE' - Handled inside LiveBadge now

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
                {/* Header: Live Badge + League + Notification Bell */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {status === 'live' ? (
                            <LiveBadge sport={sport} status={displayStatus} />
                        ) : (
                            <View style={styles.badgeContainer}>
                                <Text style={[styles.statusText, { color: theme.colors.textMuted }]}>
                                    {status.toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <Text style={styles.league} numberOfLines={1}>{league}</Text>
                    </View>

                    {/* Notification Bell */}
                    {onNotificationPress && (
                        <TouchableOpacity
                            onPress={onNotificationPress}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={styles.bellButton}
                        >
                            <Ionicons
                                name={isSubscribed ? "notifications" : "notifications-outline"}
                                size={20}
                                color={isSubscribed ? theme.colors.warning : theme.colors.textMuted}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Scores Area */}
                <View style={styles.scoreContainer}>
                    {/* Home Team */}
                    <View style={styles.team}>
                        <TeamLogo logo={homeTeam.logo} name={homeTeam.name} />
                        <Text style={styles.teamName}>{homeTeam.name}</Text>
                        <Text style={styles.score}>{homeTeam.score}</Text>
                        {sport?.toLowerCase() === 'cricket' && homeTeam.runRate && (
                            <Text style={styles.subText}>RR: {homeTeam.runRate}</Text>
                        )}
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
                        <TeamLogo logo={awayTeam.logo} name={awayTeam.name} />
                        <Text style={styles.teamName}>{awayTeam.name}</Text>
                        <Text style={styles.score}>{awayTeam.score}</Text>
                        {sport?.toLowerCase() === 'cricket' && awayTeam.runRate && (
                            <Text style={styles.subText}>RR: {awayTeam.runRate}</Text>
                        )}
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: sportColor }]}>Click to view Dashboard</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default React.memo(MatchCard);


