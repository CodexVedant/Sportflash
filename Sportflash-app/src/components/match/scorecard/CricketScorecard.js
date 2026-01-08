import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '@utils/theme';
import { Section, PlayerRow, EmptyData } from './SharedComponents';
import { styles } from '@utils/style/CricketScorecard.styles';

const CricketScorecard = ({ match, onPlayerPress }) => {
    const { score, scorecard, lineups, homeTeam, awayTeam } = match;

    if (!scorecard) return <EmptyData message="No scorecard available yet" />;

    return (
        <ScrollView style={styles.container}>
            {/* Innings Tabs or List */}
            {Object.keys(scorecard).map((inningKey, index) => {
                const inning = scorecard[inningKey];

                // Helper to find ID from lineups, fallback to name-based ID
                const getPlayerId = (name) => {
                    if (!lineups) return `name_${name}`; // Fallback immediately
                    const allPlayers = [
                        ...(lineups.home?.startXI || []),
                        ...(lineups.home?.substitutes || []),
                        ...(lineups.away?.startXI || []),
                        ...(lineups.away?.substitutes || [])
                    ];
                    const found = allPlayers.find(p => p.name === name);
                    return (found && found.id) ? found.id : `name_${name}`;
                };

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
                                        <TouchableOpacity onPress={() => onPlayerPress && onPlayerPress({
                                            name: batter.player,
                                            id: getPlayerId(batter.player),
                                            sport: 'cricket'
                                        })}>
                                            <Text style={[styles.playerName, { color: theme.colors.primary }]}>{batter.player || '-'}</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.dismissal}>{batter.status || ''}</Text>
                                    </View>
                                    <Text style={styles.statText}>{batter.runs || '0'}</Text>
                                    <Text style={styles.statText}>{batter.balls || '0'}</Text>
                                    <Text style={styles.statText}>{batter.fours || '0'}</Text>
                                    <Text style={styles.statText}>{batter.sixes || '0'}</Text>
                                    <Text style={styles.statText}>{batter.sr || '0.00'}</Text>
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
                                        <TouchableOpacity onPress={() => onPlayerPress && onPlayerPress({
                                            name: bowler.player,
                                            id: getPlayerId(bowler.player),
                                            sport: 'cricket'
                                        })}>
                                            <Text style={[styles.playerName, { color: theme.colors.primary }]}>{bowler.player || '-'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.statText}>{bowler.overs || '0'}</Text>
                                    <Text style={styles.statText}>{bowler.maidens || '0'}</Text>
                                    <Text style={styles.statText}>{bowler.runs || '0'}</Text>
                                    <Text style={styles.statText}>{bowler.wickets || '0'}</Text>
                                    <Text style={styles.statText}>{bowler.economy || '0.00'}</Text>
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
                                    name={player.name}
                                    number={player.number}
                                    position={player.position}
                                    isCaptain={player.isCaptain}
                                    isWicketKeeper={player.isWicketKeeper}
                                    battingStyle={player.battingStyle}
                                    bowlingStyle={player.bowlingStyle}
                                    sport="cricket"
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
                                    name={player.name}
                                    number={player.number}
                                    position={player.position}
                                    isCaptain={player.isCaptain}
                                    isWicketKeeper={player.isWicketKeeper}
                                    battingStyle={player.battingStyle}
                                    bowlingStyle={player.bowlingStyle}
                                    sport="cricket"
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
export default CricketScorecard;
