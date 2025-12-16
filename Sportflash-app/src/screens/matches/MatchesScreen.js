import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { theme } from '../../utils/theme';
import MatchCard from '../../components/match/MatchCard';
import Sidebar from '../../components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function MatchesScreen() {
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);

    const TABS = ['Live', 'Upcoming', 'Results'];

    useEffect(() => {
        fetchMatches();
    }, [activeTab]);

    const fetchMatches = async () => {
        setLoading(true);
        try {
            let endpoint = '/matches/upcoming';
            if (activeTab === 'Live') endpoint = '/matches/live';
            else if (activeTab === 'Upcoming') endpoint = '/matches/upcoming';
            else if (activeTab === 'Results') endpoint = '/matches?status=finished';

            const response = await api.get(endpoint);
            setMatches(response.data.data || []);
        } catch (error) {
            console.log('Error fetching matches:', error);
            setMatches([]);
        } finally {
            setLoading(false);
        }
    };

    const renderMatchItem = ({ item }) => (
        <View style={{ marginBottom: 16 }}>
            <MatchCard
                sport={item.sport}
                status={item.status}
                league={item.league}
                homeTeam={item.homeTeam}
                awayTeam={item.awayTeam}
                score={item.status === 'finished' || item.status === 'live' ?
                    (item.homeTeam.score && item.awayTeam.score ? `${item.homeTeam.score} - ${item.awayTeam.score}` : 'vs')
                    : null
                }
                timer={item.currentMinute || (item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}
            />
        </View>
    );

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
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={matches}
                    keyExtractor={item => item._id}
                    renderItem={renderMatchItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No matches found for {activeTab}</Text>
                        </View>
                    }
                />
            )}
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
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
