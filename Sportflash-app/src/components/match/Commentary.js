import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export default function Commentary({ commentary }) {
    if (!commentary || commentary.length === 0) {
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: theme.colors.textMuted }}>Waiting for live updates...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {commentary.map((item, i) => (
                <View key={i} style={styles.commBubble}>
                    <View style={styles.overBadge}>
                        <Text style={styles.overText}>{item.time || 'Live'}</Text>
                    </View>
                    <Text style={styles.commText}>{item.text}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 40,
    },
    commBubble: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        gap: 12,
    },
    overBadge: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        height: 24,
    },
    overText: {
        color: theme.colors.text,
        fontSize: 12,
        fontWeight: 'bold',
    },
    commText: {
        color: theme.colors.textMuted,
        flex: 1,
        lineHeight: 20,
    }
});
