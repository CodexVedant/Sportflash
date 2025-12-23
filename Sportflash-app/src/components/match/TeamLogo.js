import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TeamLogo({ logo, name, size = 32, fontSize = 24, containerSize = 50, style }) {
    const isUrl = logo && (logo.startsWith('http') || logo.startsWith('file'));

    return (
        <View style={[styles.logoPlaceholder, { width: containerSize, height: containerSize, borderRadius: containerSize / 2 }, style]}>
            {isUrl ? (
                <Image source={{ uri: logo }} style={{ width: size, height: size, resizeMode: 'contain' }} />
            ) : (
                <Text style={{ fontSize: fontSize, color: '#FFF', fontWeight: 'bold', fontFamily: 'System' }}>
                    {name ? name.charAt(0).toUpperCase() : '?'}
                </Text>
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
