import React, { useCallback } from 'react';
import { View, Text, SectionList, TouchableOpacity } from 'react-native';
import { styles } from '@utils/style/MatchesScreen.styles'; // Reuse styles
import { SkeletonList, EmptyState, NetworkError } from '@components/common';
import MatchCard from '@components/match/MatchCard';
import BasketballMatchCard from '@components/match/BasketballMatchCard';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@utils/theme';

interface MatchesListProps {
    isLoading: boolean;
    apiError: any;
    groupedMatches: any[];
    activeTab: string;
    activeSport: string;
    onRetry: () => void;
    onClearFilters: () => void;
    onNotificationToggle: (match: any) => void;
    notificationPreferences?: { [key: string]: boolean };
}

const MatchesList = ({
    isLoading,
    apiError,
    groupedMatches,
    activeTab,
    activeSport,
    onRetry,
    onClearFilters,
    onNotificationToggle,
    notificationPreferences = {}
}: MatchesListProps) => {
    const navigation = useNavigation();

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    const renderMatchItem = useCallback(({ item }: { item: any }) => {
        const isFinished = item.status === 'finished' || item.status === 'FT' || item.status === 'Ended';
        const matchId = (item.id || item._id)?.toString();

        // Check if ANY of the 4 granular options are enabled: Match, Series, Home Team, Away Team
        const isMatchEnabled = notificationPreferences[`match_${matchId}`];
        const isSeriesEnabled = notificationPreferences[`series_${item.league}`];
        const isHomeTeamEnabled = notificationPreferences[`team_${item.homeTeam?.name}`];
        const isAwayTeamEnabled = notificationPreferences[`team_${item.awayTeam?.name}`];

        const isSubscribed = Boolean(isMatchEnabled || isSeriesEnabled || isHomeTeamEnabled || isAwayTeamEnabled);

        const handlePress = () => {
            (navigation as any).navigate('MatchDetail', { match: item });
        };

        return (
            <View style={{ marginBottom: 16 }}>
                {item.sport === 'basketball' ? (
                    <BasketballMatchCard
                        match={item}
                        onPress={handlePress}
                        onNotificationPress={!isFinished ? () => onNotificationToggle(item) : undefined}
                        isSubscribed={isSubscribed}
                    />
                ) : (
                    <MatchCard
                        sport={item.sport}
                        status={item.status}
                        displayStatus={item.displayStatus}
                        league={item.league}
                        homeTeam={item.homeTeam}
                        awayTeam={item.awayTeam}
                        score={item.status === 'finished' || item.status === 'live' ?
                            (item.homeTeam.score && item.awayTeam.score ? `${item.homeTeam.score} - ${item.awayTeam.score}` : 'vs')
                            : undefined
                        }
                        timer={
                            item.sport === 'cricket'
                                ? (item.cricketData?.overs ? `${item.cricketData.overs} Overs` : '')
                                : (item.sport === 'basketball' && typeof item.timer === 'string' && item.timer.includes('Quarter'))
                                    ? item.timer
                                    : item.currentMinute || (item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')
                        }
                        match={item}
                        onPress={handlePress}
                        onNotificationPress={!isFinished ? () => onNotificationToggle(item) : undefined}
                        isSubscribed={isSubscribed}
                    />
                )}
            </View>
        );
    }, [navigation, notificationPreferences, onNotificationToggle]);

    if (isLoading) {
        return <SkeletonList type="match" count={5} />;
    }

    if (apiError) {
        return <NetworkError onRetry={onRetry} />;
    }

    return (
        <SectionList
            style={styles.scrollContainer}
            sections={groupedMatches}
            keyExtractor={item => item._id || item.id}
            renderItem={renderMatchItem}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled={true}
            showsVerticalScrollIndicator={false}
            extraData={notificationPreferences}
            ListEmptyComponent={
                <EmptyState
                    variant="noMatches"
                    message={`No ${activeTab.toLowerCase()} matches found for ${activeSport === 'all' ? 'all sports' : activeSport}`}
                    actionLabel="Clear Filters"
                    onAction={onClearFilters}
                />
            }
        />
    );
};

export default MatchesList;
