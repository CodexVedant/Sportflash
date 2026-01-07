import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useGetTeamQuery } from '@store/api/teamsApi';
import { styles } from '@utils/style/TeamProfileScreen.styles';

export default function TeamProfileScreen({ navigation, route }) {
    const { teamId, teamName, sport = 'football' } = route.params || {};
    const [activeTab, setActiveTab] = useState('Overview');

    // Fetch Team Details from API
    const { data: teamData, isLoading, error } = useGetTeamQuery({ id: teamId, sport });

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
                                <Text style={styles.value}>{teamData.venue?.name || 'N/A'}</Text>
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

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error || !teamData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <Text style={{ color: theme.colors.textMuted }}>Failed to load team details.</Text>
            </View>
        );
    }

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
                    {teamData.logo ? (
                        <Image source={{ uri: teamData.logo }} style={{ width: 60, height: 60, resizeMode: 'contain' }} />
                    ) : (
                        <Ionicons name="shield-half" size={40} color={theme.colors.primary} />
                    )}
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
