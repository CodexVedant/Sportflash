import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@utils/theme';

export default function Scorecard({ homeTeamName, awayTeamName, onPlayerPress }) {
    // Mock data based on the extracted code
    const mockBatters = ['Virat Kohli', 'Rohit Sharma', 'Shubman Gill'];

    return (
        <View style={styles.tabContent}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Batting - {homeTeamName}</Text>
            </View>
            {mockBatters.map((p, i) => (
                <View key={i} style={styles.statRow}>
                    <TouchableOpacity onPress={() => onPlayerPress && onPlayerPress({ name: p, team: homeTeamName })}>
                        <Text style={styles.playerName}>{p}</Text>
                    </TouchableOpacity>
                    <Text style={styles.statValue}>{45 + i * 12} (32)</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    tabContent: {
        paddingBottom: 40,
    },
    sectionHeader: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    sectionTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    playerName: {
        color: theme.colors.text,
    },
    statValue: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
});
