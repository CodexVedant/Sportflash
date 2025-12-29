import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withSpring, interpolateColor } from 'react-native-reanimated';
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

export default function MatchDetailScreen({ navigation, route }) {
    const { match } = route.params || {};
    const [activeTab, setActiveTab] = useState('Scorecard');
    const { showToast } = useToast();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const matchId = match?._id || match?.id || '1';
    const reduxMatch = useSelector(state => selectMatchById(state, matchId));
    const displayMatch = reduxMatch ? mapMatchToUI(reduxMatch) : (match || {});
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
    const { refetch } = useGetLiveMatchesQuery();

    // Ensure socket listeners are active when on this screen
    useEffect(() => {
        dispatch(initSocketListeners());
    }, [dispatch]);

    const [liveCommentary, setLiveCommentary] = useState([]);

    useEffect(() => {
        // Join specific match room for detailed updates (like commentary) where applicable
        if (matchId && matchId !== '1') {
            socket.emit('join_match', matchId);
        }

        // Listener for commentary/specific events
        const handleCommentary = (data) => {
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


    const handleFollow = useCallback(async (teamName) => {
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
                        data={h2hData}
                        team1={matchData.homeTeam}
                        team2={matchData.awayTeam}
                    />
                );
            case 'Standings':
                return (
                    <StandingsWidget
                        data={standingsData}
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
                        <View style={styles.statRow}>
                            <Text style={styles.textMuted}>Venue</Text>
                            <Text style={styles.text}>{matchData.venue?.name || 'Unknown'}</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.textMuted}>Referee</Text>
                            <Text style={styles.text}>{matchData.venue?.referee || 'Unknown'}</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.textMuted}>Date</Text>
                            <Text style={styles.text}>{matchData.date}</Text>
                        </View>
                    </View>
                );
        }
    };

    const handleTeamPress = useCallback((team) => {
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
                                    navigation.navigate('LeagueDetails', { leagueId: matchData.leagueInfo.id });
                                } else {
                                    navigation.navigate('Home');
                                }
                            }}
                        />

                        <TouchableOpacity onPress={() => navigation.navigate('LeagueDetails', { leagueId: matchData.leagueInfo?.id })}>
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
                        isFollowingHome={isFollowingHome}
                        isFollowingAway={isFollowingAway}
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
