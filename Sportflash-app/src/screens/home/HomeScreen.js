import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import MatchCard from '@components/match/MatchCard';
import { Ionicons } from '@expo/vector-icons';
import SearchModal from '@components/common/SearchModal';
import { useGetLiveMatchesQuery } from '@store/api/matchesApi';
import { AuthContext } from '@context/AuthContext';
import { useContext } from 'react';
import { NotificationBell, NotificationPanel } from '@components/notifications';
import { useLiveScores } from '@hooks/useSocket';
import LiveMatchesWidget from '@screens/home/LiveMatchesWidget';
import TrendingNewsWidget from '@screens/home/TrendingNewsWidget';
import MenuToggle from '@components/navigation/MenuToggle';
import TopBar from '@components/navigation/TopBar';

import Sidebar, { SidebarContent } from '@components/navigation/Sidebar';

export default function HomeScreen({ navigation }) {
    const [searchVisible, setSearchVisible] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [matches, setMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSport, setActiveSport] = useState('all');
    const { width } = useWindowDimensions();
    const { user } = useContext(AuthContext);

    // Mock notifications
    const [notifications] = useState([
        {
            id: 1,
            type: 'match_start',
            title: 'Match Starting Soon',
            message: 'India vs Australia starts in 15 minutes',
            timestamp: new Date(),
            read: false,
        },
        {
            id: 2,
            type: 'goal',
            title: 'GOAL!',
            message: 'Manchester United scored! 1-0',
            timestamp: new Date(Date.now() - 300000),
            read: false,
        },
    ]);

    const SPORT_TABS = [
        { id: 'all', label: 'All Sports', icon: 'globe-outline' },
        { id: 'cricket', label: 'Cricket', icon: 'baseball-outline' },
        { id: 'football', label: 'Football', icon: 'football-outline' },
        { id: 'basketball', label: 'Basketball', icon: 'basketball-outline' },
    ];

    // Responsive Logic
    const isDesktop = width > 768;
    const MAX_WIDTH = 1200;
    const contentWidth = isDesktop ? Math.min(width, MAX_WIDTH) : width;

    // Grid Calculation
    const numColumns = width > 1024 ? 3 : (isDesktop ? 2 : 1);
    const gap = theme.spacing.md;
    const padding = theme.spacing.lg * 2;

    const cardWidth = isDesktop
        ? (contentWidth - padding - (gap * (numColumns - 1))) / numColumns
        : '100%';

    // Get live matches from Redux RTK Query
    const { data: initialMatches = [], isLoading: isMatchesLoading, refetch } = useGetLiveMatchesQuery();

    // Get live scores from socket
    const liveScores = useLiveScores();

    useEffect(() => {
        if (initialMatches.length > 0) {
            // Map backend data to UI format
            const formattedMatches = initialMatches.map(mapMatchToUI);
            const liveMatchesOnly = formattedMatches.filter(m => m.status === 'live');
            setMatches(liveMatchesOnly);
            setLoading(false);
        } else if (!isMatchesLoading) {
            setLoading(false);
        }
    }, [initialMatches, isMatchesLoading]);

    // Filter matches by sport
    useEffect(() => {
        if (activeSport === 'all') {
            setFilteredMatches(matches);
        } else {
            const filtered = matches.filter(match => match.sport?.toLowerCase() === activeSport);
            setFilteredMatches(filtered);
        }
    }, [matches, activeSport]);

    // Update matches when live cricket scores arrive
    useEffect(() => {
        if (liveScores.cricket && liveScores.cricket.length > 0) {
            console.log('🔴 Live cricket scores received, updating UI...');

            // Map live cricket scores to UI format
            const liveCricketMatches = liveScores.cricket
                .filter(match => match.status === 'live')
                .map(match => ({
                    id: match.id,
                    sport: 'cricket',
                    status: match.status,
                    league: match.league,
                    homeTeam: {
                        name: match.homeTeam.name,
                        logo: match.homeTeam.logo,
                        score: match.homeTeam.score
                    },
                    awayTeam: {
                        name: match.awayTeam.name,
                        logo: match.awayTeam.logo,
                        score: match.awayTeam.score
                    },
                    score: match.homeTeam.score && match.awayTeam.score
                        ? `${match.homeTeam.score} - ${match.awayTeam.score}`
                        : null,
                    timer: match.cricketData?.overs ? `${match.cricketData.overs} Overs` : match.currentMinute || ''
                }));

            // Merge with existing matches
            setMatches(prevMatches => {
                const nonCricket = prevMatches.filter(m => m.sport !== 'cricket');
                return [...liveCricketMatches, ...nonCricket];
            });
        }
    }, [liveScores.cricket]);


    const mapMatchToUI = (match) => {
        let timer = match.currentMinute;
        let centerInfo = null;

        if (match.sport === 'cricket') {
            timer = match.cricketData?.overs ? `${match.cricketData.overs} Overs` : '';
        } else if (match.sport === 'basketball') {
            timer = match.basketballData?.quarter ? `Q${match.basketballData.quarter}` : '';
            centerInfo = 'Live';
        } else if (match.sport === 'football') {
            if (match.homeTeam.score && match.awayTeam.score) {
                centerInfo = `${match.homeTeam.score} - ${match.awayTeam.score}`;
            }
        }

        return {
            id: match._id,
            sport: match.sport,
            status: match.status,
            league: match.league,
            homeTeam: {
                name: match.homeTeam.name,
                logo: match.homeTeam.logo,
                score: match.homeTeam.score
            },
            awayTeam: {
                name: match.awayTeam.name,
                logo: match.awayTeam.logo,
                score: match.awayTeam.score
            },
            score: centerInfo,
            timer: timer
        };
    };

    return (
        <SafeAreaView style={styles.container}>
            <SearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} />
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
            <NotificationPanel
                visible={notificationVisible}
                onClose={() => setNotificationVisible(false)}
                notifications={notifications}
                onNotificationPress={(notification) => {
                    console.log('Notification pressed:', notification);
                    setNotificationVisible(false);
                }}
            />

            {/* Header */}
            <View style={[styles.header, isDesktop && styles.headerDesktop]}>
                {/* Menu Icon (Always Visible) */}
                <MenuToggle onPress={() => setSidebarVisible(true)} />

                <View style={[styles.logoContainer, isDesktop && styles.logoContainerDesktop]}>
                    <Text style={styles.logoText}>Sport<Text style={styles.highlight}>Flash</Text></Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => setSearchVisible(true)}>
                        <Ionicons name="search" size={24} color={theme.colors.text} style={{ marginRight: 16 }} />
                    </TouchableOpacity>

                    {user ? (
                        <NotificationBell
                            count={notifications.filter(n => !n.read).length}
                            onPress={() => setNotificationVisible(true)}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.loginBtn}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.loginBtnText}>Login</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Sport Tabs */}
            <TopBar
                activeTab={activeSport}
                onTabChange={setActiveSport}
                tabs={SPORT_TABS}
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={[styles.contentContainer, isDesktop && styles.contentContainerDesktop]}>

                    {/* Live Section */}
                    <LiveMatchesWidget
                        matches={filteredMatches}
                        loading={loading}
                        width={width}
                        navigation={navigation}
                        gap={theme.spacing.md}
                    />

                    {/* Trending News Placeholder */}
                    <TrendingNewsWidget />

                    {/* Bottom spacing for TabBar */}
                    <View style={{ height: 80 }} />

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        position: 'relative',
    },
    menuBtn: {
        zIndex: 20,
    },
    logoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
    },
    emptyContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: theme.borderRadius.lg,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: theme.sizes.md,
    },
    logoText: {
        fontSize: 24,
        fontFamily: theme.fonts.display,
        fontWeight: 'bold',
        color: theme.colors.text,
        letterSpacing: 1,
    },
    highlight: {
        color: theme.colors.primary,
    },
    actions: {
        flexDirection: 'row',
        zIndex: 10,
        alignItems: 'center', // Fix vertical alignment
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.sm,
        fontWeight: '600',
        marginBottom: theme.spacing.md,
        letterSpacing: 1,
    },
    newsPlaceholder: {
        height: 150,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    // Desktop Styles
    headerDesktop: {
        paddingHorizontal: theme.spacing.xl,
        justifyContent: 'space-between',
    },
    logoContainerDesktop: {
        position: 'relative', // Reset absolute position on desktop
        alignItems: 'flex-start',
        left: 'auto',
        right: 'auto',
    },
    contentContainer: {
        width: '100%',
    },
    contentContainerDesktop: {
        maxWidth: 1200,
        alignSelf: 'center',
    },
    gridContainer: {
        width: '100%',
    },
    loginBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    loginBtnText: {
        color: '#fff',
        fontFamily: theme.fonts.bold,
        fontSize: 14,
    }
});
