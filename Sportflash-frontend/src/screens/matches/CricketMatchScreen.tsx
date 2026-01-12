import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { theme } from '@utils/theme';
import MatchCard from '@components/match/MatchCard';
import { useGetCricketLiveMatchesQuery } from '@store/api/cricbuzzApi';
import { EmptyState } from '@components/common';
import { styles } from '@utils/style/CricketMatchScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CricketMatch'>;

export default function CricketMatchScreen({ navigation }: Props) {
    // Use Cricbuzz API for cricket matches with real-time polling
    const { data: cricketMatches = [], isLoading } = useGetCricketLiveMatchesQuery(
        undefined,
        {
            pollingInterval: 30000, // Poll every 30 seconds for live updates
        }
    );

    const renderMatchItem = ({ item }: { item: any }) => (
        <View style={{ marginBottom: 16 }}>
            <MatchCard
                match={item}
                sport={item.sport}
                status={item.status}
                league={item.league}
                homeTeam={item.homeTeam}
                awayTeam={item.awayTeam}
                score={item.score}
                timer={item.cricketData?.overs ? `${item.cricketData.overs} Overs` : item.currentMinute || ''}
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
                data={cricketMatches}
                keyExtractor={item => String(item.id)}
                renderItem={renderMatchItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <EmptyState
                        variant="noMatches"
                        message="No cricket matches available"
                    />
                }
            />
        </View>
    );
}

