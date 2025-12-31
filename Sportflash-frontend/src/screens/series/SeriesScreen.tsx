import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import Sidebar from '@components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@utils/style/SeriesScreen.styles';

export default function SeriesScreen() {
    const [sidebarVisible, setSidebarVisible] = useState(false);

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

            <View style={styles.content}>
                <Text style={styles.subtitle}>Coming soon in Phase 2</Text>
            </View>
        </SafeAreaView>
    );
}
