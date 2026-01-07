import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/NotificationBell.styles';

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
