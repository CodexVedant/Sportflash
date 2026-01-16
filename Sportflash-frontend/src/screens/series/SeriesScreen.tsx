import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import Sidebar from '@components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@utils/style/SeriesScreen.styles';
import { useGetLeaguesQuery } from '@store/api/leaguesApi';
import TopBar from '@components/navigation/TopBar';
import { EmptyState, NetworkError } from '@components/common';

export default function SeriesScreen() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [activeSport, setActiveSport] = useState('cricket');

    // Fetch leagues for the active sport
    const { data: leagues = [], isLoading, error, refetch } = useGetLeaguesQuery({
        sport: activeSport
    });

    const SPORT_TABS = [
        { id: 'cricket', label: 'Cricket', icon: 'baseball-outline' },
        { id: 'football', label: 'Football', icon: 'football-outline' },
        { id: 'basketball', label: 'Basketball', icon: 'basketball-outline' },
    ];

    const renderLeagueCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.leagueCard}
            onPress={() => {
                // TODO: Navigate to league details
                console.log('Navigate to league:', item.id);
            }}
        >
            <View style={styles.leagueCardHeader}>
                {item.logo && (
                    <View style={styles.leagueLogoContainer}>
                        <Text style={styles.leagueLogoPlaceholder}>🏆</Text>
                    </View>
                )}
                <View style={styles.leagueInfo}>
                    <Text style={styles.leagueName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <View style={styles.leagueMetadata}>
                        {item.country?.name && (
                            <Text style={styles.countryName} numberOfLines={1}>
                                📍 {item.country.name}
                            </Text>
                        )}
                        {item.season && (
                            <Text style={styles.season}>
                                {item.season}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
            <View style={styles.leagueCardFooter}>
                <Text style={styles.viewDetailsText}>View Details →</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuBtn}>
                        <Ionicons name="menu" size={28} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Series & Tournaments</Text>
                </View>
            </View>

            {/* Sport Tabs */}
            <TopBar
                activeTab={activeSport}
                onTabChange={setActiveSport}
                tabs={SPORT_TABS}
            />

            {/* Content */}
            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Loading leagues...</Text>
                    </View>
                ) : error ? (
                    <NetworkError onRetry={refetch} />
                ) : leagues.length === 0 ? (
                    <EmptyState
                        variant="noMatches"
                        message={`No leagues found for ${activeSport}`}
                    />
                ) : (
                    <FlatList
                        data={leagues}
                        renderItem={renderLeagueCard}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
