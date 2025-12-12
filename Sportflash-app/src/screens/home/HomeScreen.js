import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Animated } from 'react-native';
import { theme } from '../../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import MatchCard from '../../components/match/MatchCard';
import { Ionicons } from '@expo/vector-icons';

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

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Sport<Text style={styles.highlight}>Flash</Text></Text>
                </View>
                <View style={styles.actions}>
                    <Ionicons name="search" size={24} color={theme.colors.text} style={{ marginRight: 16 }} />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    logoText: {
        fontSize: 24,
        fontFamily: theme.fonts.display, // or 'Oswald' if successfully loaded
        fontWeight: 'bold',
        color: theme.colors.text,
        letterSpacing: 1,
    },
    highlight: {
        color: theme.colors.primary,
    },
    actions: {
        flexDirection: 'row',
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
