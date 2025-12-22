import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export default function TrendingNewsWidget() {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>TRENDING NEWS</Text>
            <View style={styles.newsPlaceholder}>
                <Text style={{ color: theme.colors.textMuted }}>News feed coming in Phase 1B...</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.sm,
        fontWeight: '600',
        marginBottom: theme.spacing.md,
        letterSpacing: 1,
    },
    newsPlaceholder: {
        height: 150,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
});
