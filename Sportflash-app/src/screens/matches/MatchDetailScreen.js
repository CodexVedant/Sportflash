import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function MatchDetailScreen({ navigation, route }) {
    const { match } = route.params || {};
    const [activeTab, setActiveTab] = useState('Scorecard');

    // Default mock if no params (for testing directly)
    const displayMatch = match || {
        sport: 'cricket',
        homeTeam: { name: 'IND', logo: '🇮🇳', score: '248/3' },
        awayTeam: { name: 'AUS', logo: '🇦🇺', score: '180/6' },
        status: 'live',
        league: 'ICC World Cup 2026'
    };

    const getSportColor = () => {
        switch (displayMatch.sport?.toLowerCase()) {
            case 'cricket': return theme.colors.cricket;
            case 'football': return theme.colors.football;
            case 'basketball': return theme.colors.basketball;
            default: return theme.colors.primary;
        }
    };

    const activeColor = getSportColor();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Scorecard':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Batting - India</Text>
                        </View>
                        {['Virat Kohli', 'Rohit Sharma', 'Shubman Gill'].map((p, i) => (
                            <View key={i} style={styles.statRow}>
                                <Text style={styles.playerName}>{p}</Text>
                                <Text style={styles.statValue}>{45 + i * 12} (32)</Text>
                            </View>
                        ))}
                    </View>
                );
            case 'Commentary':
                return (
                    <View style={styles.tabContent}>
                        {[1, 2, 3].map((item, i) => (
                            <View key={i} style={styles.commBubble}>
                                <View style={styles.overBadge}>
                                    <Text style={styles.overText}>42.{i}</Text>
                                </View>
                                <Text style={styles.commText}>
                                    What a shot! Covers driven beautifully for four. The crowd goes wild!
                                </Text>
                            </View>
                        ))}
                    </View>
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
                {/* Top Navigation Bar */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{displayMatch.league}</Text>
                    <TouchableOpacity>
                        <Ionicons name="share-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Match Score Hero */}
                <View style={styles.scoreHero}>
                    <View style={styles.teamContainer}>
                        <View style={styles.logoLg}><Text style={{ fontSize: 32 }}>{displayMatch.homeTeam.logo}</Text></View>
                        <Text style={styles.teamNameHero}>{displayMatch.homeTeam.name}</Text>
                    </View>

                    <View style={styles.scoreBoard}>
                        <Text style={styles.mainScore}>{displayMatch.homeTeam.score}</Text>
                        <Text style={styles.vsText}>VS</Text>
                        <Text style={styles.mainScore}>{displayMatch.awayTeam.score || '--/--'}</Text>
                        <Text style={styles.statusBadge}>{displayMatch.status.toUpperCase()}</Text>
                    </View>

                    <View style={styles.teamContainer}>
                        <View style={styles.logoLg}><Text style={{ fontSize: 32 }}>{displayMatch.awayTeam.logo}</Text></View>
                        <Text style={styles.teamNameHero}>{displayMatch.awayTeam.name}</Text>
                    </View>
                </View>

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
                <ScrollView style={styles.contentScroll}>
                    {renderTabContent()}
                </ScrollView>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
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
