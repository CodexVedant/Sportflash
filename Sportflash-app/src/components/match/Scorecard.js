import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
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

    return (
        <View>
            <MatchStatsSummary statistics={statistics} />

            <Section title="Match Events">
                {hasGoals ? goalscorers.map((goal, i) => (
                    <EventRow key={`g-${i}`} icon="football" time={goal.time} text={goal.home_scorer || goal.away_scorer} side={goal.home_scorer ? 'home' : 'away'} />
                )) : null}
                {hasCards ? cards.map((card, i) => (
                    <EventRow
                        key={`c-${i}`}
                        icon="card"
                        color={card.card === 'red card' ? '#ef4444' : '#eab308'}
                        time={card.time}
                        text={card.home_fault || card.away_fault}
                        side={card.home_fault ? 'home' : 'away'}
                    />
                )) : null}
                {!hasGoals && !hasCards && <EmptyData message="No key events yet" />}
            </Section>

            {lineups && lineups.home && (
                <View>
                    <Section title={`${match.homeTeam.name} Lineup (${match.homeTeam.formation || ''})`}>
                        {lineups.home.starting_lineups?.map((p, i) => <PlayerRow key={i} player={p} />)}
                    </Section>
                    <Section title={`${match.awayTeam.name} Lineup (${match.awayTeam.formation || ''})`}>
                        {lineups.away.starting_lineups?.map((p, i) => <PlayerRow key={i} player={p} />)}
                    </Section>
                </View>
            )}
        </View>
    );
};

const CricketScorecard = ({ match, onPlayerPress }) => {
    const { scorecard, lineups } = match;

    // If we have detailed scorecard data (common structure: scorecard[innings].batsmen)
    // Adjust logic based on actual API response structure for 'scorecard'

    if (!scorecard) {
        // Fallback to simple Lineups if no detailed scores
        return (
            <View>
                <EmptyData message="Full scorecard not available yet." />
                {lineups && (
                    <>
                        <Section title={`${match.homeTeam.name} XI`}>
                            {lineups.home?.starting_lineups?.map((p, i) => <PlayerRow key={i} player={p} onPress={() => onPlayerPress && onPlayerPress(p)} />)}
                        </Section>
                        <Section title={`${match.awayTeam.name} XI`}>
                            {lineups.away?.starting_lineups?.map((p, i) => <PlayerRow key={i} player={p} onPress={() => onPlayerPress && onPlayerPress(p)} />)}
                        </Section>
                    </>
                )}
            </View>
        );
    }

    // Render detailed scorecard tables
    return (
        <View>
            <ScorecardInning title={`${match.homeTeam.name} Innings`} inningData={scorecard.home || scorecard['1'] || scorecard[0]} />
            <ScorecardInning title={`${match.awayTeam.name} Innings`} inningData={scorecard.away || scorecard['2'] || scorecard[1]} />
        </View>
    );
};

const ScorecardInning = ({ title, inningData }) => {
    if (!inningData) return null;
    const batsmen = inningData.batsmen || inningData.batting || [];
    const bowlers = inningData.bowlers || inningData.bowling || [];

    return (
        <Section title={title}>
            {/* Batting Header */}
            <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 3, textAlign: 'left' }]}>Batter</Text>
                <Text style={styles.th}>R</Text>
                <Text style={styles.th}>B</Text>
                <Text style={styles.th}>4s</Text>
                <Text style={styles.th}>6s</Text>
                <Text style={styles.th}>SR</Text>
            </View>
            {batsmen.map((b, i) => (
                <View key={i} style={styles.tableRow}>
                    <View style={{ flex: 3 }}>
                        <Text style={styles.tdName}>{b.name || b.player}</Text>
                        <Text style={styles.tdSub}>{b.status || b.how_out}</Text>
                    </View>
                    <Text style={[styles.td, styles.tdBold]}>{b.R || b.runs || 0}</Text>
                    <Text style={styles.td}>{b.B || b.balls || 0}</Text>
                    <Text style={styles.td}>{b['4s'] || 0}</Text>
                    <Text style={styles.td}>{b['6s'] || 0}</Text>
                    <Text style={styles.td}>{b.SR || b.strike_rate || '-'}</Text>
                </View>
            ))}

            <View style={{ height: 16 }} />

            {/* Bowling Header */}
            <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 3, textAlign: 'left' }]}>Bowler</Text>
                <Text style={styles.th}>O</Text>
                <Text style={styles.th}>M</Text>
                <Text style={styles.th}>R</Text>
                <Text style={styles.th}>W</Text>
                <Text style={styles.th}>ER</Text>
            </View>
            {bowlers.map((b, i) => (
                <View key={i} style={styles.tableRow}>
                    <Text style={[styles.tdName, { flex: 3 }]}>{b.name || b.player}</Text>
                    <Text style={styles.td}>{b.O || b.overs}</Text>
                    <Text style={styles.td}>{b.M || b.maidens}</Text>
                    <Text style={styles.td}>{b.R || b.runs}</Text>
                    <Text style={[styles.td, styles.tdBold]}>{b.W || b.wickets}</Text>
                    <Text style={styles.td}>{b.ER || b.economy}</Text>
                </View>
            ))}
        </Section>
    );
};

const BasketballStats = ({ match }) => {
    const { basketballData, score } = match;
    const quarters = score?.quarters; // "25-20, 18-22..."

    return (
        <View>
            <Section title="Box Score (Q1 / Q2 / Q3 / Q4)">
                <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 2, textAlign: 'left' }]}>Team</Text>
                    <Text style={styles.th}>Q1</Text>
                    <Text style={styles.th}>Q2</Text>
                    <Text style={styles.th}>Q3</Text>
                    <Text style={styles.th}>Q4</Text>
                    <Text style={[styles.th, styles.tdBold]}>T</Text>
                </View>
                <BasketballRow team={match.homeTeam.name} scores={quarters} total={match.homeTeam.score} />
                <BasketballRow team={match.awayTeam.name} scores={quarters} total={match.awayTeam.score} />
            </Section>
        </View>
    );
}

const BasketballRow = ({ team, scores, total }) => {
    // Basic parser for demonstration
    // If scores is "20-10, 15-15, 10-10, 5-5", split it
    let q1 = '-', q2 = '-', q3 = '-', q4 = '-';
    if (scores && typeof scores === 'string') {
        const parts = scores.split(',').map(s => s.trim().split('-'));
        // This logic heavily depends on API format. Assuming "Home-Away"
        // Adjust indices securely
        if (parts[0]) q1 = parts[0][0];
        if (parts[1]) q2 = parts[1][0];
    }

    // Note: The logic above is messy without knowing precise API response. 
    // Showing placeholders for now to indicate layout.

    return (
        <View style={styles.tableRow}>
            <Text style={[styles.tdName, { flex: 2 }]} numberOfLines={1}>{team}</Text>
            <Text style={styles.td}>{q1}</Text>
            <Text style={styles.td}>{q2}</Text>
            <Text style={styles.td}>{q3}</Text>
            <Text style={styles.td}>{q4}</Text>
            <Text style={[styles.td, styles.tdBold]}>{total}</Text>
        </View>
    )
};

// --- Helper Components ---

const MatchStatsSummary = ({ statistics }) => {
    if (!statistics || statistics.length === 0) return null;
    return (
        <Section title="Match Stats">
            {statistics.map((stat, i) => {
                const homeVal = parseFloat(stat.home) || 0;
                const awayVal = parseFloat(stat.away) || 0;
                const total = homeVal + awayVal;
                const homePct = total > 0 ? (homeVal / total) * 100 : 50;
                const awayPct = total > 0 ? (awayVal / total) * 100 : 50;

                return (
                    <View key={i} style={styles.statBarRow}>
                        <Text style={styles.statLabel}>{stat.type}</Text>
                        <View style={styles.statBarContainer}>
                            <View style={[styles.statBar, { width: `${homePct}%`, backgroundColor: theme.colors.primary }]} />
                            <View style={[styles.statBar, { width: `${awayPct}%`, backgroundColor: theme.colors.secondary, alignSelf: 'flex-end', marginLeft: 'auto' }]} />
                        </View>
                        <View style={styles.statValues}>
                            <Text style={styles.statVal}>{stat.home}</Text>
                            <Text style={styles.statVal}>{stat.away}</Text>
                        </View>
                    </View>
                );
            })}
        </Section>
    );
}

const EventRow = ({ icon, time, text, side, color }) => (
    <View style={[styles.row, { justifyContent: side === 'home' ? 'flex-start' : 'flex-end' }]}>
        {side === 'home' && <Text style={[styles.value, { marginRight: 8, width: 25 }]}>{time}'</Text>}
        {side === 'home' && (icon === 'card' ? <View style={[styles.cardIcon, { backgroundColor: color || '#eab308' }]} /> : <Ionicons name={icon} size={16} color={theme.colors.text} style={{ marginRight: 8 }} />)}

        <Text style={styles.text}>{text}</Text>

        {side === 'away' && (icon === 'card' ? <View style={[styles.cardIcon, { backgroundColor: color || '#eab308', marginLeft: 8 }]} /> : <Ionicons name={icon} size={16} color={theme.colors.text} style={{ marginLeft: 8 }} />)}
        {side === 'away' && <Text style={[styles.value, { marginLeft: 8, width: 25, textAlign: 'right' }]}>{time}'</Text>}
    </View>
);

const PlayerRow = ({ player, onPress }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.jersey}>
                <Text style={styles.jerseyNum}>{player.player_number || '-'}</Text>
            </View>
            <Text style={styles.text}>{player.player}</Text>
        </View>
        <Text style={styles.value}>{player.player_position}</Text>
    </TouchableOpacity>
);

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
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.03)',
    },
    th: {
        color: theme.colors.textMuted,
        fontSize: 12,
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    td: {
        color: theme.colors.text,
        fontSize: 13,
        flex: 1,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    tdName: {
        color: theme.colors.text,
        fontSize: 13,
        fontWeight: '500',
    },
    tdSub: {
        color: theme.colors.textMuted,
        fontSize: 10,
    },
    tdBold: {
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    statBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    statLabel: {
        width: 100,
        color: theme.colors.text,
        fontSize: 12,
    },
    statBarContainer: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        flexDirection: 'row',
        overflow: 'hidden',
        marginHorizontal: 10,
    },
    statBar: {
        height: '100%',
    },
    statValues: {
        width: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statVal: {
        color: theme.colors.text,
        fontSize: 12,
        fontWeight: '600',
    },
    jersey: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    jerseyNum: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    }
});
