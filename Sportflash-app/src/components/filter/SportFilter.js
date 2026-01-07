import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/SportFilter.styles';

export default function SportFilter({ selected, onSelect }) {
    const sports = [
        { id: 'all', name: 'All Sports', icon: 'globe-outline' },
        { id: 'cricket', name: 'Cricket', icon: 'baseball-outline' },
        { id: 'football', name: 'Football', icon: 'football-outline' },
        { id: 'basketball', name: 'Basketball', icon: 'basketball-outline' },
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
