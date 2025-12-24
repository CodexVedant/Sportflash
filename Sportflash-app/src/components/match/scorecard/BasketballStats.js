import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@utils/theme';
import { Section, EmptyData, PlayerRow } from './SharedComponents';

const BasketballStats = ({ match, onPlayerPress }) => {
    const { basketballData, homeTeam, awayTeam, lineups, statistics } = match;

    if (!basketballData) return <EmptyData message="No game stats available" />;

    return (
        <View style={styles.container}>
            <Section title="Quarter Scores">
                <View style={styles.tableHeader}>
                    <Text style={[styles.headerText, { flex: 2, textAlign: 'left' }]}>Team</Text>
                    <Text style={styles.headerText}>Q1</Text>
                    <Text style={styles.headerText}>Q2</Text>
                    <Text style={styles.headerText}>Q3</Text>
                    <Text style={styles.headerText}>Q4</Text>
                    <Text style={[styles.headerText, { color: theme.colors.primary }]}>T</Text>
                </View>

                {/* Home Team Row */}
                <View style={styles.row}>
                    <Text style={[styles.teamName, { flex: 2 }]}>{homeTeam.name}</Text>
                    <Text style={styles.scoreText}>{basketballData.home_q1 || '-'}</Text>
                    <Text style={styles.scoreText}>{basketballData.home_q2 || '-'}</Text>
                    <Text style={styles.scoreText}>{basketballData.home_q3 || '-'}</Text>
                    <Text style={styles.scoreText}>{basketballData.home_q4 || '-'}</Text>
                    <Text style={[styles.scoreText, { color: theme.colors.primary, fontWeight: 'bold' }]}>
                        {homeTeam.score}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text style={[styles.teamName, { flex: 2 }]}>{awayTeam.name}</Text>
                    <Text style={styles.scoreText}>{basketballData.away_q1 || '-'}</Text>
                    <Text style={styles.scoreText}>{basketballData.away_q2 || '-'}</Text>
                    <Text style={styles.scoreText}>{basketballData.away_q3 || '-'}</Text>
                    <Text style={styles.scoreText}>{basketballData.away_q4 || '-'}</Text>
                    <Text style={[styles.scoreText, { color: theme.colors.primary, fontWeight: 'bold' }]}>
                        {awayTeam.score}
                    </Text>
                </View>
            </Section>

            {/* Team Stats */}
            {statistics && statistics.length > 0 && (
                <Section title="Team Stats">
                    {statistics.map((stat, index) => (
                        <View key={index} style={styles.statRow}>
                            <Text style={[styles.statValue, { textAlign: 'right' }]}>{stat.home}</Text>
                            <Text style={styles.statLabel}>{stat.type}</Text>
                            <Text style={[styles.statValue, { textAlign: 'left' }]}>{stat.away}</Text>
                        </View>
                    ))}
                </Section>
            )}

            {/* Lineups (Starting 5) */}
            {lineups && (
                <View>
                    <Section title={`${homeTeam.name} Starting 5`}>
                        {lineups.home?.startXI?.length > 0 ? (
                            lineups.home.startXI.map((player, idx) => (
                                <PlayerRow
                                    key={idx}
                                    {...player}
                                    onPress={() => onPlayerPress && onPlayerPress({ ...player, sport: 'basketball' })}
                                />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Not available yet</Text>
                        )}
                    </Section>
                    <Section title={`${awayTeam.name} Starting 5`}>
                        {lineups.away?.startXI?.length > 0 ? (
                            lineups.away.startXI.map((player, idx) => (
                                <PlayerRow
                                    key={idx}
                                    {...player}
                                    onPress={() => onPlayerPress && onPlayerPress({ ...player, sport: 'basketball' })}
                                />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Not available yet</Text>
                        )}
                    </Section>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        marginBottom: theme.spacing.sm,
    },
    headerText: {
        flex: 1,
        color: theme.colors.textMuted,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.02)',
    },
    teamName: {
        color: theme.colors.text,
        fontSize: 13,
        fontWeight: '600',
    },
    scoreText: {
        flex: 1,
        color: theme.colors.text,
        textAlign: 'center',
        fontSize: 13,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
    },
    statLabel: {
        color: theme.colors.textMuted,
        fontSize: 12,
        flex: 1,
        textAlign: 'center',
    },
    statValue: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 14,
        flex: 1,
        textAlign: 'center',
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 10,
    },
});

export default BasketballStats;
