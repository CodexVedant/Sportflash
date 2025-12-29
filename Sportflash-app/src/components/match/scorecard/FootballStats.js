import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { theme } from '@utils/theme';
import { Section, EmptyData, PlayerRow } from './SharedComponents';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@utils/style/FootballStats.styles';

const FootballStats = ({ match, onPlayerPress }) => {
    const { statistics, events, lineups, homeTeam, awayTeam } = match;

    // Use stats if available, otherwise show empty
    if (!statistics && !events && !lineups) return <EmptyData message="No match details available" />;

    return (
        <View style={styles.container}>
            {/* Match Stats Summary */}
            {statistics && (
                <Section title="Match Stats">
                    {statistics.map((stat, index) => (
                        <View key={index} style={styles.statRow}>
                            <Text style={[styles.statValue, { textAlign: 'right' }]}>{stat.home}</Text>
                            <Text style={styles.statLabel}>{stat.type}</Text>
                            <Text style={[styles.statValue, { textAlign: 'left' }]}>{stat.away}</Text>
                        </View>
                    ))}
                </Section>
            )}

            {/* Key Events */}
            {events && events.length > 0 && (
                <Section title="Key Events">
                    {events.map((event, index) => (
                        <View key={index} style={styles.eventRow}>
                            <Text style={styles.eventTime}>{event.time}'</Text>
                            <View style={styles.eventDetails}>
                                <Ionicons
                                    name={event.type === 'goal' ? 'football' : 'alert-circle'}
                                    size={16}
                                    color={event.team === 'home' ? theme.colors.primary : theme.colors.secondary}
                                />
                                <TouchableOpacity onPress={() => onPlayerPress && onPlayerPress({ name: event.player, sport: 'football' })}>
                                    <Text style={[styles.eventText, { color: theme.colors.primary }]}>
                                        {event.player} ({event.type})
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </Section>
            )}

            {/* Lineups */}
            {lineups && (
                <View>
                    <Section title={`${homeTeam.name} XI`}>
                        {lineups.home?.startXI?.length > 0 ? (
                            lineups.home.startXI.map((player, idx) => (
                                <PlayerRow
                                    key={idx}
                                    {...player}
                                    onPress={() => onPlayerPress && onPlayerPress({ ...player, sport: 'football' })}
                                />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Not available yet</Text>
                        )}
                    </Section>
                    <Section title={`${awayTeam.name} XI`}>
                        {lineups.away?.startXI?.length > 0 ? (
                            lineups.away.startXI.map((player, idx) => (
                                <PlayerRow
                                    key={idx}
                                    {...player}
                                    onPress={() => onPlayerPress && onPlayerPress({ ...player, sport: 'football' })}
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
export default FootballStats;
