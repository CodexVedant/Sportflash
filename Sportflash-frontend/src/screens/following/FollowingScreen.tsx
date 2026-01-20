import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import Sidebar from '@components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import MatchesTab from './MatchesTab';
import TeamsTab from './TeamsTab';
import PlayersTab from './PlayersTab';
import { useAppDispatch } from '@hooks/redux';
import { loadUser } from '@store/slices/authSlice';

export default function FollowingScreen() {
    const dispatch = useAppDispatch();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('Matches');

    // Reload user profile when app comes to foreground
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                console.log('📱 Following screen: Refreshing user profile...');
                dispatch(loadUser());
            }
        });

        return () => {
            subscription.remove();
        };
    }, [dispatch]);

    return (
        <SafeAreaView style={styles.container}>
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuBtn}>
                        <Ionicons name="menu" size={28} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Following</Text>
                </View>

                <View style={styles.tabBar}>
                    {['Matches', 'Teams', 'Players'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.content}>
                {activeTab === 'Matches' && <MatchesTab />}
                {activeTab === 'Teams' && <TeamsTab />}
                {activeTab === 'Players' && <PlayersTab />}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 16, backgroundColor: theme.colors.background, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    menuBtn: { marginRight: 16 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
    tabBar: { flexDirection: 'row', gap: 12 },
    tabItem: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: theme.colors.surface },
    activeTabItem: { backgroundColor: theme.colors.primary },
    tabText: { color: theme.colors.textMuted, fontWeight: '600' },
    activeTabText: { color: '#FFF' },
    content: { flex: 1 },
    subtitle: { color: theme.colors.textMuted, fontSize: 14, marginTop: 4 },
});
