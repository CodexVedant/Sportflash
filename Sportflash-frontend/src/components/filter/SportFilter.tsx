import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/SportFilter.styles';

interface SportFilterProps {
    selected: string;
    onSelect: (sportId: string) => void;
}

export default function SportFilter({ selected, onSelect }: SportFilterProps) {
    const sports = [
        { id: 'all', name: 'All Sports', icon: 'globe-outline' as const },
        { id: 'cricket', name: 'Cricket', icon: 'baseball-outline' as const },
        { id: 'football', name: 'Football', icon: 'football-outline' as const },
        { id: 'basketball', name: 'Basketball', icon: 'basketball-outline' as const },
    ];

    return (
        <View style={styles.container}>
            {sports.map(sport => (
                <TouchableOpacity
                    key={sport.id}
                    style={[
                        styles.sportCard,
                        selected === sport.id && styles.sportCardActive
                    ]}
                    onPress={() => onSelect(sport.id)}
                >
                    <View style={[
                        styles.iconContainer,
                        selected === sport.id && styles.iconContainerActive
                    ]}>
                        <Ionicons
                            name={sport.icon}
                            size={28}
                            color={selected === sport.id ? '#fff' : theme.colors.textMuted}
                        />
                    </View>
                    <Text style={[
                        styles.sportName,
                        selected === sport.id && styles.sportNameActive
                    ]}>
                        {sport.name}
                    </Text>
                    {selected === sport.id && (
                        <View style={styles.checkmark}>
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}
