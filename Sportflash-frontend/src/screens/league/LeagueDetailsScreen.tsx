import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import StandingsWidget from '@components/match/StandingsWidget';
import { useGetMatchStandingsQuery } from '@store/api/matchesApi';
import { styles } from '@utils/style/LeagueDetailsScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LeagueDetails'>;

export default function LeagueDetailsScreen({ navigation, route }: Props) {
    const { leagueId, sport = 'football', name, round } = route.params || {};
    const [activeTab, setActiveTab] = useState('Standings');

    // Fetch Standings Data for this League using existing API endpoint
    // We reuse the match standings query since it accepts leagueId
    const { data: standingsData, isLoading } = useGetMatchStandingsQuery({
        sport,
        leagueId
    }, { skip: !leagueId });

    // Mock header info (In a real app, we'd fetch League Info specifically)
    // For now, we rely on what we have or show a loader
    const leagueName = name || (standingsData && standingsData.length > 0 ? (standingsData[0] as any)?.leagueName : 'League Details');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Standings':
                return (
                    <View style={styles.tabContent}>
                        <StandingsWidget
                            data={standingsData?.map(item => ({
                                team: {
                                    id: item.team?.id,
                                    name: item.team?.name
                                },
                                position: item.rank,
                                stats: {
                                    played: item.played,
                                    points: item.points,
                                    goalDifference: item.goalDifference,
                                    netRunRate: (item as any).netRunRate,
                                    percentage: (item as any).percentage
                                }
                            })) || []}
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
                    {round ? round : 'Tournament'}
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

