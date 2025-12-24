import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { theme } from '@utils/theme';
import MatchCard from '@components/match/MatchCard';

export default function LiveMatchesWidget({ matches, loading, width, navigation, gap, ListFooterComponent }) {

    // Logic for layout
    // Simplified layout mechanism - Vertical List only for consistency
    const isDesktop = width > 768;
    const numColumns = 1; // Force single column to avoid header span issues in FlashList
    const contentWidth = isDesktop ? Math.min(width, 1200) : width;

    // In future for desktop: We could use a different component for grid view if needed
    // but for now, a consistent vertical feed is safer.

    // Group matches by league and flatten for FlashList
    const flattenedData = React.useMemo(() => {
        if (!matches || matches.length === 0) return [];

        const grouped = matches.reduce((acc, match) => {
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
        console.log('Flattened Live Matches Data:', flatList.length, flatList);
        return flatList;
    }, [matches]);

    // Sticky header indices
    const stickyHeaderIndices = flattenedData
        .map((item, index) => item.type === 'header' ? index : null)
        .filter(item => item !== null);

    return (
        <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionTitle}>LIVE MATCHES</Text>

            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
                <View style={{ height: '100%', minHeight: 200 }}>
                    <FlashList
                        data={flattenedData}
                        renderItem={({ item }) => {
                            if (item.type === 'header') {
                                return (
                                    <View style={[styles.leagueHeader, { zIndex: 10 }]}>
                                        <Text style={styles.leagueTitle}>{item.title}</Text>
                                    </View>
                                );
                            }
                            return (
                                <View style={{ marginBottom: 4 }}>
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
                                    />
                                </View>
                            );
                        }}
                        getItemType={item => item.type}
                        estimatedItemSize={160}
                        numColumns={numColumns}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                        stickyHeaderIndices={stickyHeaderIndices}
                        ListFooterComponent={ListFooterComponent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No live matches right now.</Text>
                            </View>
                        }
                    />
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
    leagueHeader: {
        backgroundColor: theme.colors.surface,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginBottom: 0,
        marginTop: 0,
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
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
    gridContainer: {
        width: '100%',
    },
});
