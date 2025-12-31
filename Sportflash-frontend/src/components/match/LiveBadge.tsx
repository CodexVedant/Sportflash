import React, { useEffect } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/LiveBadge.styles';

interface LiveBadgeProps {
    sport?: string;
    status?: string | number;
    style?: StyleProp<ViewStyle>;
}

export default function LiveBadge({ sport, status, style }: LiveBadgeProps) {
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
            if (typeof status === 'number' || (!isNaN(Number(status)) && String(status).trim() !== '')) {
                return `LIVE • ${status}'`;
            }
            return String(status).toUpperCase();
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
