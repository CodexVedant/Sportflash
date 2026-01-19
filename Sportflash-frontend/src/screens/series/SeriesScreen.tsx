import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { theme } from '@utils/theme';
import Sidebar from '@components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@utils/style/SeriesScreen.styles';
import { useGetLeaguesQuery } from '@store/api/leaguesApi';
import TopBar from '@components/navigation/TopBar';
import { EmptyState, NetworkError, Input } from '@components/common';
import { useAppSelector } from '@hooks/redux';

export default function SeriesScreen() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [activeSport, setActiveSport] = useState('cricket');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [showFavorites, setShowFavorites] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user } = useAppSelector(state => state.auth);

    // Fetch leagues for the active sport
    const { data: leagues = [], isLoading, error, refetch, isFetching } = useGetLeaguesQuery({
        sport: activeSport
    });

    const onRefresh = React.useCallback(() => {
        refetch();
    }, [refetch]);

    // Unique countries for filter
    const countries = useMemo(() => {
        const unique = new Set<string>();
        leagues.forEach((l: any) => {
            if (l.country?.name) unique.add(l.country.name);
        });
        return Array.from(unique).sort();
    }, [leagues]);

    // Filter leagues
    const filteredLeagues = useMemo(() => {
        return leagues.filter((league: any) => {
            const matchesSearch = league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                league.country?.name?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCountry = selectedCountry ? league.country?.name === selectedCountry : true;
            const matchesFavorites = showFavorites ? user?.preferences?.favoriteLeagues?.some(fl => fl.id === league.id) : true;
            return matchesSearch && matchesCountry && matchesFavorites;
        });
    }, [leagues, searchQuery, selectedCountry, showFavorites, user]);

    const SPORT_TABS = [
        { id: 'cricket', label: 'Cricket', icon: 'baseball-outline' },
        { id: 'football', label: 'Football', icon: 'football-outline' },
        { id: 'basketball', label: 'Basketball', icon: 'basketball-outline' },
    ];

    const renderLeagueCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.leagueCard}
            onPress={() => {
                navigation.navigate('LeagueDetail', {
                    league: {
                        id: item.id,
                        name: item.name,
                        sport: activeSport,
                        country: item.country,
                        logo: item.logo,
                        season: item.season
                    }
                });
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
                onTabChange={(sport) => {
                    setActiveSport(sport);
                    setSearchQuery('');
                    setSelectedCountry(null);
                }}
                tabs={SPORT_TABS}
            />

            {/* Filters */}
            <View style={styles.filterContainer}>
                <Input
                    placeholder="Search leagues or countries..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    icon="search"
                />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.countryList}
                    contentContainerStyle={styles.countryListContent}
                >
                    <TouchableOpacity
                        style={[styles.countryChip, showFavorites && styles.countryChipActive]}
                        onPress={() => setShowFavorites(!showFavorites)}
                    >
                        <Text style={[styles.countryChipText, showFavorites && styles.countryChipTextActive]}>❤️ Favorites</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.countryChip, !selectedCountry && !showFavorites && styles.countryChipActive]}
                        onPress={() => {
                            setSelectedCountry(null);
                            setShowFavorites(false);
                        }}
                    >
                        <Text style={[styles.countryChipText, !selectedCountry && !showFavorites && styles.countryChipTextActive]}>All</Text>
                    </TouchableOpacity>
                    {countries.map(country => (
                        <TouchableOpacity
                            key={country}
                            style={[styles.countryChip, selectedCountry === country && styles.countryChipActive]}
                            onPress={() => setSelectedCountry(country === selectedCountry ? null : country)}
                        >
                            <Text style={[styles.countryChipText, selectedCountry === country && styles.countryChipTextActive]}>
                                {country}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Loading leagues...</Text>
                    </View>
                ) : error ? (
                    <NetworkError onRetry={refetch} />
                ) : filteredLeagues.length === 0 ? (
                    <EmptyState
                        variant="noMatches"
                        message={`No leagues found for ${searchQuery || activeSport}`}
                    />
                ) : (
                    <FlatList
                        data={filteredLeagues}
                        renderItem={renderLeagueCard}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                        }
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
