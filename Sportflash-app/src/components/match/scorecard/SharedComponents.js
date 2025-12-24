import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@utils/theme';

export const Section = ({ title, children, style = {} }) => (
    <View style={[styles.section, style]}>
        {title && <Text style={styles.sectionTitle}>{title}</Text>}
        {children}
    </View>
);

export const EmptyData = ({ message }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{message || 'No data available'}</Text>
    </View>
);

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// ... (code above)

export const PlayerRow = ({ name, number, position, isCaptain, isGoalkeeper, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={styles.playerRow}>
            <View style={styles.playerInfo}>
                {number && <Text style={styles.playerNumber}>{number}</Text>}
                <Text style={[styles.playerName, onPress && { color: theme.colors.primary }]}>{name}</Text>
                {isCaptain && <Text style={styles.captainBadge}> (C)</Text>}
                {isGoalkeeper && <Text style={styles.captainBadge}> (GK)</Text>}
            </View>
            {position && <Text style={styles.playerPosition}>{position}</Text>}
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: theme.spacing.sm,
        letterSpacing: 1,
    },
    emptyContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    playerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerNumber: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        width: 25,
    },
    playerName: {
        color: theme.colors.text,
        fontSize: 14,
    },
    captainBadge: {
        color: theme.colors.secondary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    playerPosition: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
});
