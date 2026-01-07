import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { theme } from '@utils/theme';
import MatchCard from '@components/match/MatchCard';

export default function LiveMatchesWidget({ matches, loading, width, navigation, gap, ListFooterComponent, preferences = {}, onNotificationPress }) {

    // Logic for layout
    const isDesktop = width > 768;
    const numColumns = 1;

    // Group matches by league and flatten
    const flattenedData = React.useMemo(() => {
        if (!matches || matches.length === 0) return [];

        const uniqueMatches = [];
        const seenIds = new Set();

        matches.forEach(match => {
            // Use match.id or fallback to a composite key of team names
            const uniqueKey = match.id || `${match.homeTeam?.name}_${match.awayTeam?.name}`;

            if (!seenIds.has(uniqueKey)) {
                seenIds.add(uniqueKey);
                uniqueMatches.push(match);
            }
        });

        const grouped = uniqueMatches.reduce((acc, match) => {
            // Strict validation: Ensure match has valid teams and names
            if (!match.homeTeam?.name || !match.awayTeam?.name) return acc;

            const league = match.league || 'Others';
            if (!acc[league]) acc[league] = [];
            acc[league].push(match);
            return acc;
        }, {});

        const flatList = [];
        Object.keys(grouped).sort().forEach(league => {
            flatList.push({ type: 'header', title: league, id: `header-${league}` });
            grouped[league].forEach(match => {
                flatList.push({ type: 'match', ...match });
            });
        });
        return flatList;
    }, [matches]);

    return (
        <View style={[styles.section, { flex: 1 }]}>
            {/* <Text style={styles.sectionTitle}>LIVE MATCHES</Text> */}
            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : flattenedData.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No live matches right now.</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.matchesScroll}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                >
                    {flattenedData.map((item, index) => {
                        if (item.type === 'header') {
                            return (
                                <View key={item.id} style={styles.leagueHeader}>
                                    <Text style={styles.leagueTitle}>{item.title}</Text>
                                </View>
                            );
                        }
                        return (
                            <View key={item.id || index} style={{ marginBottom: 4 }}>
                                <MatchCard
                                    sport={item.sport}
                                    status={item.status}
                                    displayStatus={item.displayStatus}
                                    league={item.league}
                                    homeTeam={item.homeTeam}
                                    awayTeam={item.awayTeam}
                                    score={item.score}
                                    timer={item.timer}
                                    onPress={() => navigation.navigate('MatchDetail', { match: item })}
                                    onNotificationPress={() => onNotificationPress(item)}
                                    isSubscribed={
                                        !!(
                                            preferences[`match_${item.id}`] ||
                                            preferences[`series_${item.league}`] ||
                                            preferences[`team_${item.homeTeam?.name}`] ||
                                            preferences[`team_${item.awayTeam?.name}`]
                                        )
                                    }
                                />
                            </View>
                        );
                    })}
                    {ListFooterComponent}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: theme.spacing.xl,
        minHeight: 200,
    },
    matchesScroll: {
        maxHeight: 780, // Limit height to make it a scrollable widget
    },
    sectionTitle: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.sm,
        fontWeight: '600',
        marginBottom: theme.spacing.md,
        letterSpacing: 1,
    },
    leagueHeader: {
        backgroundColor: theme.colors.surface,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: theme.spacing.sm,
        marginTop: theme.spacing.md,
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
        // Ensure zIndex is managed if needed, but in normal View flow it should be fine
        zIndex: 10,
    },
    leagueTitle: {
        color: theme.colors.text,
        fontWeight: '700',
        fontSize: 12,
        textTransform: 'uppercase',
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
});
