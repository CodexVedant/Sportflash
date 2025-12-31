import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '@utils/theme';
import { Section, EmptyData, PlayerRow } from './SharedComponents';
import { styles } from '@utils/style/BasketballStats.styles';
import { Match } from '@app-types/models/match';

interface BasketballStatsProps {
    match: Match;
    onPlayerPress?: (player: any) => void;
}

const BasketballStats = ({ match, onPlayerPress }: BasketballStatsProps) => {
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
                        {homeTeam.score?.toString()}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text style={[styles.teamName, { flex: 2 }]}>{awayTeam.name}</Text>
                    <Text style={styles.scoreText}>{basketballData.away_q1 || '-'}</Text>
                    <Text style={styles.scoreText}>{basketballData.away_q2 || '-'}</Text>
                    <Text style={styles.scoreText}>{basketballData.away_q3 || '-'}</Text>
                    <Text style={styles.scoreText}>{basketballData.away_q4 || '-'}</Text>
                    <Text style={[styles.scoreText, { color: theme.colors.primary, fontWeight: 'bold' }]}>
                        {awayTeam.score?.toString()}
                    </Text>
                </View>
            </Section>

            {/* Team Stats */}
            {statistics && statistics.length > 0 && (
                <Section title="Team Stats">
                    {statistics.map((stat: any, index: number) => (
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
                            lineups.home.startXI.map((player: any, idx: number) => (
                                <PlayerRow
                                    key={idx}
                                    name={player.name}
                                    number={player.number}
                                    position={player.position}
                                    sport="basketball"
                                    onPress={() => onPlayerPress && onPlayerPress({ ...player, sport: 'basketball' })}
                                />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Not available yet</Text>
                        )}
                    </Section>
                    <Section title={`${awayTeam.name} Starting 5`}>
                        {lineups.away?.startXI?.length > 0 ? (
                            lineups.away.startXI.map((player: any, idx: number) => (
                                <PlayerRow
                                    key={idx}
                                    name={player.name}
                                    number={player.number}
                                    position={player.position}
                                    sport="basketball"
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
export default BasketballStats;

