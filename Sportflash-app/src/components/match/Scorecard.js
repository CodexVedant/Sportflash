import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Scorecard({ match, onPlayerPress }) {
    if (!match) return <EmptyData message="No match data available" />;

    const { sport } = match;

    const renderContent = () => {
        switch (sport?.toLowerCase()) {
            case 'football':
            case 'soccer':
                return <FootballStats match={match} />;
            case 'basketball':
                // For basketball, we might show quarter scores or player stats if available
                return <BasketballStats match={match} />;
            case 'cricket':
                return <CricketScorecard match={match} onPlayerPress={onPlayerPress} />;
            default:
                return (
                    <View style={styles.section}>
                        <Text style={styles.emptyText}>Detailed stats not available for {sport}</Text>
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            {renderContent()}
        </View>
    );
}

// --- Specific Sport Components ---

const FootballStats = ({ match }) => {
    const { goalscorers, cards, lineups, statistics } = match;
    const hasGoals = goalscorers && goalscorers.length > 0;
    const hasCards = cards && cards.length > 0;
    const hasStats = statistics && statistics.length > 0;

    return (
        <View>
            {/* Goalscorers */}
            <Section title="Goals">
                {hasGoals ? goalscorers.map((goal, i) => (
                    <View key={i} style={styles.row}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="football" size={16} color={theme.colors.text} style={{ marginRight: 8 }} />
                            <Text style={styles.text}>{goal.home_scorer || goal.away_scorer}</Text>
                        </View>
                        <Text style={styles.value}>{goal.time}'</Text>
                    </View>
                )) : <EmptyData message="No goals yet" />}
            </Section>

            {/* Cards */}
            {hasCards && (
                <Section title="Cards">
                    {cards.map((card, i) => (
                        <View key={i} style={styles.row}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={[styles.cardIcon, { backgroundColor: card.card === 'red card' ? '#ef4444' : '#eab308' }]} />
                                <Text style={styles.text}>{card.home_fault || card.away_fault}</Text>
                            </View>
                            <Text style={styles.value}>{card.time}'</Text>
                        </View>
                    ))}
                </Section>
            )}

            {/* Lineups (Simple list for now) */}
            {lineups && lineups.home && (
                <Section title={`Lineups - ${match.homeTeam.name}`}>
                    {lineups.home.starting_lineups?.map((player, i) => (
                        <View key={i} style={styles.row}>
                            <Text style={styles.text}>{player.player} <Text style={styles.subText}>({player.player_number})</Text></Text>
                            <Text style={styles.value}>{player.player_position}</Text>
                        </View>
                    ))}
                </Section>
            )}
        </View>
    );
};

const CricketScorecard = ({ match, onPlayerPress }) => {
    const { scorecard, lineups } = match;
    // Note: detailed scorecard object structure varies by provider. 
    // Assuming simple structure or falling back to Lineups if scorecard is missing.

    if (!scorecard && (!lineups || !lineups.home)) {
        return <EmptyData message="Scorecard not yet available. Match may not have started." />;
    }

    // Displaying Lineups as fallback/primary if scorecard is complex/missing
    return (
        <View>
            {/* Simple Lineup Display for Cricket */}
            <Section title={`Playing XI - ${match.homeTeam.name}`}>
                {lineups?.home?.starting_lineups?.map((p, i) => (
                    <TouchableOpacity key={i} style={styles.row} onPress={() => onPlayerPress && onPlayerPress(p)}>
                        <Text style={styles.text}>{p.player}</Text>
                        <Text style={styles.value}>{p.player_position}</Text>
                    </TouchableOpacity>
                )) || <EmptyData />}
            </Section>

            <Section title={`Playing XI - ${match.awayTeam.name}`}>
                {lineups?.away?.starting_lineups?.map((p, i) => (
                    <TouchableOpacity key={i} style={styles.row} onPress={() => onPlayerPress && onPlayerPress(p)}>
                        <Text style={styles.text}>{p.player}</Text>
                        <Text style={styles.value}>{p.player_position}</Text>
                    </TouchableOpacity>
                )) || <EmptyData />}
            </Section>
        </View>
    );
};

const BasketballStats = ({ match }) => {
    const { score, basketballData } = match;
    // score.quarters usually has "10-15, 23-20..."

    return (
        <View>
            <Section title="Quarter Scores">
                {score?.quarters ? (
                    <View style={styles.pilledBox}>
                        <Text style={styles.scoreText}>{score.quarters}</Text>
                    </View>
                ) : <EmptyData message="Quarter scores not available" />}
            </Section>

            {/* Lineups if available */}
            {match.lineups && match.lineups.home && (
                <Section title="Format">
                    <Text style={styles.text}>Lineups data structure varies by league.</Text>
                </Section>
            )}
        </View>
    );
}

// --- Common Components ---

const Section = ({ title, children }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionContent}>
            {children}
        </View>
    </View>
);

const EmptyData = ({ message = "No data available" }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{message}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        paddingBottom: 40,
    },
    section: {
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        overflow: 'hidden',
    },
    sectionHeader: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sectionContent: {
        padding: 0,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    text: {
        color: theme.colors.text,
        fontSize: 14,
    },
    subText: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
    value: {
        color: theme.colors.textMuted,
        fontSize: 13,
        fontWeight: '600',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
    },
    cardIcon: {
        width: 12,
        height: 16,
        borderRadius: 2,
        marginRight: 10,
    },
    pilledBox: {
        padding: 15,
        alignItems: 'center',
    },
    scoreText: {
        color: theme.colors.text,
        fontSize: 18,
        fontFamily: theme.fonts.mono,
    }
});
