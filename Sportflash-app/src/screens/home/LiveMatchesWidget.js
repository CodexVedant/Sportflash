import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { theme } from '@utils/theme';
import MatchCard from '@components/match/MatchCard';

export default function LiveMatchesWidget({ matches, loading, width, navigation, gap, ListFooterComponent }) {

    // Logic for layout
    const isDesktop = width > 768;
    const numColumns = width > 1024 ? 3 : (isDesktop ? 2 : 1);
    const padding = theme.spacing.lg * 2;
    const contentWidth = isDesktop ? Math.min(width, 1200) : width;

    const cardWidth = isDesktop
        ? (contentWidth - padding - (gap * (numColumns - 1))) / numColumns
        : '100%';

    // Group matches by league and flatten for FlashList
    const flattenedData = React.useMemo(() => {
        if (!matches || matches.length === 0) return [];

        const grouped = matches.reduce((acc, match) => {
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
                                    <View style={styles.leagueHeader}>
                                        <Text style={styles.leagueTitle}>{item.title}</Text>
                                    </View>
                                );
                            }
                            return (
                                <View style={{ marginBottom: isDesktop ? 0 : 16, maxWidth: cardWidth }}>
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
                        keyExtractor={item => item.id.toString()}
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
