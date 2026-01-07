import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@utils/style/Button.styles';

export default function Button({
    title,
    onPress,
    variant = 'primary', // primary, outline, text
    size = 'md', // sm, md, lg
    icon,
    loading = false,
    style,
    textStyle
}) {

    const getBackgroundColor = () => {
        if (variant === 'primary') return theme.colors.primary;
        if (variant === 'outline') return 'transparent';
        return 'transparent';
    };

    const getBorderColor = () => {
        if (variant === 'outline') return theme.colors.border;
        return 'transparent';
    };

    const getTextColor = () => {
        if (variant === 'primary') return '#FFF';
        if (variant === 'outline') return theme.colors.text;
        return theme.colors.primary;
    };

    const getPadding = () => {
        if (size === 'sm') return { paddingVertical: 8, paddingHorizontal: 16 };
        if (size === 'lg') return { paddingVertical: 16, paddingHorizontal: 32 };
        return { paddingVertical: 12, paddingHorizontal: 24 }; // md default
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderWidth: variant === 'outline' ? 1 : 0,
                    ...getPadding()
                },
                style
            ]}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <View style={styles.content}>
                    {icon && <Ionicons name={icon} size={18} color={getTextColor()} style={{ marginRight: 8 }} />}
                    <Text style={[
                        styles.text,
                        {
                            color: getTextColor(),
                            fontSize: size === 'lg' ? 18 : 16
                        },
                        textStyle
                    ]}>
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
