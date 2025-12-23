import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@utils/theme';
import LiveBadge from './LiveBadge';
import TeamLogo from './TeamLogo';

export default function BasketballMatchCard({ match, onPress }) {
    const { status, displayStatus, league, homeTeam, awayTeam, score } = match;

    // Parse quarters data
    // API 'scores' format can vary, assuming generic structure or object
    const quarters = useMemo(() => {
        if (!score?.quarters) return null;

        // Helper to safely extract score from various API formats
        const getQScore = (qKey) => {
            // Check if quarters is an object with keys like "1st Quarter"
            const qData = score.quarters[qKey];
            if (Array.isArray(qData) && qData.length > 0) {
                return {
                    home: qData[0].score_home,
                    away: qData[0].score_away
                };
            }
            return { home: '-', away: '-' };
        };

        return {
            q1: getQScore('1st Quarter'),
            q2: getQScore('2nd Quarter'),
            q3: getQScore('3rd Quarter'),
            q4: getQScore('4th Quarter'),
        };
    }, [score]);


    const renderScoreRow = (team, qScores) => {
        return (
            <View style={styles.scoreRow}>
                <View style={styles.teamInfo}>
                    <TeamLogo logo={team.logo} name={team.name} size={32} />
                    <Text style={styles.teamName} numberOfLines={1}>{team.name}</Text>
                </View>

                {quarters ? (
                    <View style={styles.quartersContainer}>
                        <Text style={styles.qScore}>{qScores.q1}</Text>
                        <Text style={styles.qScore}>{qScores.q2}</Text>
                        <Text style={styles.qScore}>{qScores.q3}</Text>
                        <Text style={styles.qScore}>{qScores.q4}</Text>
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
                    {status === 'live' ? (
                        <LiveBadge sport="basketball" status={displayStatus} />
                    ) : (
                        <View style={styles.badgeContainer}>
                            <Text style={styles.statusText}>{displayStatus?.toUpperCase() || status?.toUpperCase()}</Text>
                        </View>
                    )}
                    <Text style={styles.league} numberOfLines={1}>{league}</Text>
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

const styles = StyleSheet.create({
    card: {
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: `${theme.colors.basketball}66`,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    badgeContainer: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.textMuted,
    },
    league: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.xs,
        flex: 1,
        textAlign: 'right',
        marginLeft: 8
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingRight: 8 // align with scores
    },
    quartersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 140, // Match width of quartersContainer
    },
    headerText: {
        fontSize: 10,
        color: theme.colors.textMuted,
        width: 30,
        textAlign: 'center',
    },
    headerTextTotal: {
        fontSize: 10,
        color: theme.colors.textMuted,
        width: 40,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    teamInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1.5,
        gap: 8,
    },
    teamName: {
        color: theme.colors.text,
        fontWeight: '600',
        fontSize: 14,
        flex: 1,
    },
    quartersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 140,
    },
    qScore: {
        color: theme.colors.textMuted,
        fontSize: 12,
        width: 30, // Fixed width for alignment
        textAlign: 'center',
    },
    totalScore: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 16,
        width: 40,
        textAlign: 'center',
    },
    footer: {
        marginTop: 12,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingTop: 8
    },
    footerText: {
        fontSize: 10,
        color: theme.colors.basketball,
        opacity: 0.8
    }
});
