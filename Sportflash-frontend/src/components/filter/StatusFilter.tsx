import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/StatusFilter.styles';

interface StatusFilterProps {
    selected: string;
    onSelect: (statusId: string) => void;
}

export default function StatusFilter({ selected, onSelect }: StatusFilterProps) {
    const statuses = [
        {
            id: 'all',
            name: 'All Matches',
            icon: 'list-outline' as const,
            color: '#64748B',
            description: 'Show all matches'
        },
        {
            id: 'live',
            name: 'Live',
            icon: 'radio-outline' as const,
            color: '#EF4444',
            description: 'Currently playing'
        },
        {
            id: 'upcoming',
            name: 'Upcoming',
            icon: 'time-outline' as const,
            color: '#3B82F6',
            description: 'Scheduled matches'
        },
        {
            id: 'finished',
            name: 'Finished',
            icon: 'checkmark-circle-outline' as const,
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
