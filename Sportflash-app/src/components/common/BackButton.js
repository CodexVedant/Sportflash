import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@utils/theme';

const BackButton = ({
    color = theme.colors.text,
    size = 24,
    style,
    fallbackRoute = 'Home',
    fallbackParams = {},
    onPress,
    onFallback
}) => {
    const navigation = useNavigation();

    const handlePress = () => {
        if (onPress) {
            onPress();
            return;
        }

        if (navigation.canGoBack()) {
            navigation.goBack();
        } else if (onFallback) {
            onFallback();
        } else {
            // Safe fallback
            navigation.navigate(fallbackRoute, fallbackParams);
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} style={[styles.container, style]}>
            <Ionicons name="arrow-back" size={size} color={color} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 4, // Hit slop area
    }
});

export default BackButton;
