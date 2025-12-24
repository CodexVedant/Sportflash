import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useGetTeamDetailsQuery } from '@store/api/teamsApi';

export default function TeamProfileScreen({ navigation, route }) {
    const { teamId, teamName, sport = 'football' } = route.params || {};
    const [activeTab, setActiveTab] = useState('Overview');

    // Fetch Team Details (Note: We might need to ensure this query exists in teamsApi or add it)
    // Assuming a hook exists or using a placeholder for now until we verify api/teamsApi.js
    // const { data: teamData, isLoading } = useGetTeamDetailsQuery(teamId, { skip: !teamId });

    // Mock Data for UI Structure (Replace with real API data later)
    const teamData = {
        name: teamName || 'Team Name',
        logo: 'https://via.placeholder.com/100', // Should be passed on param ideally
        founded: '1878',
        stadium: 'Old Trafford',
        country: 'England'
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Team Info</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Country</Text>
                                <Text style={styles.value}>{teamData.country}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Founded</Text>
                                <Text style={styles.value}>{teamData.founded}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Stadium</Text>
                                <Text style={styles.value}>{teamData.stadium}</Text>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Recent Form</Text>
                            <View style={styles.formRow}>
                                {['W', 'W', 'D', 'L', 'W'].map((res, idx) => (
                                    <View key={idx} style={[styles.formBadge,
                                    { backgroundColor: res === 'W' ? theme.colors.success : res === 'D' ? theme.colors.warning : theme.colors.danger }
                                    ]}>
                                        <Text style={styles.formText}>{res}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                );
            case 'Squad':
                return (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Squad List Coming Soon</Text>
                    </View>
                );
            case 'Fixtures':
                return (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Fixtures Coming Soon</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{teamData.name}</Text>
                <TouchableOpacity>
                    <Ionicons name="star-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            {/* Team Hero */}
            <View style={styles.hero}>
                <View style={styles.logoContainer}>
                    {/* Fallback to icon if no logo URL (handling the mock logic) */}
                    <Ionicons name="shield-half" size={40} color={theme.colors.primary} />
                </View>
                <Text style={styles.teamNameHero}>{teamData.name}</Text>
                <Text style={styles.countryText}>{teamData.country}</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
                {['Overview', 'Squad', 'Fixtures', 'Transfers'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tabItem,
                            activeTab === tab && styles.activeTabItem
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.content}>
                {renderTabContent()}
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    hero: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    teamNameHero: {
        color: theme.colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    countryText: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    tabItem: {
        marginRight: theme.spacing.xl,
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabItem: {
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    activeTabText: {
        color: theme.colors.primary,
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    cardTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
        marginBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        paddingBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        color: theme.colors.textMuted,
    },
    value: {
        color: theme.colors.text,
        fontWeight: '500',
    },
    formRow: {
        flexDirection: 'row',
        gap: 8,
    },
    formBadge: {
        width: 30,
        height: 30,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    placeholderContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    placeholderText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
    },
    tabContent: {
        // padding handled by scrollview content container
    }
});
