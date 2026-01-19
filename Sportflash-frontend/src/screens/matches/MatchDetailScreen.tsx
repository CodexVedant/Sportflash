import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Platform, StyleSheet, ActivityIndicator } from 'react-native';
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

    const isFollowingHome = React.useMemo(() => {
        return user?.preferences?.favoriteTeams?.some(t => {
            const tId = typeof t === 'string' ? t : t.id;
            const hId = matchData.homeTeam?.id;
            return (hId && String(tId) === String(hId)) ||
                (typeof t === 'string' && t === matchData.homeTeam?.name) ||
                (typeof t !== 'string' && t?.name === matchData.homeTeam?.name);
        });
    }, [user?.preferences?.favoriteTeams, matchData.homeTeam]);

    const isFollowingAway = React.useMemo(() => {
        return user?.preferences?.favoriteTeams?.some(t => {
            const tId = typeof t === 'string' ? t : t.id;
            const aId = matchData.awayTeam?.id;
            return (aId && String(tId) === String(aId)) ||
                (typeof t === 'string' && t === matchData.awayTeam?.name) ||
                (typeof t !== 'string' && t?.name === matchData.awayTeam?.name);
        });
    }, [user?.preferences?.favoriteTeams, matchData.awayTeam]);

    // Initial Fetch (if needed, though HomeScreen likely fetched it)
    const { refetch } = useGetLiveMatchesQuery(undefined);

    // Ensure socket listeners are active when on this screen
    useEffect(() => {
        dispatch(initSocketListeners());
    }, [dispatch]);

    const derivedCommentary = React.useMemo(() => {
        const commentaryList: any[] = [];

        // Cricket Commentary
        if (matchData.sport === 'cricket' && matchData.comments?.Live) {
            matchData.comments.Live.forEach((c: any) => {
                commentaryList.push({
                    time: c?.overs ? `${c.overs} ov` : '',
                    text: c?.text || c?.comment || c?.post || 'Ball bowled',
                    key: `cricket-${Math.random()}`
                });
            });
        }

        // Football Events as Commentary
        if (matchData.sport === 'football' && matchData.events) {
            matchData.events.forEach((e: any, index: number) => {
                let text = '';
                if (e.type === 'goal') {
                    text = `⚽ GOAL! ${e.player} scores for ${e.team === 'home' ? matchData.homeTeam?.name : matchData.awayTeam?.name}`;
                } else if (e.type === 'card') {
                    text = `${e.cardType || 'Yellow'} Card 🟨 to ${e.player} (${e.team === 'home' ? matchData.homeTeam?.name : matchData.awayTeam?.name})`;
                }

                if (text) {
                    commentaryList.push({
                        time: `${e.time}'`,
                        text,
                        key: `football-${index}`
                    });
                }
            });
            // Reverse to show latest first
            commentaryList.reverse();
        }

        // Basketball Commentary
        if (matchData.sport === 'basketball' && matchData.basketballData) {
            const b = matchData.basketballData;
            if (b.home_q4) commentaryList.push({ time: 'Q4', text: `End of Q4: ${b.home_q4} - ${b.away_q4}`, key: 'q4' });
            if (b.home_q3) commentaryList.push({ time: 'Q3', text: `End of Q3: ${b.home_q3} - ${b.away_q3}`, key: 'q3' });
            if (b.home_q2) commentaryList.push({ time: 'Q2', text: `End of Q2: ${b.home_q2} - ${b.away_q2}`, key: 'q2' });
            if (b.home_q1) commentaryList.push({ time: 'Q1', text: `End of Q1: ${b.home_q1} - ${b.away_q1}`, key: 'q1' });
        }

        return commentaryList;
    }, [matchData]);


    const handleFollow = useCallback(async (teamName: string) => {
        if (!user) {
            showToast('Please login to follow teams', 'info');
            return;
        }

        try {
            const currentTeams = user.preferences?.favoriteTeams || [];

            // Determine Team Data
            const isHome = teamName === matchData.homeTeam?.name;
            const teamData = isHome ? matchData.homeTeam : matchData.awayTeam;

            // Check if following (Robust check)
            const isFollowing = currentTeams.some((t: any) => {
                const tId = typeof t === 'string' ? t : t.id;
                return (teamData.id && String(tId) === String(teamData.id)) ||
                    (typeof t === 'string' && t === teamName) ||
                    (typeof t !== 'string' && t?.name === teamName);
            });

            let newTeams;
            if (isFollowing) {
                // Unfollow
                newTeams = currentTeams.filter((t: any) => {
                    const tId = typeof t === 'string' ? t : t.id;
                    const tName = typeof t === 'string' ? t : t.name;
                    return String(tId) !== String(teamData.id) && tName !== teamName;
                });
                showToast(`Unfollowed ${teamName}`, 'success');
            } else {
                // Follow - Save Object if possible
                const teamToSave = {
                    id: teamData.id,
                    name: teamData.name || teamName,
                    sport: matchData.sport,
                    logo: teamData.logo
                };
                newTeams = [...currentTeams, teamToSave];
                showToast(`Following ${teamName}`, 'success');
            }

            await dispatch(updateUserPreferences({ favoriteTeams: newTeams })).unwrap();
        } catch (error) {
            console.error('Follow Error:', error);
            showToast('Failed to update favorites', 'error');
        }
    }, [user, dispatch, showToast, matchData]);

    const getSportColor = () => {
        switch (matchData.sport?.toLowerCase()) {
            case 'cricket': return theme.colors.cricket;
            case 'football': return theme.colors.football;
            case 'basketball': return theme.colors.basketball;
            default: return theme.colors.primary;
        }
    };

    const activeColor = getSportColor();

    const isFinished = ['Finished', 'FT', 'AET', 'Ended'].includes(matchData.status) || matchData.status?.toLowerCase() === 'finished';

    // Fetch Data for Tabs
    const { data: h2hData, isLoading: isH2HLoading, refetch: refetchH2H } = useGetMatchH2HQuery({
        sport: matchData.sport || 'football',
        team1Id: matchData.homeTeam?.id || '',
        team2Id: matchData.awayTeam?.id || ''
    }, {
        skip: !matchData.homeTeam?.id || !matchData.awayTeam?.id,
        pollingInterval: isFinished ? 0 : 300000, // Disable polling if finished
        refetchOnMountOrArgChange: true
    });

    const { data: standingsData, isLoading: isStandingsLoading, refetch: refetchStandings } = useGetMatchStandingsQuery({
        sport: matchData.sport || 'football',
        leagueId: matchData.leagueInfo?.id || ''
    }, {
        skip: !matchData.leagueInfo?.id,
        pollingInterval: isFinished ? 0 : 300000, // Disable polling if finished
        refetchOnMountOrArgChange: true
    });

    // Refetch data when respective tabs become active
    useEffect(() => {
        if (activeTab === 'Standings' && matchData.leagueInfo?.id) {
            refetchStandings();
        } else if (activeTab === 'H2H' && matchData.homeTeam?.id && matchData.awayTeam?.id) {
            refetchH2H();
        }
    }, [activeTab, matchData.leagueInfo?.id, matchData.homeTeam?.id, matchData.awayTeam?.id, refetchStandings, refetchH2H]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Scorecard':
                return (
                    <Scorecard
                        match={matchData}
                        onPlayerPress={(player) => navigation.navigate('PlayerProfile', {
                            player: { ...player, sport: matchData.sport || 'football' }
                        })}
                    />
                );
            case 'H2H':
                if (isH2HLoading && !h2hData) {
                    return (
                        <View style={[styles.tabContent, { justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }]}>
                            <ActivityIndicator size="large" color={activeColor} />
                            <Text style={[styles.textMuted, { marginTop: 16 }]}>Loading head-to-head data...</Text>
                        </View>
                    );
                }

                const rawH2H = h2hData as any;
                const h2hList = Array.isArray(rawH2H) ? rawH2H : (rawH2H?.H2H || rawH2H?.matches || []);

                return (
                    <View style={styles.tabContent}>
                        <View style={[styles.sectionHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <Text style={styles.sectionTitle}>Head to Head</Text>
                            <TouchableOpacity
                                onPress={() => refetchH2H()}
                                style={{ padding: 8 }}
                            >
                                <Ionicons name="refresh" size={20} color={activeColor} />
                            </TouchableOpacity>
                        </View>
                        <H2HStats
                            data={h2hList.map((m: any) => ({
                                match_date: m.event_date || m.event_date_start || m.date || m.match_date || '',
                                match_hometeam_name: m.event_home_team || m.homeTeam?.name || m.match_hometeam_name || 'Unknown',
                                match_awayteam_name: m.event_away_team || m.awayTeam?.name || m.match_awayteam_name || 'Unknown',
                                match_hometeam_score: m.event_home_final_result || m.homeTeam?.score || m.match_hometeam_score || '?',
                                match_awayteam_score: m.event_away_final_result || m.awayTeam?.score || m.match_awayteam_score || '?'
                            }))}
                            team1={matchData.homeTeam}
                            team2={matchData.awayTeam}
                        />
                    </View>
                );
            case 'Standings':
                if (isStandingsLoading && !standingsData) {
                    return (
                        <View style={[styles.tabContent, { justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }]}>
                            <ActivityIndicator size="large" color={activeColor} />
                            <Text style={[styles.textMuted, { marginTop: 16 }]}>Loading standings...</Text>
                        </View>
                    );
                }
                return (
                    <View style={styles.tabContent}>
                        <View style={[styles.sectionHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <Text style={styles.sectionTitle}>League Standings</Text>
                            <TouchableOpacity
                                onPress={() => refetchStandings()}
                                style={{ padding: 8 }}
                            >
                                <Ionicons name="refresh" size={20} color={activeColor} />
                            </TouchableOpacity>
                        </View>
                        <StandingsWidget
                            data={standingsData?.map(item => ({
                                team: {
                                    id: item.team?.id || '',
                                    name: item.team?.name || ''
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
                            highlightTeams={[matchData.homeTeam?.id || '', matchData.awayTeam?.id || '']}
                        />
                    </View>
                );
            case 'Commentary':
                return (
                    <Commentary commentary={derivedCommentary} />
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
                                        league: {
                                            id: matchData.leagueInfo.id,
                                            name: matchData.leagueInfo.name,
                                            sport: matchData.sport,
                                            country: { name: matchData.leagueInfo.country },
                                            season: matchData.leagueInfo.season
                                        }
                                    });
                                } else {
                                    navigation.navigate('Main');
                                }
                            }}
                        />

                        <TouchableOpacity onPress={() => navigation.navigate('LeagueDetails', {
                            league: {
                                id: matchData.leagueInfo?.id,
                                name: matchData.leagueInfo?.name || matchData.league || '',
                                sport: matchData.sport,
                                country: { name: matchData.leagueInfo?.country || '' },
                                season: matchData.leagueInfo?.season,
                                logo: matchData.leagueInfo?.logo || matchData.leagueLogo
                            }
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

