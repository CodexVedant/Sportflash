import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@utils/theme';
import { Section, EmptyData } from './SharedComponents';

const BasketballStats = ({ match }) => {
    const { basketballData, homeTeam, awayTeam } = match;

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

                {/* Away Team Row */}
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
});

export default BasketballStats;
