import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/BackButton.styles';

interface BackButtonProps {
    color?: string;
    size?: number;
    style?: StyleProp<ViewStyle>;
    fallbackRoute?: string;
    fallbackParams?: object;
    onPress?: () => void;
    onFallback?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({
    color = theme.colors.text,
    size = 24,
    style,
    fallbackRoute = 'Home',
    fallbackParams = {},
    onPress,
    onFallback
}) => {
    const navigation = useNavigation<any>();

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
export default BackButton;
