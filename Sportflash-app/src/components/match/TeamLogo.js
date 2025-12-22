import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function TeamLogo({ logo, size = 32, fontSize = 24, containerSize = 50, style }) {
    const isUrl = logo?.startsWith('http') || logo?.startsWith('file');

    return (
        <View style={[styles.logoPlaceholder, { width: containerSize, height: containerSize, borderRadius: containerSize / 2 }, style]}>
            {isUrl ? (
                <Image source={{ uri: logo }} style={{ width: size, height: size, resizeMode: 'contain' }} />
            ) : (
                <Text style={{ fontSize: fontSize }}>{logo}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    logoPlaceholder: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
