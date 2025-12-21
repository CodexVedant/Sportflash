import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';

export default function SportFilter({ selected, onSelect }) {
    const sports = [
        { id: 'all', name: 'All Sports', icon: 'globe-outline' },
        { id: 'cricket', name: 'Cricket', icon: 'baseball-outline' },
        { id: 'football', name: 'Football', icon: 'football-outline' },
        { id: 'basketball', name: 'Basketball', icon: 'basketball-outline' },
        { id: 'tennis', name: 'Tennis', icon: 'tennisball-outline' },
        { id: 'hockey', name: 'Hockey', icon: 'ice-cream-outline' },
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

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    sportCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    sportCardActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: theme.colors.primary,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconContainerActive: {
        backgroundColor: theme.colors.primary,
    },
    sportName: {
        flex: 1,
        fontSize: 16,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.text,
    },
    sportNameActive: {
        color: theme.colors.primary,
        fontFamily: theme.fonts?.bold || 'System',
    },
    checkmark: {
        marginLeft: 8,
    },
});
