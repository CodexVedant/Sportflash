import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

interface BadgeProps {
    label: string;
    color?: string;
}

const Badge: React.FC<BadgeProps> = ({ label, color = theme.colors.primary }) => {
    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <Text style={styles.text}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    text: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default Badge;
