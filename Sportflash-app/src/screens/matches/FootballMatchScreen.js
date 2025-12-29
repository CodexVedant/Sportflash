import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import MatchCard from '@components/match/MatchCard';
import { useGetLiveMatchesQuery } from '@store/api/matchesApi';
import { EmptyState } from '@components/common';
import { styles } from '@utils/style/FootballMatchScreen.styles';

export default function FootballMatchScreen({ navigation }) {
    const { data: allMatches = [], isLoading } = useGetLiveMatchesQuery();
    const [footballMatches, setFootballMatches] = useState([]);

    useEffect(() => {
        // Filter only football matches
        const filtered = allMatches.filter(match => match.sport?.toLowerCase() === 'football');
        setFootballMatches(filtered);
    }, [allMatches]);

    const renderMatchItem = ({ item }) => (
        <View style={{ marginBottom: 16 }}>
            <MatchCard
                sport={item.sport}
                status={item.status}
                league={item.league}
                homeTeam={item.homeTeam}
                awayTeam={item.awayTeam}
                score={item.status === 'finished' || item.status === 'live' ?
                    (item.homeTeam.score && item.awayTeam.score ? `${item.homeTeam.score} - ${item.awayTeam.score}` : 'vs')
                    : null
                }
                timer={item.currentMinute || ''}
                onPress={() => navigation.navigate('MatchDetail', { match: item })}
            />
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={footballMatches}
                keyExtractor={item => item._id}
                renderItem={renderMatchItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <EmptyState
                        variant="noMatches"
                        message="No football matches available"
                    />
                }
            />
        </View>
    );
}
