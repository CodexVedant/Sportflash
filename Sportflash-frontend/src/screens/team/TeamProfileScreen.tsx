import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useGetTeamQuery } from '@store/api/teamsApi';
import { useGetFollowedMatchesMutation } from '@store/api/matchesApi';
import { styles } from '@utils/style/TeamProfileScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import MatchCard from '@components/match/MatchCard';
import EmptyState from '@components/common/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'TeamProfile'>;

export default function TeamProfileScreen({ navigation, route }: Props) {
    const { teamId, teamName, sport = 'football' } = route.params || {};
    const [activeTab, setActiveTab] = useState('Overview');

    // Fetch Team Details from API
    const { data: teamData, isLoading: isTeamLoading, error } = useGetTeamQuery({ id: teamId!, sport }, { skip: !teamId });

    // Fetch Team Matches
    const [fetchMatches, { data: rawMatches, isLoading: isMatchesLoading }] = useGetFollowedMatchesMutation();
    const matches = Array.isArray(rawMatches) ? rawMatches : (rawMatches as any)?.data || [];

    useEffect(() => {
        if (teamId && activeTab === 'Fixtures') {
            fetchMatches({ teams: [{ id: teamId, sport }] });
        }
    }, [teamId, activeTab, fetchMatches, sport]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Team Info</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Country</Text>
<<<<<<< HEAD
                                <Text style={styles.value}>{teamData?.country || 'N/A'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Founded</Text>
                                <Text style={styles.value}>{teamData?.founded || 'N/A'}</Text>
=======
                                <Text style={styles.value}>{teamData?.country || 'Not available'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Founded</Text>
                                <Text style={styles.value}>{teamData?.founded || 'Not available'}</Text>
>>>>>>> origin/main
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Stadium</Text>
                                <Text style={styles.value}>{teamData?.venue?.name || 'Not available'}</Text>
                            </View>
                            <Text style={[styles.value, { fontSize: 12, marginTop: 12, opacity: 0.6 }]}>
                                Note: Detailed team information is limited by the data provider
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Recent Form</Text>
                            <Text style={[styles.value, { opacity: 0.6 }]}>
                                Form data coming soon
                            </Text>
                        </View>
                    </View>
                );
            case 'Squad':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Squad</Text>
                            {teamData?.players && teamData.players.length > 0 ? (
                                teamData.players.map((player, index: number) => (
                                    <View key={index} style={styles.playerRow}>
                                        <Text style={styles.playerNumber}>{player.number || '-'}</Text>
                                        <View style={styles.playerInfo}>
                                            <Text style={styles.playerName}>{player.name}</Text>
                                            <Text style={styles.playerPosition}>{player.position || 'Player'}</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={[styles.value, { opacity: 0.6 }]}>
                                    Squad information is not available from the data provider.
                                    {'\n\n'}
                                    Player details are typically available during live matches.
                                </Text>
                            )}
                        </View>
                    </View>
                );
            case 'Fixtures':
                if (isMatchesLoading) {
                    return (
                        <View style={{ padding: 20 }}>
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        </View>
                    );
                }

                if (!matches || matches.length === 0) {
                    return (
                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderText}>No upcoming matches found</Text>
                        </View>
                    );
                }

                return (
                    <View style={{ paddingBottom: 20 }}>
                        {matches.map((match: any) => (
                            <MatchCard
                                key={match.id}
                                sport={sport}
                                status={match.status}
                                displayStatus={match.status} // or match.displayStatus
                                league={match.league?.name || match.league}
                                homeTeam={match.homeTeam}
                                awayTeam={match.awayTeam}
                                score={match.score} // ensure this is the string score
                                timer={match.timer || match.startTime}
                                onPress={() => navigation.navigate('MatchDetail', { matchId: match.id, sport: sport })}
                            />
                        ))}
                    </View>
                );
            case 'Transfers':
                return (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Transfer History Coming Soon</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    if (isTeamLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error || !teamData) {
        // Fallback UI or try to show passed params
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Team Details</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: theme.colors.textMuted }}>Failed to load full details.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{teamData.name}</Text>
                <TouchableOpacity>
                    <Ionicons name="star-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            {/* Team Hero */}
            <View style={styles.hero}>
                <View style={styles.logoContainer}>
                    {teamData.logo ? (
                        <Image source={{ uri: teamData.logo }} style={{ width: 60, height: 60, resizeMode: 'contain' }} />
                    ) : (
                        <Ionicons name="shield-half" size={40} color={theme.colors.primary} />
                    )}
                </View>
                <Text style={styles.teamNameHero}>{teamData.name}</Text>
                <Text style={styles.countryText}>{teamData.country}</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
                {['Overview', 'Squad', 'Fixtures', 'Transfers'].map((tab) => (
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

