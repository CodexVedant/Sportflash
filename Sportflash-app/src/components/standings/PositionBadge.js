import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export default function PositionBadge({ position, size = 'normal' }) {
    const getPositionStyle = () => {
        if (position <= 4) {
            // Champions League / Top positions
            return {
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: '#10B981',
                textColor: '#10B981',
            };
        } else if (position <= 6) {
            // Europa League / Mid-top positions
            return {
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3B82F6',
                textColor: '#3B82F6',
            };
        } else if (position >= 18) {
            // Relegation zone
            return {
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: '#EF4444',
                textColor: '#EF4444',
            };
        } else {
            // Mid-table
            return {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                textColor: theme.colors.text,
            };
        }
    };

    const positionStyle = getPositionStyle();
    const isSmall = size === 'small';

    return (
        <View
            style={[
                styles.badge,
                {
                    backgroundColor: positionStyle.backgroundColor,
                    borderColor: positionStyle.borderColor,
                    width: isSmall ? 20 : 28,
                    height: isSmall ? 20 : 28,
                }
            ]}
        >
            <Text
                style={[
                    styles.badgeText,
                    {
                        color: positionStyle.textColor,
                        fontSize: isSmall ? 10 : 13,
                    }
                ]}
            >
                {position}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        borderRadius: 6,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        fontFamily: theme.fonts?.bold || 'System',
    },
});
