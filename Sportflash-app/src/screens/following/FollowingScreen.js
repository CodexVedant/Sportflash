import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import Sidebar from '@components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import { styles as defaultStyles } from '@utils/style/FollowingScreen.styles';

import MatchesTab from './MatchesTab';
import TeamsTab from './TeamsTab';
import PlayersTab from './PlayersTab';

export default function FollowingScreen() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('matches'); // matches, teams, players

    const renderTabContent = () => {
        switch (activeTab) {
            case 'matches': return <MatchesTab />;
            case 'teams': return <TeamsTab />;
            case 'players': return <PlayersTab />;
            default: return <MatchesTab />;
        }
    };

    return (
        <SafeAreaView style={defaultStyles.container}>
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

            {/* Header */}
            <View style={defaultStyles.header}>
                <View style={defaultStyles.headerRow}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={defaultStyles.menuBtn}>
                        <Ionicons name="menu" size={28} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={defaultStyles.headerTitle}>Following</Text>
                </View>
            </View>

            {/* Custom Tab Bar */}
            <View style={styles.tabContainer}>
                {['matches', 'teams', 'players'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <View style={[defaultStyles.content, { padding: 0 }]}>
                {renderTabContent()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.background,
    },
    tabButton: {
        marginRight: 20,
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabButton: {
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
    activeTabText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    }
});
