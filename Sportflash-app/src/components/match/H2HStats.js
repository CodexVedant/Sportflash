import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function H2HStats({ data, team1, team2 }) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <EmptyState message="No head-to-head history available." />;
    }

    const renderItem = ({ item }) => {
        // Parse result logic (simple for now)
        const isTeam1Winner = item.match_hometeam_name === team1?.name && item.match_hometeam_score > item.match_awayteam_score;
        // This logic heavily depends on API response keys. Assuming AllSportsAPI keys.

        return (
            <View style={styles.matchRow}>
                <Text style={styles.date}>{item.match_date}</Text>
                <View style={[styles.teamContainer, { alignItems: 'flex-end' }]}>
                    <Text style={[styles.teamName, item.match_hometeam_name === team1?.name && styles.highlightTeam]}>
                        {item.match_hometeam_name}
                    </Text>
                </View>
                <View style={styles.scoreContainer}>
                    <Text style={styles.score}>{item.match_hometeam_score} - {item.match_awayteam_score}</Text>
                </View>
                <View style={[styles.teamContainer, { alignItems: 'flex-start' }]}>
                    <Text style={[styles.teamName, item.match_awayteam_name === team2?.name && styles.highlightTeam]}>
                        {item.match_awayteam_name}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Previous Encounters</Text>
            </View>
            <View style={styles.list}>
                {data.map((item, index) => (
                    <View key={index} style={styles.matchItem}>
                        {renderItem({ item })}
                    </View>
                ))}
            </View>
        </View>
    );
}

const EmptyState = ({ message }) => (
    <View style={styles.conversational}>
        <Ionicons name="stats-chart-outline" size={48} color={theme.colors.textMuted} />
        <Text style={styles.emptyText}>{message}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    header: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    headerTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 14,
    },
    list: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 8,
        padding: 8,
    },
    matchItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    matchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    date: {
        color: theme.colors.textMuted,
        fontSize: 10,
        position: 'absolute',
        top: -8,
        left: 0,
    },
    teamContainer: {
        flex: 1,
    },
    teamName: {
        color: theme.colors.textMuted,
        fontSize: 13,
    },
    highlightTeam: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    scoreContainer: {
        width: 60,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 4,
        borderRadius: 4,
        marginHorizontal: 8,
    },
    score: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 14,
    },
    conversational: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
    }
});
