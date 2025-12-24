import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@utils/theme';
import FootballStats from './scorecard/FootballStats';
import BasketballStats from './scorecard/BasketballStats';
import CricketScorecard from './scorecard/CricketScorecard';
import { EmptyData } from './scorecard/SharedComponents';

export default function Scorecard({ match, onPlayerPress }) {
    if (!match) return <EmptyData message="No match data available" />;

    const { sport } = match;

    const renderContent = () => {
        switch (sport?.toLowerCase()) {
            case 'football':
            case 'soccer':
                return <FootballStats match={match} onPlayerPress={onPlayerPress} />;
            case 'basketball':
                return <BasketballStats match={match} onPlayerPress={onPlayerPress} />;
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: theme.spacing.xl,
    },
    section: {
        padding: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: theme.borderRadius.md,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
    },
});
