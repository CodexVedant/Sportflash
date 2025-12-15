import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme } from '../../utils/theme';
import Sidebar from '../../components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';

export default function BookmarksScreen() {
    const [sidebarVisible, setSidebarVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuBtn}>
                        <Ionicons name="menu" size={28} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Bookmarks</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Saved news and highlights will appear here.</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuBtn: {
        marginRight: 16,
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: 20,
        fontFamily: theme.fonts.bold,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitle: {
        color: theme.colors.textMuted,
        fontSize: 16,
        fontFamily: theme.fonts.medium,
    }
});
