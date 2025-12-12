import React, { createContext, useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type, id: Date.now() });

        // Auto hide after 3 seconds
        setTimeout(() => {
            setToast(current => current && current.message === message ? null : current);
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Animated.View
                    key={toast.id}
                    entering={FadeInUp.springify()}
                    exiting={FadeOutUp}
                    style={styles.toastContainer}
                >
                    <BlurView intensity={20} tint="dark" style={styles.blur}>
                        <Ionicons
                            name={toast.type === 'error' ? 'alert-circle' : 'information-circle'}
                            size={24}
                            color={theme.colors.primary}
                        />
                        <Text style={styles.message}>{toast.message}</Text>
                    </BlurView>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: 60, // Below header
        left: 20,
        right: 20,
        zIndex: 9999,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    blur: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    message: {
        color: theme.colors.text,
        fontFamily: theme.fonts.medium,
        fontSize: 14,
        flex: 1,
    }
});
