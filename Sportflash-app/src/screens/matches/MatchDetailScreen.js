import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withSpring, interpolateColor } from 'react-native-reanimated';
import MatchHeader from '@components/match/MatchHeader';
import Scorecard from '@components/match/Scorecard';
import Commentary from '@components/match/Commentary';
import { useToast } from '@context/ToastContext';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPreferences } from '@store/slices/authSlice';
import socket from '@services/socket';

export default function MatchDetailScreen({ navigation, route }) {
    const { match } = route.params || {};
    const [activeTab, setActiveTab] = useState('Scorecard');
    const { showToast } = useToast();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    // Default mock if no params
    const initialMatch = match || {
        _id: '1', // Ensure ID matches backend simulation
        sport: 'cricket',
        homeTeam: { name: 'IND', logo: '🇮🇳', score: '248/3' },
        awayTeam: { name: 'AUS', logo: '🇦🇺', score: '180/6' },
        status: 'live',
        league: 'ICC World Cup 2026'
    };

    const [homeScore, setHomeScore] = useState(initialMatch.homeTeam.score || '0/0');
    const [awayScore, setAwayScore] = useState(initialMatch.awayTeam.score || '0/0');
    const [timer, setTimer] = useState(initialMatch.timer || '');
    const [liveCommentary, setLiveCommentary] = useState([]);

    // Logic to check if following
    const isFollowingHome = user?.preferences?.favoriteTeams?.includes(initialMatch.homeTeam.name);
    const isFollowingAway = user?.preferences?.favoriteTeams?.includes(initialMatch.awayTeam.name);

    const handleFollow = async (teamName) => {
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
    };

    // Animation Shared Value for Flash Effect
    // const scoreColorAnim = useSharedValue(0);

    const getSportColor = () => {
        switch (initialMatch.sport?.toLowerCase()) {
            case 'cricket': return theme.colors.cricket;
            case 'football': return theme.colors.football;
            case 'basketball': return theme.colors.basketball;
            default: return theme.colors.primary;
        }
    };

    const activeColor = getSportColor();

    // Removed interpolated color animation due to Android crash (String -> Double cast error)
    // We will simple use the activeColor or white


    // Real-time Socket Connection
    useEffect(() => {
        // join match room
        const matchId = initialMatch._id || initialMatch.id || '1';
        socket.emit('join_match', matchId);

        const handleScoreUpdate = (data) => {
            console.log("Socket Update:", data);

            // Only update if match ID matches (or generic '1' for demo)
            if (data.matchId === matchId || matchId === '1') {
                if (data.homeScore !== homeScore) {
                    setHomeScore(data.homeScore);
                    // Flash animation on score change
                    // scoreColorAnim.value = withSequence(
                    //    withTiming(1, { duration: 100 }),
                    //    withTiming(0, { duration: 500 })
                    // );
                }

                if (data.awayScore) setAwayScore(data.awayScore);
                if (data.currentMinute) setTimer(data.currentMinute);

                if (data.commentary) {
                    setLiveCommentary(prev => {
                        const newComm = [{ text: data.commentary, time: data.currentMinute }, ...prev];
                        return newComm.slice(0, 20); // Keep last 20
                    });

                    if (activeTab === 'Commentary') {
                        // showToast('🎙️ New Commentary Update', 'info'); 
                    }
                }
            }
        };

        socket.on('score_update', handleScoreUpdate);

        return () => {
            socket.off('score_update', handleScoreUpdate);
            socket.emit('leave_match', matchId);
        };
    }, []);


    const renderTabContent = () => {
        switch (activeTab) {
            case 'Scorecard':
                return (
                    <Scorecard
                        match={initialMatch}
                        onPlayerPress={(player) => navigation.navigate('PlayerProfile', { player })}
                    />
                );
            case 'Commentary':
                return (
                    <Commentary commentary={liveCommentary} />
                );
            default:
                return (
                    <View style={styles.tabContent}>
                        <Text style={{ color: theme.colors.textMuted }}>Match Info Details...</Text>
                    </View>
                );
        }
    };

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
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{initialMatch.league}</Text>
                        <TouchableOpacity>
                            <Ionicons name="share-outline" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Match Score Hero */}
                    <MatchHeader
                        match={initialMatch}
                        homeScore={homeScore}
                        awayScore={awayScore}
                        timer={timer}
                        onFollow={handleFollow}
                        isFollowingHome={isFollowingHome}
                        isFollowingAway={isFollowingAway}
                    />

                    {/* Tabs */}
                    <View style={styles.tabBar}>
                        {['Scorecard', 'Commentary', 'Info'].map((tab) => (
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    mainContainer: {
        flex: 1,
        width: '100%',
    },
    desktopContainer: {
        maxWidth: 1024,
        alignSelf: 'center',
        paddingTop: 20,
    },
    headerBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
        opacity: 0.2,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    scoreHero: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    teamContainer: {
        alignItems: 'center',
    },
    logoLg: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    teamNameHero: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    scoreBoard: {
        alignItems: 'center',
    },
    mainScore: {
        color: '#FFF',
        fontSize: 22, // Should use display font
        fontWeight: 'bold',
        marginBottom: 4,
    },
    vsText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginBottom: 4,
    },
    statusBadge: {
        color: theme.colors.danger,
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 4,
    },
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        marginBottom: 10,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabText: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    contentScroll: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },
    tabContent: {
        paddingBottom: 40,
    },
    sectionHeader: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    sectionTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    playerName: {
        color: theme.colors.text,
    },
    statValue: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    commBubble: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        gap: 12,
    },
    overBadge: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        height: 24,
    },
    overText: {
        color: theme.colors.text,
        fontSize: 12,
        fontWeight: 'bold',
    },
    commText: {
        color: theme.colors.textMuted,
        flex: 1,
        lineHeight: 20,
    }
});
