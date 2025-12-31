import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { theme } from '@utils/theme';
import MatchCard from '@components/match/MatchCard';
import { styles } from '@utils/style/LiveMatchesWidget.styles';

interface LiveMatchesWidgetProps {
    matches: any[];
    loading: boolean;
    width: number;
    navigation: any;
    gap?: number;
    ListFooterComponent?: React.ReactNode;
}

export default function LiveMatchesWidget({ matches, loading, width, navigation, gap, ListFooterComponent }: LiveMatchesWidgetProps) {

    // Logic for layout
    const isDesktop = width > 768;
    // const numColumns = 1; // Unused variable removed

    // Group matches by league and flatten
    const flattenedData = React.useMemo(() => {
        if (!matches || matches.length === 0) return [];

        const uniqueMatches: any[] = [];
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
        }, {} as Record<string, any[]>);

        const flatList: any[] = [];
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
                                    match={item}
                                    sport={item.sport}
                                    status={item.status} // Pass status if MatchCard expects it separately, or just match
                                    title={item.title}  // If MatchCard needs title
                                    onPress={() => navigation.navigate('MatchDetail', { match: item })}
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
