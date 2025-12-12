import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { theme } from '../../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import MatchCard from '../../components/match/MatchCard';
import { Ionicons } from '@expo/vector-icons';
import SearchModal from '../../components/common/SearchModal';

// Mock Data
const LIVE_MATCHES = [
    {
        id: 1,
        sport: 'cricket',
        status: 'live',
        league: 'ICC World Cup 2026',
        homeTeam: { name: 'IND', logo: '🇮🇳', score: '248/3', overs: '42.4 Overs' },
        awayTeam: { name: 'AUS', logo: '🇦🇺', score: '--/--', overs: '' },
        score: null, // Cricket shows score in team object
    },
    {
        id: 2,
        sport: 'football',
        status: 'live',
        league: 'Premier League',
        homeTeam: { name: 'MUN', logo: '🔴', score: '' },
        awayTeam: { name: 'CHE', logo: '🔵', score: '' },
        score: '2 - 1',
        timer: '72:34',
    },
    {
        id: 3,
        sport: 'basketball',
        status: 'live',
        league: 'NBA',
        homeTeam: { name: 'LAL', logo: '🟣', score: '88' },
        awayTeam: { name: 'GSW', logo: '🌉', score: '92' },
        score: 'Q4',
        timer: '04:21',
    },
];

export default function HomeScreen({ navigation }) {
    const [searchVisible, setSearchVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <SearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Sport<Text style={styles.highlight}>Flash</Text></Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => setSearchVisible(true)}>
                        <Ionicons name="search" size={24} color={theme.colors.text} style={{ marginRight: 16 }} />
                    </TouchableOpacity>
                    <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Live Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>TOP LIVE MATCHES</Text>
                    {LIVE_MATCHES.map(match => (
                        <MatchCard
                            key={match.id}
                            sport={match.sport}
                            status={match.status}
                            league={match.league}
                            homeTeam={match.homeTeam}
                            awayTeam={match.awayTeam}
                            score={match.score}
                            onPress={() => navigation.navigate('MatchDetail', { match })}
                        />
                    ))}
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
        justifyContent: 'flex-end', // Push actions to the right
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        position: 'relative',
    },
    logoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none', // Allow clicks to pass through if overlapping
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
        zIndex: 10, // Ensure actions are clickable
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
    }
});
