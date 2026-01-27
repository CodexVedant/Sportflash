import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return theme.colors.success;
            case 'error': return theme.colors.danger;
            default: return theme.colors.secondary;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    text: {
        color: '#fff',
        fontSize: 14,
    },
});

export default Toast;
