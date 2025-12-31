import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '@components/navigation/Sidebar';
import { StandingsTable } from '@components/standings';
import { NotificationBell, NotificationPanel } from '@components/notifications';
import { EmptyState } from '@components/common';
import { styles } from '@utils/style/StandingsScreen.styles';
import { useAppSelector } from '@hooks/redux';

// Define types for the mock data structure
interface TeamStanding {
    id: number;
    position: number;
    name: string;
    logo: string;
    played: number;
    won: number;
    lost: number;
    drawn?: number;
    nrr?: number;
    for?: string;
    against?: string;
    points?: number;
    gf?: number;
    ga?: number;
    gd?: number;
    winPct?: number;
    ppg?: number;
    streak?: string;
}

interface LeagueStandings {
    league: string;
    teams: TeamStanding[];
}

interface MockStandingsData {
    [key: string]: LeagueStandings;
}

export default function StandingsScreen() {
    const { user } = useAppSelector(state => state.auth);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [selectedSport, setSelectedSport] = useState('cricket');
    const [loading, setLoading] = useState(false);

    // Mock notifications
    const [notifications] = useState([
        {
            id: 1,
            type: 'team_update',
            title: 'Team Update',
            message: 'Mumbai Indians moved to 2nd position',
            timestamp: new Date(),
            read: false,
        },
    ]);

    // Mock standings data
    const standingsData: MockStandingsData = {
        cricket: {
            league: 'IPL 2024',
            teams: [
                {
                    id: 1,
                    position: 1,
                    name: 'Mumbai Indians',
                    logo: 'https://scores.cricketdata.org/teams/mumbai-indians.png',
                    played: 14,
                    won: 10,
                    lost: 4,
                    nrr: 1.25,
                    for: '2450/135',
                    against: '2200/140',
                    points: 20,
                },
                {
                    id: 2,
                    position: 2,
                    name: 'Chennai Super Kings',
                    logo: 'https://scores.cricketdata.org/teams/csk.png',
                    played: 14,
                    won: 9,
                    lost: 5,
                    nrr: 0.85,
                    for: '2380/138',
                    against: '2250/142',
                    points: 18,
                },
                {
                    id: 3,
                    position: 3,
                    name: 'Royal Challengers',
                    logo: 'https://scores.cricketdata.org/teams/rcb.png',
                    played: 14,
                    won: 8,
                    lost: 6,
                    nrr: 0.45,
                    for: '2500/145',
                    against: '2400/140',
                    points: 16,
                },
                {
                    id: 4,
                    position: 4,
                    name: 'Delhi Capitals',
                    logo: 'https://scores.cricketdata.org/teams/delhi-capitals.png',
                    played: 14,
                    won: 7,
                    lost: 7,
                    nrr: -0.15,
                    for: '2200/142',
                    against: '2250/138',
                    points: 14,
                },
            ],
        },
        football: {
            league: 'Premier League',
            teams: [
                {
                    id: 101,
                    position: 1,
                    name: 'Manchester City',
                    logo: 'https://media.api-sports.io/football/teams/50.png',
                    played: 20,
                    won: 15,
                    drawn: 3,
                    lost: 2,
                    gf: 52,
                    ga: 27,
                    gd: 25,
                    points: 48,
                },
                {
                    id: 102,
                    position: 2,
                    name: 'Arsenal',
                    logo: 'https://media.api-sports.io/football/teams/42.png',
                    played: 20,
                    won: 14,
                    drawn: 4,
                    lost: 2,
                    gf: 48,
                    ga: 26,
                    gd: 22,
                    points: 46,
                },
                {
                    id: 103,
                    position: 3,
                    name: 'Liverpool',
                    logo: 'https://media.api-sports.io/football/teams/40.png',
                    played: 20,
                    won: 13,
                    drawn: 5,
                    lost: 2,
                    gf: 45,
                    ga: 25,
                    gd: 20,
                    points: 44,
                },
            ],
        },
        basketball: {
            league: 'NBA Western Conference',
            teams: [
                {
                    id: 201,
                    position: 1,
                    name: 'LA Lakers',
                    logo: 'https://media.api-sports.io/basketball/teams/145.png',
                    played: 50,
                    won: 35,
                    lost: 15,
                    winPct: 0.700,
                    ppg: 115.5,
                    streak: 'W5',
                },
                {
                    id: 202,
                    position: 2,
                    name: 'Golden State Warriors',
                    logo: 'https://media.api-sports.io/basketball/teams/141.png',
                    played: 50,
                    won: 33,
                    lost: 17,
                    winPct: 0.660,
                    ppg: 118.2,
                    streak: 'W3',
                },
                {
                    id: 203,
                    position: 3,
                    name: 'Phoenix Suns',
                    logo: 'https://media.api-sports.io/basketball/teams/154.png',
                    played: 50,
                    won: 30,
                    lost: 20,
                    winPct: 0.600,
                    ppg: 112.8,
                    streak: 'L2',
                },
            ],
        },
    };

    const sports = [
        { id: 'cricket', name: 'Cricket', icon: 'baseball-outline' as const },
        { id: 'football', name: 'Football', icon: 'football-outline' as const },
        { id: 'basketball', name: 'Basketball', icon: 'basketball-outline' as const },
    ];

    const currentStandings = standingsData[selectedSport];
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <SafeAreaView style={styles.container}>
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuBtn}>
                        <Ionicons name="menu" size={28} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Standings</Text>
                </View>
                {user && (
                    <NotificationBell
                        count={unreadCount}
                        onPress={() => setNotificationVisible(true)}
                    />
                )}
            </View>

            {/* Sport Selector */}
            <View style={styles.sportSelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                    {sports.map(sport => (
                        <TouchableOpacity
                            key={sport.id}
                            style={[
                                styles.sportChip,
                                selectedSport === sport.id && styles.sportChipActive
                            ]}
                            onPress={() => setSelectedSport(sport.id)}
                        >
                            <Ionicons
                                name={sport.icon}
                                size={18}
                                color={selectedSport === sport.id ? '#fff' : theme.colors.textMuted}
                            />
                            <Text style={[
                                styles.sportChipText,
                                selectedSport === sport.id && styles.sportChipTextActive
                            ]}>
                                {sport.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Standings Table - Wrapped in View instead of ScrollView to allow internal scrolling/sticky headers */}
            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : currentStandings ? (
                    <StandingsTable
                        teams={currentStandings.teams}
                        sport={selectedSport}
                        league={currentStandings.league}
                        followedTeams={user?.preferences?.favoriteTeams || []}
                        onTeamPress={(team: any) => {
                            console.log('Team pressed:', team);
                        }}
                    />
                ) : (
                    <EmptyState
                        icon="trophy-outline"
                        title="No Standings Available"
                        subtitle="Standings for this sport will be available soon"
                    />
                )}
            </View>

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
