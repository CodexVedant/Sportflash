import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import Sidebar from '@components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@utils/style/FollowingScreen.styles';

export default function FollowingScreen() {
    const [sidebarVisible, setSidebarVisible] = useState(false);

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
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Track your favorite teams and matches.</Text>
            </View>
        </SafeAreaView>
    );
}
