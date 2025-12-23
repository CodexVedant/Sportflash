import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { theme } from '@utils/theme';

export default function LiveBadge({ sport, status, style }) {
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1000 }),
                withTiming(0.5, { duration: 1000 })
            ),
            -1, true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    // Format status text: If it's just a number (minute), append "'"
    const getDisplayText = () => {
        if (status) {
            // If status is a number (like "41"), add quote for minutes
            if (!isNaN(status) && String(status).trim() !== '') {
                return `LIVE • ${status}'`;
            }
            return status.toUpperCase();
        }
        return sport ? `LIVE ${sport.toUpperCase()}` : 'LIVE';
    };

    return (
        <View style={[styles.badgeContainer, style]}>
            <Animated.View style={[styles.dot, { backgroundColor: theme.colors.danger }, animatedStyle]} />
            <Text style={[styles.statusText, { color: theme.colors.danger }]}>
                {getDisplayText()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: theme.sizes.xs,
        fontWeight: 'bold',
    },
});
