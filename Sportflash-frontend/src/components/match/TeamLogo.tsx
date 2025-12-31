import React from 'react';
import { View, Text, Image, StyleProp, ViewStyle, ImageStyle } from 'react-native';
import { styles } from '@utils/style/TeamLogo.styles';

interface TeamLogoProps {
    logo?: string;
    name?: string;
    size?: number;
    fontSize?: number;
    containerSize?: number;
    style?: StyleProp<ViewStyle>;
}

export default function TeamLogo({
    logo,
    name,
    size = 32,
    fontSize = 24,
    containerSize = 50,
    style
}: TeamLogoProps) {
    const isUrl = logo && (logo.startsWith('http') || logo.startsWith('file'));

    return (
        <View style={[styles.logoPlaceholder, { width: containerSize, height: containerSize, borderRadius: containerSize / 2 }, style]}>
            {isUrl ? (
                <Image source={{ uri: logo }} style={{ width: size, height: size, resizeMode: 'contain' } as ImageStyle} />
            ) : (
                <Text style={{ fontSize: fontSize, color: '#FFF', fontWeight: 'bold', fontFamily: 'System' }}>
                    {name ? name.charAt(0).toUpperCase() : '?'}
                </Text>
            )}
        </View>
    );
}
