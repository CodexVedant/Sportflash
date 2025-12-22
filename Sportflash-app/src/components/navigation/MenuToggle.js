import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';

export default function MenuToggle({ onPress, color = theme.colors.text, style }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.menuBtn, style]}>
            <Ionicons name="menu" size={28} color={color} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    menuBtn: {
        zIndex: 20,
    },
});
