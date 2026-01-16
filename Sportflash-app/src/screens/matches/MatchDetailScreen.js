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
// import { useToast } from '@context/ToastContext'; // Removed
import { showToast } from '@store/actions/toastActions';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPreferences } from '@store/slices/authSlice';
import socket from '@services/socket';
import { useGetMatchH2HQuery, useGetMatchStandingsQuery, useGetLiveMatchesQuery, useGetMatchDetailsQuery } from '@store/api/matchesApi';
import { selectMatchById } from '@store/slices/liveMatchesSlice';
import { initSocketListeners } from '@store/thunks/socketThunks';
import { mapMatchToUI } from '@utils/matchMappers';
import { styles } from '@utils/style/MatchDetailScreen.styles';

export default function MatchDetailScreen({ navigation, route }) {
    const { match, matchId: paramMatchId, sport: paramSport } = route.params || {};

    // Debug Log
    useEffect(() => {
        console.log('📌 MatchDetail MOUNTED');
        console.log('   - Params:', JSON.stringify(route.params));
        console.log('   - Computed matchId:', matchId);
        console.log('   - Computed sport:', derivedSport);

        if (!matchId) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Missing Match ID',
            });
        }
    }, [matchId, derivedSport, route.params]);

    const [activeTab, setActiveTab] = useState('Scorecard');
    // const { showToast } = useToast(); // Removed in favor of Redux
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const matchId = match?._id || match?.id || paramMatchId || '1';

    // Ensure sport is available for queries
    // Ensure sport is available for queries
    const derivedSport = match?.sport || paramSport || 'football';

    // 1. Try Redux (Live)
    const reduxMatch = useSelector(state => selectMatchById(state, matchId));

    // 2. Try Fetch (Direct) - Create robustness by fetching fresh data
    const { data: fetchedMatch, isLoading: isFetchingMatch, isError, error } = useGetMatchDetailsQuery(
        { id: matchId, sport: derivedSport },
        { skip: !matchId } // Always fetch to ensure full details (Lineups, etc.)
    );

    const matchSource = fetchedMatch || reduxMatch || match || {};
    const displayMatch = mapMatchToUI(matchSource); // Map whatever we found

    const matchData = {
        ...displayMatch,
        sport: displayMatch.sport || derivedSport, // Ensure sport is set
        homeTeam: displayMatch.homeTeam || { name: 'Home' },
        awayTeam: displayMatch.awayTeam || { name: 'Away' },
        venue: displayMatch.venue || {},
        date: displayMatch.date || 'Today'
    };

    const homeScore = matchData.homeTeam?.score || '0';
    const awayScore = matchData.awayTeam?.score || '0';
    const timer = matchData.timer || '';
    const isFollowingHome = user?.preferences?.favoriteTeams?.some(t => {
        const tId = typeof t === 'string' ? t : t.id;
        const hId = matchData.homeTeam?.id;
        // Fallback to name match if ID missing (legacy)
        return String(tId) === String(hId) || (typeof t === 'string' && t === matchData.homeTeam?.name) || t.name === matchData.homeTeam?.name;
    });
    const isFollowingAway = user?.preferences?.favoriteTeams?.some(t => {
        const tId = typeof t === 'string' ? t : t.id;
        const aId = matchData.awayTeam?.id;
        return String(tId) === String(aId) || (typeof t === 'string' && t === matchData.awayTeam?.name) || t.name === matchData.awayTeam?.name;
    });

    // Initial Fetch (if needed, though HomeScreen likely fetched it)
    const { refetch } = useGetLiveMatchesQuery();

    // Ensure socket listeners are active
    useEffect(() => {
        dispatch(initSocketListeners());
    }, [dispatch]);

    // Error View
    if (isError) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
                <Text style={{ color: '#fff', fontSize: 18, marginTop: 16, fontWeight: 'bold' }}>
                    Failed to load match
                </Text>
                <Text style={{ color: '#aaa', marginTop: 8, textAlign: 'center', paddingHorizontal: 20 }}>
                    {error?.error || JSON.stringify(error)}
                </Text>
                <Text style={{ color: '#aaa', marginTop: 4, fontSize: 12 }}>
                    ID: {matchId} | Sport: {derivedSport}
                </Text>
                <TouchableOpacity
                    onPress={refetch}
                    style={{ marginTop: 20, backgroundColor: theme.colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retry Connection</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
                    <Text style={{ color: '#aaa' }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // Loading View
    if (isFetchingMatch && !matchSource.homeTeam) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ color: '#fff', marginTop: 10 }}>Loading Match Details...</Text>
            </SafeAreaView>
        );
    }

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
            dispatch(showToast({ type: 'info', text1: 'Login Required', text2: 'Please login to follow teams' }));
            return;
        }

        try {
            const currentTeams = user.preferences?.favoriteTeams || [];
            // Identify which team is being toggled
            const isHome = teamName === matchData.homeTeam?.name;
            const team = isHome ? matchData.homeTeam : matchData.awayTeam;

            // Check if following
            const isFollowing = currentTeams.some(t => {
                const tId = typeof t === 'string' ? t : t.id;
                return String(tId) === String(team.id) || (typeof t === 'string' && t === teamName) || t.name === teamName;
            });

            let newTeams;
            if (isFollowing) {
                // Unfollow
                newTeams = currentTeams.filter(t => {
                    const tId = typeof t === 'string' ? t : t.id;
                    return String(tId) !== String(team.id) && t !== teamName && t.name !== teamName;
                });
                dispatch(showToast({ type: 'success', text1: 'Unfollowed', text2: `You unfollowed ${teamName}` }));
            } else {
                // Follow (Save Object)
                const teamToSave = {
                    id: team.id,
                    name: team.name || teamName,
                    sport: matchData.sport,
                    logo: team.logo
                };
                newTeams = [...currentTeams, teamToSave];
                dispatch(showToast({ type: 'success', text1: 'Following', text2: `You are now following ${teamName}` }));
            }

            await dispatch(updateUserPreferences({ favoriteTeams: newTeams })).unwrap();
        } catch (error) {
            console.error('Follow Error:', error);
            dispatch(showToast({ type: 'error', text1: 'Error', text2: 'Failed to update favorites' }));
        }
    }, [user, dispatch, matchData]);

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
                        onPlayerPress={(player) => {
                            dispatch(showToast({
                                type: 'info',
                                text1: 'Debug Navigation',
                                text2: `ID: ${player.id} | Sport: ${player.sport}`
                            }));
                            navigation.navigate('PlayerProfile', { player });
                        }}
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

                {/* DEBUG STATUS */}
                <View style={{ position: 'absolute', top: 100, left: 0, right: 0, padding: 8, backgroundColor: 'red', zIndex: 999 }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                        ERR: {isError ? 'NETWORK_ERROR' : error ? JSON.stringify(error) : 'None'}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                        DATA: {fetchedMatch ? JSON.stringify(fetchedMatch).slice(0, 100) : 'NULL'}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 10 }}>
                        Src: {matchSource === reduxMatch ? 'Redux' : matchSource === fetchedMatch ? 'API' : 'Params'} | Load: {isFetchingMatch ? 'YES' : 'NO'}
                    </Text>
                </View>

            </SafeAreaView >
        </View >
    );
}
