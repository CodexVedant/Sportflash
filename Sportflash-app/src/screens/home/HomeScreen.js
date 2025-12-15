import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Animated, TouchableOpacity, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { theme } from '../../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import MatchCard from '../../components/match/MatchCard';
import { Ionicons } from '@expo/vector-icons';
import SearchModal from '../../components/common/SearchModal';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

import Sidebar, { SidebarContent } from '../../components/navigation/Sidebar';

export default function HomeScreen({ navigation }) {
    const [searchVisible, setSearchVisible] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions();
    const { user } = useContext(AuthContext);

    // Responsive Logic
    const isWideScreen = width > 1200;
    const isDesktop = width > 768; // Desktop breakpoint
    const isTablet = width > 480 && width <= 768;

    // Grid Calculation
    const numColumns = isWideScreen ? 3 : (isDesktop ? 2 : 1);
    const gap = theme.spacing.md;
    const cardWidth = isDesktop
        ? (width - (theme.spacing.lg * 2) - (gap * (numColumns - 1))) / numColumns
        : '100%';

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const response = await api.get('/matches/live');

            // Map backend data to UI format
            const mappedMatches = response.data.data.map(match => {
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
            });

            setMatches(mappedMatches);
        } catch (error) {
            console.log('Error fetching matches:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <SearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} />
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

            {/* Header */}
            <View style={[styles.header, isDesktop && styles.headerDesktop]}>
                {/* Menu Icon (Always Visible) */}
                <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuBtn}>
                    <Ionicons name="menu" size={28} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={[styles.logoContainer, isDesktop && styles.logoContainerDesktop]}>
                    <Text style={styles.logoText}>Sport<Text style={styles.highlight}>Flash</Text></Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => setSearchVisible(true)}>
                        <Ionicons name="search" size={24} color={theme.colors.text} style={{ marginRight: 16 }} />
                    </TouchableOpacity>

                    {user ? (
                        <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
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

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={[styles.contentContainer, isDesktop && styles.contentContainerDesktop]}>

                    {/* Live Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>TOP LIVE MATCHES</Text>

                        {loading ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        ) : matches.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No live matches right now.</Text>
                            </View>
                        ) : (
                            <View style={[styles.gridContainer, isDesktop && { flexDirection: 'row', flexWrap: 'wrap', gap: gap }]}>
                                {matches.map(match => (
                                    <View key={match.id} style={{ width: cardWidth, marginBottom: isDesktop ? 0 : 16 }}>
                                        <MatchCard
                                            sport={match.sport}
                                            status={match.status}
                                            league={match.league}
                                            homeTeam={match.homeTeam}
                                            awayTeam={match.awayTeam}
                                            score={match.score}
                                            timer={match.timer}
                                            onPress={() => navigation.navigate('MatchDetail', { match })}
                                        />
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Trending News Placeholder */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>TRENDING NEWS</Text>
                        <View style={styles.newsPlaceholder}>
                            <Text style={{ color: theme.colors.textMuted }}>News feed coming in Phase 1B...</Text>
                        </View>
                    </View>

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
        maxWidth: 1024,
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
