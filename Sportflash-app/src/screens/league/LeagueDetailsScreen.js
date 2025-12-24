import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import StandingsWidget from '@components/match/StandingsWidget';
import { useGetMatchStandingsQuery } from '@store/api/matchesApi';

export default function LeagueDetailsScreen({ navigation, route }) {
    const { leagueId, sport = 'football' } = route.params || {};
    const [activeTab, setActiveTab] = useState('Standings');

    // Fetch Standings Data for this League using existing API endpoint
    // We reuse the match standings query since it accepts leagueId
    const { data: standingsData, isLoading } = useGetMatchStandingsQuery({
        sport,
        leagueId
    }, { skip: !leagueId });

    // Mock header info (In a real app, we'd fetch League Info specifically)
    // For now, we rely on what we have or show a loader
    const leagueName = standingsData?.length > 0 ? standingsData[0]?.leagueName : 'League Details';

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Standings':
                return (
                    <View style={styles.tabContent}>
                        <StandingsWidget
                            data={standingsData}
                        // No specific team to highlight here, seeing the whole table
                        />
                    </View>
                );
            case 'Fixtures':
                return (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Upcoming Fixtures Coming Soon</Text>
                    </View>
                );
            case 'Stats':
                return (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Top Scorers & Stats Coming Soon</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {standingsData?.[0]?.round ? `${standingsData[0].round}` : 'Tournament'}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            {/* League Hero (Using Mock or derived data) */}
            <View style={styles.hero}>
                <View style={styles.logoPlaceholder}>
                    <Ionicons name="trophy" size={32} color={theme.colors.primary} />
                </View>
                <Text style={styles.leagueName}>{leagueId ? `League #${leagueId}` : 'Select a League'}</Text>
                {standingsData && <Text style={styles.seasonText}>Season 2024/25</Text>}
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
                {['Standings', 'Fixtures', 'Stats'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tabItem,
                            activeTab === tab && styles.activeTabItem
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.content}>
                {renderTabContent()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    hero: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    logoPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    leagueName: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    seasonText: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    tabItem: {
        marginRight: theme.spacing.xl,
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabItem: {
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    activeTabText: {
        color: theme.colors.primary,
    },
    content: {
        flex: 1,
    },
    tabContent: {
        padding: theme.spacing.lg,
    },
    placeholderContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    placeholderText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
    }
});
