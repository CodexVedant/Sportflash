import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';

export default function NotificationBell({ count = 0, onPress }) {
    const [scaleAnim] = useState(new Animated.Value(1));

    const handlePress = () => {
        // Animate bell
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        onPress && onPress();
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                    name={count > 0 ? "notifications" : "notifications-outline"}
                    size={24}
                    color={theme.colors.text}
                />
                {count > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {count > 99 ? '99+' : count}
                        </Text>
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        padding: 8,
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    badgeText: {
        fontSize: 10,
        fontFamily: theme.fonts?.bold || 'System',
        color: '#fff',
    },
});
