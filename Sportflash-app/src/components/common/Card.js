import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../../utils/theme';

export default function Card({ children, style, variant = 'glass' }) {

    if (variant === 'glass' && Platform.OS === 'ios') {
        return (
            <View style={[styles.container, style]}>
                <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                <View style={styles.content}>
                    {children}
                </View>
            </View>
        );
    }

    // Android fallback or solid variant (BlurView on Android can be expensive)
    return (
        <View style={[styles.container, styles.solid, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        position: 'relative',
        marginBottom: theme.spacing.md,
    },
    solid: {
        backgroundColor: theme.colors.surface,
    },
    content: {
        padding: theme.spacing.md,
    }
});
