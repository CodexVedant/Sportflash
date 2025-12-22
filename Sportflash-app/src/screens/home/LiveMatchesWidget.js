import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '@utils/theme';
import MatchCard from '@components/match/MatchCard';

export default function LiveMatchesWidget({ matches, loading, width, navigation, gap }) {

    // Logic for layout
    const isDesktop = width > 768;
    const numColumns = width > 1024 ? 3 : (isDesktop ? 2 : 1);
    const padding = theme.spacing.lg * 2;
    const contentWidth = isDesktop ? Math.min(width, 1200) : width;

    const cardWidth = isDesktop
        ? (contentWidth - padding - (gap * (numColumns - 1))) / numColumns
        : '100%';

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>TOP LIVE MATCHES</Text>

            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : matches.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No live matches right now.</Text>
                </View>
            ) : (
                <View style={[styles.gridContainer, isDesktop && { flexDirection: 'row', flexWrap: 'wrap', gap: gap }]}>
                    {matches.map(match => (
                        <View key={match.id} style={{ width: cardWidth, marginBottom: isDesktop ? 0 : 16 }}>
                            <MatchCard
                                sport={match.sport}
                                status={match.status}
                                league={match.league}
                                homeTeam={match.homeTeam}
                                awayTeam={match.awayTeam}
                                score={match.score}
                                timer={match.timer}
                                onPress={() => navigation.navigate('MatchDetail', { match })}
                            />
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.sm,
        fontWeight: '600',
        marginBottom: theme.spacing.md,
        letterSpacing: 1,
    },
    emptyContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: theme.borderRadius.lg,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: theme.sizes.md,
    },
    gridContainer: {
        width: '100%',
    },
});
