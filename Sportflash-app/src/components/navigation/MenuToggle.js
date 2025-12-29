import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/MenuToggle.styles';

export default function MenuToggle({ onPress, color = theme.colors.text, style }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.menuBtn, style]}>
            <Ionicons name="menu" size={28} color={color} />
        </TouchableOpacity>
    );
}
