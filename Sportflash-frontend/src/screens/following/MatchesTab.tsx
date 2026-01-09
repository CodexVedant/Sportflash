import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppSelector, useAppDispatch } from '@hooks/redux';
import { useGetFollowedMatchesMutation } from '@store/api/matchesApi';
import { theme } from '@utils/theme';
import { useToast } from '@context/ToastContext';
import MatchCard from '@components/match/MatchCard';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationOptionsModal } from '@components/notifications';
import { updatePreference } from '@store/slices/notificationsSlice';
import { Match } from '@app-types/models/match';

export default function MatchesTab() {
    const dispatch = useAppDispatch();
    const { showToast } = useToast();
    const user = useAppSelector(state => state.auth.user);
    const preferences = useAppSelector(state => state.notifications.preferences || {});

    // Notification Logic
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    const handleBellPress = (match: Match) => {
        setSelectedMatch(match);
        setModalVisible(true);
    };

    const handleSavePreferences = (newPrefs: any) => {
        if (!selectedMatch) return;
        const updates = {
            [`match_${selectedMatch.id}`]: newPrefs.match,
            [`series_${selectedMatch.league}`]: newPrefs.series,
            [`team_${selectedMatch.homeTeam?.name}`]: newPrefs.homeTeam,
            [`team_${selectedMatch.awayTeam?.name}`]: newPrefs.awayTeam,
        };
        Object.entries(updates).forEach(([key, value]) => {
            dispatch(updatePreference({ key, value: Boolean(value) }));
        });
        showToast("Preferences updated", "success");
    };

    const isSubscribedToMatch = (matchId: string) => {
        return preferences[`match_${matchId}`] === true;
    };

    const favoriteTeams = user?.preferences?.favoriteTeams || [];

    // Mutation hook
    const [fetchMatches, { data: rawMatches, isLoading, error }] = useGetFollowedMatchesMutation();

    // Auto-unwrap if wrapped in { success: true, data: [...] }
    const matches = Array.isArray(rawMatches) ? rawMatches : (rawMatches as any)?.data || [];

    const loadMatches = useCallback(() => {
        if (!favoriteTeams.length) return;

        const payloadTeams = favoriteTeams.map(t => {
            if (typeof t === 'string') return { id: t, sport: 'football' }; // Fallback
            return t; // details object
        });

        fetchMatches({ teams: payloadTeams });
    }, [favoriteTeams, fetchMatches]);

    useFocusEffect(
        React.useCallback(() => {
            loadMatches();
        }, [loadMatches])
    );

    const renderItem = ({ item }: { item: Match }) => {
        // Ensure league is a string for the prop
        const leagueName = typeof item.league === 'string' ? item.league : (item.league as any)?.name || 'Unknown League';

        return (
            <View style={{ marginBottom: 16 }}>
                <MatchCard
                    {...item}
                    league={leagueName}
                    onNotificationPress={() => handleBellPress(item)}
                    isSubscribed={isSubscribedToMatch(String(item.id))}
                />
            </View>
        );
    };

    if (isLoading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
    }

    if (!favoriteTeams || favoriteTeams.length === 0) {
        return (
            <View style={styles.center}>
                <Ionicons name="shirt-outline" size={64} color={theme.colors.textMuted} />
                <Text style={styles.emptyText}>Follow teams to see their matches here.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <NotificationOptionsModal
                visible={modalVisible}
                match={selectedMatch}
                onClose={() => setModalVisible(false)}
                onSave={handleSavePreferences}
                initialPreferences={preferences}
            />
            {matches.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.text}>No upcoming matches found for your teams.</Text>
                </View>
            ) : (
                <FlatList
                    data={matches}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 16 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    text: { color: theme.colors.textMuted, fontSize: 16, textAlign: 'center' },
    emptyText: { color: theme.colors.textMuted, fontSize: 16, marginTop: 16, textAlign: 'center' }
});
