import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '@utils/theme';
import FootballStats from './scorecard/FootballStats';
import BasketballStats from './scorecard/BasketballStats';
import CricketScorecard from './scorecard/CricketScorecard';
import { EmptyData } from './scorecard/SharedComponents';
import { styles } from '@utils/style/Scorecard.styles';

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
