import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/StandingsWidget.styles';

interface StandingItem {
    team?: {
        id?: string | number;
        name?: string;
    };
    position: number;
    stats?: {
        played?: number;
        netRunRate?: string;
        goalDifference?: number;
        percentage?: string;
        points?: number;
    };
}

interface StandingsWidgetProps {
    data: StandingItem[];
    highlightTeams?: (string | number)[];
}

export default function StandingsWidget({ data, highlightTeams = [] }: StandingsWidgetProps) {
    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Standings not available</Text>
                <Text style={[styles.emptyText, { fontSize: 12, marginTop: 8, opacity: 0.7 }]}>
                    This league may not have started yet or uses a different format
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.th, { width: 40, textAlign: 'center' }]}>#</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'left' }]}>Team</Text>
                <Text style={[styles.th, { width: 30 }]}>P</Text>
                <Text style={[styles.th, { width: 40 }]}>NRR/GD</Text>
                <Text style={[styles.th, { width: 35, fontWeight: '900' }]}>Pts</Text>
            </View>

            <View>
                {data.map((item, index) => {
                    const isHighlighted = item.team?.id ? highlightTeams.includes(item.team.id) : false;
                    // Use generic accessor or NRR if available (Cricket usually has run rate)
                    const secondaryStat = item.stats?.netRunRate || item.stats?.goalDifference || item.stats?.percentage || '-';

                    return (
                        <View
                            key={index}
                            style={[
                                styles.row,
                                isHighlighted && styles.highlightedRow,
                                index < 4 && !item.stats?.netRunRate && { borderLeftColor: theme.colors.success, borderLeftWidth: 3 } // Style top 4
                            ]}
                        >
                            <Text style={[styles.td, { width: 40, textAlign: 'center' }]}>{item.position}</Text>
                            <Text style={[styles.tdName, { flex: 1 }, isHighlighted ? styles.highlightText : undefined]}>{item.team?.name}</Text>
                            <Text style={[styles.td, { width: 30 }]}>{item.stats?.played}</Text>
                            <Text style={[styles.td, { width: 40, fontSize: 10 }]}>{secondaryStat}</Text>
                            <Text style={[styles.td, { width: 35, fontWeight: 'bold' }, isHighlighted ? styles.highlightText : undefined]}>{item.stats?.points}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
