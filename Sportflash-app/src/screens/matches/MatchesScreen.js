import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { theme } from '../../utils/theme';
import MatchCard from '../../components/match/MatchCard';
import Sidebar from '../../components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';

export default function MatchesScreen() {
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const TABS = ['Live', 'Upcoming', 'Results'];

    const MOCK_UPCOMING = [
        {
            id: 'u1',
            league: 'Premier League',
            status: 'Scheduled',
            sport: 'football',
            homeTeam: { name: 'Arsenal', logo: null, score: '' },
            awayTeam: { name: 'Liverpool', logo: null, score: '' },
            timer: '20:00',
            date: 'Tomorrow'
        },
        {
            id: 'u2',
            league: 'IPL',
            status: 'Scheduled',
            sport: 'cricket',
            homeTeam: { name: 'CSK', logo: null, score: '' },
            awayTeam: { name: 'RCB', logo: null, score: '' },
            timer: '19:30',
            date: 'Today'
        }
    ];

    const MOCK_RESULTS = [
        {
            id: 'r1',
            league: 'NBA',
            status: 'Finished',
            sport: 'basketball',
            homeTeam: { name: 'Celtics', logo: null, score: '112' },
            awayTeam: { name: 'Heat', logo: null, score: '108' },
            timer: 'FT'
        },
        {
            id: 'r2',
            league: 'La Liga',
            status: 'Finished',
            sport: 'football',
            homeTeam: { name: 'Barcelona', logo: null, score: '2' },
            awayTeam: { name: 'Real Madrid', logo: null, score: '1' },
            timer: 'FT'
        }
    ];

    const renderMatchItem = ({ item }) => (
        <View style={{ marginBottom: 16 }}>
            <MatchCard
                sport={item.sport}
                status={item.status}
                league={item.league}
                homeTeam={item.homeTeam}
                awayTeam={item.awayTeam}
                score={item.status === 'Finished' ? `${item.homeTeam.score} - ${item.awayTeam.score}` : null}
                timer={item.timer}
            />
        </View>
    );

    const getData = () => {
        if (activeTab === 'Upcoming') return MOCK_UPCOMING;
        if (activeTab === 'Results') return MOCK_RESULTS;
        return []; // Live handled by Home, or mock empty here
    };

    return (
        <SafeAreaView style={styles.container}>
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuBtn}>
                        <Ionicons name="menu" size={28} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Matches</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <FlatList
                data={getData()}
                keyExtractor={item => item.id}
                renderItem={renderMatchItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No matches found for {activeTab}</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitle: {
        fontSize: theme.sizes.xl,
        fontFamily: theme.fonts.display,
        color: theme.colors.text,
    },
    tabsContainer: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        gap: 12,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    activeTab: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    tabText: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
    },
    activeTabText: {
        color: '#fff',
    },
    listContent: {
        padding: theme.spacing.lg,
        paddingBottom: 100,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontSize: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuBtn: {
        marginRight: 16,
    }
});
