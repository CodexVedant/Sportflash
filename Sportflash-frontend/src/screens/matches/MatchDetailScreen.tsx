import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import MatchHeader from '@components/match/MatchHeader';
import BackButton from '@components/common/BackButton';
import Scorecard from '@components/match/Scorecard';
import Commentary from '@components/match/Commentary';
import H2HStats from '@components/match/H2HStats';
import StandingsWidget from '@components/match/StandingsWidget';
import { useToast } from '@context/ToastContext';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPreferences } from '@store/slices/authSlice';
import socket from '@services/socket';
import { useGetMatchH2HQuery, useGetMatchStandingsQuery, useGetLiveMatchesQuery } from '@store/api/matchesApi';
import { selectMatchById } from '@store/slices/liveMatchesSlice';
import { initSocketListeners } from '@store/thunks/socketThunks';
import { mapMatchToUI } from '@utils/matchMappers';
import { styles } from '@utils/style/MatchDetailScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { useAppDispatch, useAppSelector } from '@hooks/redux';

type Props = NativeStackScreenProps<RootStackParamList, 'MatchDetail'>;

export default function MatchDetailScreen({ navigation, route }: Props) {
    const { match } = route.params || {};
    const [activeTab, setActiveTab] = useState('Scorecard');
    const { showToast } = useToast();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const matchId = match?._id || match?.id || '1';

    // Select match from Redux using a type-safe selector if available, or assume any
    const reduxMatch = useAppSelector(state => selectMatchById(state, matchId));

    const displayMatch = reduxMatch ? mapMatchToUI(reduxMatch) : (match || {});

    // Construct a safe match data object with defaults
    const matchData = {
        ...displayMatch,
        homeTeam: displayMatch.homeTeam || { name: 'Home' },
        awayTeam: displayMatch.awayTeam || { name: 'Away' },
        venue: displayMatch.venue || {},
        date: displayMatch.date || 'Today'
    };

    const homeScore = matchData.homeTeam?.score || '0';
    const awayScore = matchData.awayTeam?.score || '0';
    const timer = matchData.timer || '';

    const isFollowingHome = user?.preferences?.favoriteTeams?.includes(matchData.homeTeam?.name);
    const isFollowingAway = user?.preferences?.favoriteTeams?.includes(matchData.awayTeam?.name);

    // Initial Fetch (if needed, though HomeScreen likely fetched it)
    const { refetch } = useGetLiveMatchesQuery(undefined);

    // Ensure socket listeners are active when on this screen
    useEffect(() => {
        dispatch(initSocketListeners());
    }, [dispatch]);

    const [liveCommentary, setLiveCommentary] = useState<any[]>([]);

    useEffect(() => {
        // Join specific match room for detailed updates (like commentary) where applicable
        if (matchId && matchId !== '1') {
            socket.emit('join_match', matchId);
        }

        // Listener for commentary/specific events
        const handleCommentary = (data: any) => {
            if ((data.id === matchId || data._id === matchId) && data.commentary) {
                setLiveCommentary(prev => [{ text: data.commentary, time: data.currentMinute }, ...prev].slice(0, 20));
            }
        };

        socket.on('score_update', handleCommentary);

        return () => {
            socket.off('score_update', handleCommentary);
            if (matchId && matchId !== '1') {
                socket.emit('leave_match', matchId);
            }
        };
    }, [matchId]);


    const handleFollow = useCallback(async (teamName: string) => {
        if (!user) {
            showToast('Please login to follow teams', 'info');
            return;
        }

        try {
            let currentTeams = user.preferences?.favoriteTeams || [];
            let newTeams;

            if (currentTeams.includes(teamName)) {
                newTeams = currentTeams.filter(t => t !== teamName);
                showToast(`Unfollowed ${teamName}`);
            } else {
                newTeams = [...currentTeams, teamName];
                showToast(`Following ${teamName}`);
            }

            await dispatch(updateUserPreferences({ favoriteTeams: newTeams })).unwrap();
        } catch (error) {
            showToast('Failed to update favorites', 'error');
        }
    }, [user, dispatch, showToast]);

    const getSportColor = () => {
        switch (matchData.sport?.toLowerCase()) {
            case 'cricket': return theme.colors.cricket;
            case 'football': return theme.colors.football;
            case 'basketball': return theme.colors.basketball;
            default: return theme.colors.primary;
        }
    };

    const activeColor = getSportColor();

    // Fetch Data for Tabs
    const { data: h2hData } = useGetMatchH2HQuery({
        sport: matchData.sport || 'football',
        team1Id: matchData.homeTeam?.id,
        team2Id: matchData.awayTeam?.id
    }, { skip: !matchData.homeTeam?.id || !matchData.awayTeam?.id });

    const { data: standingsData } = useGetMatchStandingsQuery({
        sport: matchData.sport || 'football',
        leagueId: matchData.leagueInfo?.id
    }, { skip: !matchData.leagueInfo?.id });

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Scorecard':
                return (
                    <Scorecard
                        match={matchData}
                        onPlayerPress={(player) => navigation.navigate('PlayerProfile', { player })}
                    />
                );
            case 'H2H':
                return (
                    <H2HStats
                        data={h2hData?.matches?.map((m: any) => ({
                            match_date: m.date || m.match_date,
                            match_hometeam_name: m.homeTeam?.name || m.match_hometeam_name,
                            match_awayteam_name: m.awayTeam?.name || m.match_awayteam_name,
                            match_hometeam_score: m.homeTeam?.score || m.match_hometeam_score,
                            match_awayteam_score: m.awayTeam?.score || m.match_awayteam_score
                        })) || []}
                        team1={matchData.homeTeam}
                        team2={matchData.awayTeam}
                    />
                );
            case 'Standings':
                return (
                    <StandingsWidget
                        data={standingsData?.map(item => ({
                            team: {
                                id: item.team?.id,
                                name: item.team?.name
                            },
                            position: item.position ?? item.rank ?? 0,
                            stats: {
                                played: item.stats?.played ?? item.played ?? 0,
                                points: item.stats?.points ?? item.points ?? 0,
                                goalDifference: item.stats?.goalDifference ?? item.goalDifference ?? 0,
                                netRunRate: item.stats?.netRunRate ?? (item as any).netRunRate,
                                percentage: item.stats?.percentage ?? (item as any).percentage
                            }
                        })) || []}
                        highlightTeams={[matchData.homeTeam?.id, matchData.awayTeam?.id]}
                    />
                );
            case 'Commentary':
                return (
                    <Commentary commentary={liveCommentary} />
                );
            default:
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Match Info</Text>
                        </View>

                        {/* League Information */}
                        {matchData.leagueInfo?.name && (
                            <View style={styles.statRow}>
                                <Text style={styles.textMuted}>League</Text>
                                <Text style={styles.text}>{matchData.leagueInfo.name}</Text>
                            </View>
                        )}

                        {matchData.leagueInfo?.country && (
                            <View style={styles.statRow}>
                                <Text style={styles.textMuted}>Country</Text>
                                <Text style={styles.text}>{matchData.leagueInfo.country}</Text>
                            </View>
                        )}

                        {matchData.leagueInfo?.round && (
                            <View style={styles.statRow}>
                                <Text style={styles.textMuted}>Round</Text>
                                <Text style={styles.text}>{matchData.leagueInfo.round}</Text>
                            </View>
                        )}

                        {matchData.leagueInfo?.season && (
                            <View style={styles.statRow}>
                                <Text style={styles.textMuted}>Season</Text>
                                <Text style={styles.text}>{matchData.leagueInfo.season}</Text>
                            </View>
                        )}

                        {/* Match Details */}
                        <View style={styles.statRow}>
                            <Text style={styles.textMuted}>Date</Text>
                            <Text style={styles.text}>
                                {matchData.date || matchData.dateStart || 'Not Available'}
                            </Text>
                        </View>

                        {matchData.time && (
                            <View style={styles.statRow}>
                                <Text style={styles.textMuted}>Time</Text>
                                <Text style={styles.text}>{matchData.time}</Text>
                            </View>
                        )}

                        {/* Venue Information */}
                        {matchData.venue?.name && (
                            <View style={styles.statRow}>
                                <Text style={styles.textMuted}>Venue</Text>
                                <Text style={styles.text}>{matchData.venue.name}</Text>
                            </View>
                        )}

                        {matchData.venue?.referee && (
                            <View style={styles.statRow}>
                                <Text style={styles.textMuted}>Referee</Text>
                                <Text style={styles.text}>{matchData.venue.referee}</Text>
                            </View>
                        )}

                        {/* Cricket Specific */}
                        {matchData.sport === 'cricket' && matchData.matchType && (
                            <View style={styles.statRow}>
                                <Text style={styles.textMuted}>Match Type</Text>
                                <Text style={styles.text}>{matchData.matchType}</Text>
                            </View>
                        )}

                        {matchData.sport === 'cricket' && matchData.toss && (
                            <View style={styles.statRow}>
                                <Text style={styles.textMuted}>Toss</Text>
                                <Text style={styles.text}>{matchData.toss}</Text>
                            </View>
                        )}

                        {matchData.sport === 'cricket' && matchData.manOfMatch && (
                            <View style={styles.statRow}>
                                <Text style={styles.textMuted}>Man of the Match</Text>
                                <Text style={styles.text}>{matchData.manOfMatch}</Text>
                            </View>
                        )}

                        {/* Football Specific */}
                        {matchData.sport === 'football' && matchData.homeTeam?.formation && (
                            <View style={styles.statRow}>
                                <Text style={styles.textMuted}>Formation</Text>
                                <Text style={styles.text}>
                                    {matchData.homeTeam.formation} - {matchData.awayTeam?.formation || 'N/A'}
                                </Text>
                            </View>
                        )}

                        {/* Match Status */}
                        <View style={styles.statRow}>
                            <Text style={styles.textMuted}>Status</Text>
                            <Text style={styles.text}>{matchData.displayStatus || matchData.status}</Text>
                        </View>
                    </View>
                );
        }
    };

    const handleTeamPress = useCallback((team: any) => {
        navigation.navigate('TeamProfile', {
            teamId: team.id,
            teamName: team.name,
            sport: matchData.sport
        });
    }, [navigation, matchData.sport]);

    return (
        <View style={styles.container}>
            {/* Header Background */}
            <LinearGradient
                colors={[activeColor, theme.colors.background]}
                style={styles.headerBg}
            />

            <SafeAreaView style={{ flex: 1 }}>

                {/* Responsive Container */}
                <View style={[styles.mainContainer, isDesktop && styles.desktopContainer]}>

                    {/* Top Navigation Bar */}
                    <View style={styles.topBar}>
                        <BackButton
                            color="#FFF"
                            style={styles.backBtn}
                            onFallback={() => {
                                if (matchData.leagueInfo?.id) {
                                    navigation.navigate('LeagueDetails', {
                                        leagueId: matchData.leagueInfo.id,
                                        name: matchData.leagueInfo.name,
                                        round: matchData.leagueInfo.round
                                    });
                                } else {
                                    // Navigate to Main stack if Home is not in RootStack direct children
                                    // Assuming Home is the initial route of Main or a direct route
                                    // If 'Home' gave error, it might be nested in 'Main'
                                    navigation.navigate('Main');
                                }
                            }}
                        />

                        <TouchableOpacity onPress={() => navigation.navigate('LeagueDetails', {
                            leagueId: matchData.leagueInfo?.id,
                            name: matchData.leagueInfo?.name,
                            round: matchData.leagueInfo?.round
                        })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Text style={styles.headerTitle}>{matchData.league}</Text>
                                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Match Score Hero */}
                    <MatchHeader
                        match={matchData}
                        homeScore={homeScore}
                        awayScore={awayScore}
                        timer={timer}
                        onFollow={handleFollow}
                        onTeamPress={handleTeamPress}
                        isFollowingHome={!!isFollowingHome}
                        isFollowingAway={!!isFollowingAway}
                    />

                    {/* Tabs */}
                    <View style={styles.tabBar}>
                        {['Scorecard', 'H2H', 'Standings', 'Commentary', 'Info'].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.tabItem,
                                    activeTab === tab && { borderBottomColor: activeColor }
                                ]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[
                                    styles.tabText,
                                    activeTab === tab && { color: activeColor, fontWeight: 'bold' }
                                ]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Scrollable Content */}
                    <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
                        {renderTabContent()}
                    </ScrollView>

                </View>

            </SafeAreaView>
        </View>
    );
}

