import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useGetFollowedMatchesMutation } from '@store/api/matchesApi';
import MatchCard from '@components/match/MatchCard';
import { theme } from '@utils/theme';
import { useNavigation } from '@react-navigation/native';

interface PlayerFixturesProps {
    teamId: string;
    sport: string;
}

export default function PlayerFixtures({ teamId, sport }: PlayerFixturesProps) {
    const navigation = useNavigation<any>();
    const [fetchMatches, { data: rawMatches, isLoading }] = useGetFollowedMatchesMutation();
    const matches = Array.isArray(rawMatches) ? rawMatches : (rawMatches as any)?.data || [];

    useEffect(() => {
        if (teamId) {
            fetchMatches({ teams: [{ id: teamId, sport }] });
        }
    }, [teamId, sport, fetchMatches]);

    if (!teamId) {
        return (
            <View style={{ padding: 20, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
                <Text style={{ color: theme.colors.textMuted }}>Team info not available to show matches.</Text>
            </View>
        );
    }

    if (isLoading) {
        return <ActivityIndicator size="small" color={theme.colors.primary} />;
    }

    if (!matches || matches.length === 0) {
        return (
            <View style={{ padding: 20, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
                <Text style={{ color: theme.colors.textMuted }}>No upcoming matches scheduled.</Text>
            </View>
        );
    }

    return (
        <View>
            {matches.map((match: any) => (
                <MatchCard
                    key={match.id}
                    sport={sport}
                    status={match.status}
                    displayStatus={match.status}
                    league={match.league?.name || match.league}
                    homeTeam={match.homeTeam}
                    awayTeam={match.awayTeam}
                    score={match.score}
                    timer={match.timer || match.startTime}
                    onPress={() => navigation.navigate('MatchDetails', { matchId: match.id, sport })}
                />
            ))}
        </View>
    );
}
