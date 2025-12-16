import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';

export default function StatusFilter({ selected, onSelect }) {
    const statuses = [
        {
            id: 'all',
            name: 'All Matches',
            icon: 'list-outline',
            color: '#64748B',
            description: 'Show all matches'
        },
        {
            id: 'live',
            name: 'Live',
            icon: 'radio-outline',
            color: '#EF4444',
            description: 'Currently playing'
        },
        {
            id: 'upcoming',
            name: 'Upcoming',
            icon: 'time-outline',
            color: '#3B82F6',
            description: 'Scheduled matches'
        },
        {
            id: 'finished',
            name: 'Finished',
            icon: 'checkmark-circle-outline',
            color: '#10B981',
            description: 'Completed matches'
        },
    ];

    return (
        <View style={styles.container}>
            {statuses.map(status => (
                <TouchableOpacity
                    key={status.id}
                    style={[
                        styles.statusCard,
                        selected === status.id && styles.statusCardActive
                    ]}
                    onPress={() => onSelect(status.id)}
                >
                    <View style={[
                        styles.iconContainer,
                        { backgroundColor: `${status.color}20` },
                        selected === status.id && { backgroundColor: status.color }
                    ]}>
                        <Ionicons
                            name={status.icon}
                            size={24}
                            color={selected === status.id ? '#fff' : status.color}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[
                            styles.statusName,
                            selected === status.id && styles.statusNameActive
                        ]}>
                            {status.name}
                        </Text>
                        <Text style={styles.statusDescription}>{status.description}</Text>
                    </View>
                    {selected === status.id && (
                        <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    statusCardActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: theme.colors.primary,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    statusName: {
        fontSize: 16,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.text,
        marginBottom: 2,
    },
    statusNameActive: {
        color: theme.colors.primary,
        fontFamily: theme.fonts?.bold || 'System',
    },
    statusDescription: {
        fontSize: 13,
        fontFamily: theme.fonts?.regular || 'System',
        color: theme.colors.textMuted,
    },
});
