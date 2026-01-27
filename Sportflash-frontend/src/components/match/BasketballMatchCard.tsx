import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import LiveBadge from './LiveBadge';
import TeamLogo from './TeamLogo';
import { styles } from '@utils/style/BasketballMatchCard.styles';
import { parseQuarters } from '@utils/script/BasketballMatchCard.helpers';
import { Match } from '@app-types/models/match';

interface BasketballMatchCardProps {
    match: Match;
    onPress?: (event: GestureResponderEvent) => void;
    onNotificationPress?: () => void;
    isSubscribed?: boolean;
}

function BasketballMatchCard({ match, onPress, onNotificationPress, isSubscribed }: BasketballMatchCardProps) {
    const { status, displayStatus, league, homeTeam, awayTeam, score } = match;

    // Parse quarters data
    const quarters = useMemo(() => parseQuarters(score), [score]);

    const renderScoreRow = (team: any, qScores: any) => {
        return (
            <View style={styles.scoreRow}>
                <View style={styles.teamInfo}>
                    <TeamLogo logo={team.logo} name={team.name} size={32} />
                    <Text style={styles.teamName} numberOfLines={1}>{team.name}</Text>
                </View>

                {quarters ? (
                    <View style={styles.quartersContainer}>
                        <Text style={styles.qScore}>{qScores?.q1 || '-'}</Text>
                        <Text style={styles.qScore}>{qScores?.q2 || '-'}</Text>
                        <Text style={styles.qScore}>{qScores?.q3 || '-'}</Text>
                        <Text style={styles.qScore}>{qScores?.q4 || '-'}</Text>
                    </View>
                ) : (
                    <View style={{ flex: 1 }} />
                )}

                <Text style={styles.totalScore}>{team.score || '0'}</Text>
            </View>
        );
    };

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
            <LinearGradient
                colors={[`${theme.colors.basketball}22`, 'rgba(15, 23, 42, 0.95)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        {status === 'live' ? (
                            <LiveBadge sport="basketball" status={displayStatus} />
                        ) : (
                            <View style={styles.badgeContainer}>
                                <Text style={styles.statusText}>{displayStatus?.toUpperCase() || status?.toUpperCase()}</Text>
                            </View>
                        )}
                        <Text style={styles.league} numberOfLines={1}>{(typeof league === 'object' ? league?.name : league) || 'League'}</Text>
                    </View>

                    {/* Notification Bell */}
                    {onNotificationPress && (
                        <TouchableOpacity
                            onPress={onNotificationPress}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={{ padding: 4 }}
                        >
                            <Ionicons
                                name={isSubscribed ? "notifications" : "notifications-outline"}
                                size={20}
                                color={isSubscribed ? '#FFD700' : theme.colors.textMuted}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Score Header (Q1, Q2, Q3, Q4 labels) */}
                {quarters && (
                    <View style={styles.tableHeader}>
                        <View style={{ flex: 1.5 }} />
                        <View style={styles.quartersHeader}>
                            <Text style={styles.headerText}>Q1</Text>
                            <Text style={styles.headerText}>Q2</Text>
                            <Text style={styles.headerText}>Q3</Text>
                            <Text style={styles.headerText}>Q4</Text>
                        </View>
                        <Text style={styles.headerTextTotal}>T</Text>
                    </View>
                )}

                {/* Home Team Row */}
                {renderScoreRow(homeTeam, {
                    q1: quarters?.q1?.home,
                    q2: quarters?.q2?.home,
                    q3: quarters?.q3?.home,
                    q4: quarters?.q4?.home
                })}

                {/* Spacer */}
                <View style={{ height: 12 }} />

                {/* Away Team Row */}
                {renderScoreRow(awayTeam, {
                    q1: quarters?.q1?.away,
                    q2: quarters?.q2?.away,
                    q3: quarters?.q3?.away,
                    q4: quarters?.q4?.away
                })}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>View Box Score</Text>
                </View>

            </LinearGradient>
        </TouchableOpacity>
    );
}


export default React.memo(BasketballMatchCard);
