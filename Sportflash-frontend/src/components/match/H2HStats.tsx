import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@utils/style/H2HStats.styles';

interface H2HMatchItem {
    match_date: string;
    match_hometeam_name: string;
    match_awayteam_name: string;
    match_hometeam_score: string | number;
    match_awayteam_score: string | number;
}

interface Team {
    name: string;
}

interface H2HStatsProps {
    data: H2HMatchItem[];
    team1: Team;
    team2: Team;
}

const EmptyState = ({ message }: { message: string }) => (
    <View style={styles.conversational}>
        <Ionicons name="stats-chart-outline" size={48} color={theme.colors.textMuted} />
        <Text style={styles.emptyText}>{message}</Text>
    </View>
);

export default function H2HStats({ data, team1, team2 }: H2HStatsProps) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <EmptyState message="No head-to-head history available." />;
    }

    const renderItem = ({ item }: { item: H2HMatchItem }) => {
        // Parse result logic (simple for now)
        // const isTeam1Winner = item.match_hometeam_name === team1?.name && item.match_hometeam_score > item.match_awayteam_score;
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
