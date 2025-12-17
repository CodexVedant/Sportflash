import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { theme } from '../../utils/theme';
import MatchCard from '../../components/match/MatchCard';
import Sidebar from '../../components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { SkeletonList, EmptyState, NetworkError } from '../../components/common';
import { FilterPanel } from '../../components/filter';
import { NotificationBell, NotificationPanel } from '../../components/notifications';

export default function MatchesScreen() {
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [filters, setFilters] = useState({
        sport: 'all',
        status: 'all',
        league: 'all',
        dateRange: { start: null, end: null },
    });

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

    const TABS = ['Live', 'Upcoming', 'Results'];

    useEffect(() => {
        fetchMatches();
    }, [activeTab, filters]);

    const fetchMatches = async () => {
        setLoading(true);
        setError(null);

        try {
            let endpoint = '/matches/upcoming';
            if (activeTab === 'Live') endpoint = '/matches/live';
            else if (activeTab === 'Upcoming') endpoint = '/matches/upcoming';
            else if (activeTab === 'Results') endpoint = '/matches?status=finished';

            const response = await api.get(endpoint, { params: filters });
            setMatches(response.data.data || []);
        } catch (err) {
            console.log('Error fetching matches:', err);
            if (!err.response) {
                setError({ type: 'network' });
            } else {
                setError({ type: 'api', message: err.message });
            }
            setMatches([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
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

    const unreadCount = notifications.filter(n => !n.read).length;

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
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.iconBtn}>
                        <Ionicons name="options-outline" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <NotificationBell
                        count={unreadCount}
                        onPress={() => setNotificationVisible(true)}
                    />
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
                <SkeletonList type="match" count={5} />
            ) : error?.type === 'network' ? (
                <NetworkError onRetry={fetchMatches} />
            ) : (
                <FlatList
                    data={matches}
                    keyExtractor={item => item._id}
                    renderItem={renderMatchItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <EmptyState
                            variant="noMatches"
                            actionLabel="Clear Filters"
                            onAction={() => setFilters({
                                sport: 'all',
                                status: 'all',
                                league: 'all',
                                dateRange: { start: null, end: null },
                            })}
                        />
                    }
                />
            )}

            {/* Filter Panel */}
            <FilterPanel
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={handleApplyFilters}
                initialFilters={filters}
            />

            {/* Notification Panel */}
            <NotificationPanel
                visible={notificationVisible}
                onClose={() => setNotificationVisible(false)}
                notifications={notifications}
                onNotificationPress={(notification) => {
                    console.log('Notification pressed:', notification);
                    setNotificationVisible(false);
                }}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: theme.sizes.xl,
        fontFamily: theme.fonts.display,
        color: theme.colors.text,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconBtn: {
        padding: 8,
    },
    menuBtn: {
        marginRight: 16,
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
});
