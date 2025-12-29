import React from 'react';
import { View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/Card.styles';

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
