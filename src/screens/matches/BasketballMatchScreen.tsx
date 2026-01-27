import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { theme } from '@utils/theme';
import MatchCard from '@components/match/MatchCard';
import { useGetLiveMatchesQuery } from '@store/api/matchesApi';
import { EmptyState } from '@components/common';
import { styles } from '@utils/style/BasketballMatchScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'BasketballMatch'>;

export default function BasketballMatchScreen({ navigation }: Props) {
    const { data: allMatches = [], isLoading } = useGetLiveMatchesQuery(undefined);
    const [basketballMatches, setBasketballMatches] = useState<any[]>([]);

    useEffect(() => {
        // Filter only basketball matches
        const filtered = allMatches.filter(match => match.sport?.toLowerCase() === 'basketball');
        setBasketballMatches(filtered);
    }, [allMatches]);

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
                timer={item.basketballData?.quarter ? `Q${item.basketballData.quarter}` : item.currentMinute || ''}
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
                data={basketballMatches}
                keyExtractor={item => item._id}
                renderItem={renderMatchItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <EmptyState
                        variant="noMatches"
                        message="No basketball matches available"
                    />
                }
            />
        </View>
    );
}

