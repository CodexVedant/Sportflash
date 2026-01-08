import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useGetFollowedMatchesMutation } from '@store/api/matchesApi';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TeamsTab() {
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);
    // const user = useSelector(state => state.auth.user); // Duplicate removed
    const rawFavoriteTeams = user?.preferences?.favoriteTeams || [];

    // Deduplicate teams based on ID (handle both objects and strings)
    // Deduplicate and Validate teams
    const favoriteTeams = React.useMemo(() => {
        const seen = new Set();
        return rawFavoriteTeams.filter(team => {
            if (!team) return false;

            // Validate Structure
            const isString = typeof team === 'string';
            const id = isString ? team : team.id;
            const name = isString ? null : team.name;

            // Reject if no ID
            if (!id) return false;

            // Reject if Object but NO Name (Garbage data)
            if (!isString && (!name || name === 'Team Name')) return false;

            // Deduplicate
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    }, [rawFavoriteTeams]);

    // Fetch matches so we can display "Next Match" for each team
    const [fetchMatches, { data: rawMatches, isLoading }] = useGetFollowedMatchesMutation();
    const matches = Array.isArray(rawMatches) ? rawMatches : (rawMatches?.data || []);

    const loadData = useCallback(() => {
        if (!favoriteTeams.length) return;

        // Prepare payload (same as MatchesTab)
        const payloadTeams = favoriteTeams.map(t => {
            if (typeof t === 'string') return { id: t, sport: 'football' };
            return t;
        });

        // Find followed players' teams too? Backend handles it if we pass players.
        // For now, let's just fetch for teams.
        fetchMatches({ teams: payloadTeams });
    }, [favoriteTeams, fetchMatches]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const getNextMatch = (teamId) => {
        if (!matches || matches.length === 0) return null;
        // Find first match where this team is home or away
        // Matches are usually sorted by date from backend
        return matches.find(m =>
            String(m.homeTeam?.id) === String(teamId) ||
            String(m.awayTeam?.id) === String(teamId)
        );
    };

    const renderTeamItem = ({ item }) => {
        // Handle legacy string ID or object
        const teamData = typeof item === 'string' ? { id: item, name: 'Unknown Team', sport: 'football' } : item;
        const nextMatch = getNextMatch(teamData.id);

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('TeamProfile', {
                    teamId: teamData.id,
                    teamName: teamData.name,
                    sport: teamData.sport,
                    logo: teamData.logo
                })}
            >
                <LinearGradient
                    // Force Dark Theme Colors for Contrast against White Text
                    colors={['#1e293b', '#0f172a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <View style={styles.cardContent}>
                        {/* Left: Logo & Name */}
                        <View style={styles.teamInfo}>
                            <View style={styles.logoContainer}>
                                {teamData.logo ? (
                                    <Image source={{ uri: teamData.logo }} style={styles.logo} resizeMode="contain" />
                                ) : (
                                    <View style={[styles.logo, { backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center' }]}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{(teamData.name || 'T').charAt(0)}</Text>
                                    </View>
                                )}
                            </View>
                            <View>
                                {/* Force White Color */}
                                <Text style={styles.teamName}>{teamData.name || 'Team Name'}</Text>
                                <Text style={styles.sportBadge}>{teamData.sport?.toUpperCase() || ''}</Text>
                            </View>
                        </View>

                        {/* Right: Star (Static as we are in Following tab) */}
                        <Ionicons name="star" size={20} color="#FFD700" />
                    </View>

                    {/* Footer: Next Match Info */}
                    <View style={styles.matchFooter}>
                        {nextMatch ? (
                            <>
                                <View style={styles.matchBadge}>
                                    <Text style={styles.matchBadgeText}>NEXT MATCH</Text>
                                </View>
                                {/* Force Light Colors */}
                                <Text style={styles.matchText} numberOfLines={1}>
                                    vs {String(nextMatch.homeTeam?.id) === String(teamData.id) ? nextMatch.awayTeam?.name : nextMatch.homeTeam?.name}
                                </Text>
                                <Text style={styles.dateText}>
                                    {nextMatch.date || nextMatch.startTime} • {nextMatch.time || ''}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.noMatchText}>No upcoming matches found</Text>
                        )}
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    if (favoriteTeams.length === 0) {
        return (
            <View style={styles.center}>
                <Ionicons name="people-outline" size={64} color={theme.colors.textMuted} />
                <Text style={styles.emptyText}>Follow teams to see them listed here.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favoriteTeams}
                renderItem={renderTeamItem}
                keyExtractor={(item, index) => (typeof item === 'string' ? item : item.id) || index.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: {
        borderRadius: 12,
        marginBottom: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    teamInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    logoContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 32,
        height: 32,
    },
    teamName: {
        color: '#FFFFFF', // Explict White
        fontSize: 16,
        fontWeight: 'bold',
    },
    sportBadge: {
        color: '#94a3b8', // Slate-400
        fontSize: 10,
        marginTop: 2,
    },
    matchFooter: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    matchBadge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    matchBadgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },
    matchText: {
        color: '#e2e8f0', // Slate-200
        fontSize: 13,
        flex: 1,
    },
    dateText: {
        color: '#cbd5e1', // Slate-300
        fontSize: 12,
    },
    noMatchText: {
        color: '#64748b', // Slate-500
        fontSize: 12,
        fontStyle: 'italic',
    },
    emptyText: { color: theme.colors.textMuted, fontSize: 16, marginTop: 16, textAlign: 'center' }
});
