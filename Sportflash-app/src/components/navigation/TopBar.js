import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TopBar({ activeTab, onTabChange, tabs }) {
    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                    onPress={() => onTabChange(tab.id)}
                >
                    <Ionicons
                        name={tab.icon}
                        size={20}
                        color={activeTab === tab.id ? theme.colors.primary : theme.colors.textMuted}
                        style={styles.icon}
                    />
                    <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: theme.borderRadius.lg,
        padding: 4,
        marginHorizontal: theme.spacing.lg,
        marginVertical: theme.spacing.md,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: theme.borderRadius.md,
        gap: 6,
    },
    activeTab: {
        backgroundColor: theme.colors.primary,
    },
    icon: {
        marginRight: 4,
    },
    tabText: {
        fontSize: 14,
        fontFamily: theme.fonts.medium,
        color: theme.colors.textMuted,
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '600',
    },
});
