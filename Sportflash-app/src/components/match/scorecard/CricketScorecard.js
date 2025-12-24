import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '@utils/theme';
import { Section, PlayerRow, EmptyData } from './SharedComponents';

const CricketScorecard = ({ match, onPlayerPress }) => {
    const { score, scorecard, lineups, homeTeam, awayTeam } = match;

    if (!scorecard) return <EmptyData message="No scorecard available yet" />;

    return (
        <ScrollView style={styles.container}>
            {/* Innings Tabs or List */}
            {Object.keys(scorecard).map((inningKey, index) => {
                const inning = scorecard[inningKey];
                return (
                    <View key={index} style={styles.inningContainer}>
                        <View style={styles.inningHeader}>
                            <Text style={styles.inningTitle}>{inning.title || `Inning ${index + 1}`}</Text>
                            <Text style={styles.inningScore}>{inning.score}</Text>
                        </View>

                        {/* Batsmen */}
                        <Section title="Batting">
                            <View style={styles.tableHeader}>
                                <Text style={[styles.headerText, { flex: 2 }]}>Batter</Text>
                                <Text style={styles.headerText}>R</Text>
                                <Text style={styles.headerText}>B</Text>
                                <Text style={styles.headerText}>4s</Text>
                                <Text style={styles.headerText}>6s</Text>
                                <Text style={styles.headerText}>SR</Text>
                            </View>
                            {inning.batting?.map((batter, idx) => (
                                <View key={idx} style={styles.row}>
                                    <View style={{ flex: 2 }}>
                                        <TouchableOpacity onPress={() => onPlayerPress && onPlayerPress({ name: batter.player, sport: 'cricket' })}>
                                            <Text style={[styles.playerName, { color: theme.colors.primary }]}>{batter.player}</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.dismissal}>{batter.status}</Text>
                                    </View>
                                    <Text style={styles.statText}>{batter.runs}</Text>
                                    <Text style={styles.statText}>{batter.balls}</Text>
                                    <Text style={styles.statText}>{batter.fours}</Text>
                                    <Text style={styles.statText}>{batter.sixes}</Text>
                                    <Text style={styles.statText}>{batter.sr}</Text>
                                </View>
                            ))}
                        </Section>

                        {/* Bowlers */}
                        <Section title="Bowling">
                            <View style={styles.tableHeader}>
                                <Text style={[styles.headerText, { flex: 2 }]}>Bowler</Text>
                                <Text style={styles.headerText}>O</Text>
                                <Text style={styles.headerText}>M</Text>
                                <Text style={styles.headerText}>R</Text>
                                <Text style={styles.headerText}>W</Text>
                                <Text style={styles.headerText}>ER</Text>
                            </View>
                            {inning.bowling?.map((bowler, idx) => (
                                <View key={idx} style={styles.row}>
                                    <View style={{ flex: 2 }}>
                                        <TouchableOpacity onPress={() => onPlayerPress && onPlayerPress({ name: bowler.player, sport: 'cricket' })}>
                                            <Text style={[styles.playerName, { color: theme.colors.primary }]}>{bowler.player}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.statText}>{bowler.overs}</Text>
                                    <Text style={styles.statText}>{bowler.maidens}</Text>
                                    <Text style={styles.statText}>{bowler.runs}</Text>
                                    <Text style={styles.statText}>{bowler.wickets}</Text>
                                    <Text style={styles.statText}>{bowler.economy}</Text>
                                </View>
                            ))}
                        </Section>
                    </View>
                );
            })}

            {/* Playing XI Lineups */}
            {lineups && (
                <View style={{ marginTop: theme.spacing.lg }}>
                    <Section title={`${match.homeTeam.name} Playing XI`}>
                        {lineups.home?.startXI?.length > 0 ? (
                            lineups.home.startXI.map((player, idx) => (
                                <PlayerRow
                                    key={idx}
                                    {...player}
                                    onPress={() => onPlayerPress && onPlayerPress({ ...player, sport: 'cricket' })}
                                />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Not available yet</Text>
                        )}
                    </Section>
                    <Section title={`${match.awayTeam.name} Playing XI`}>
                        {lineups.away?.startXI?.length > 0 ? (
                            lineups.away.startXI.map((player, idx) => (
                                <PlayerRow
                                    key={idx}
                                    {...player}
                                    onPress={() => onPlayerPress && onPlayerPress({ ...player, sport: 'cricket' })}
                                />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Not available yet</Text>
                        )}
                    </Section>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inningContainer: {
        marginBottom: theme.spacing.xl,
    },
    inningHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        marginBottom: theme.spacing.sm,
    },
    inningTitle: {
        color: theme.colors.primary,
        fontSize: theme.sizes.md,
        fontWeight: 'bold',
    },
    inningScore: {
        color: theme.colors.text,
        fontSize: theme.sizes.md,
        fontWeight: 'bold',
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: theme.spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        marginBottom: theme.spacing.xs,
    },
    headerText: {
        flex: 1,
        color: theme.colors.textMuted,
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        alignItems: 'flex-start', // Align for multiline dismissal
    },
    playerName: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    dismissal: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontStyle: 'italic',
    },
    statText: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        alignSelf: 'center',
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 10,
    },
});

export default CricketScorecard;
