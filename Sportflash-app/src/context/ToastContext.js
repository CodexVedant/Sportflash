import React, { createContext, useState, useContext, useCallback } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { styles } from '@utils/style/ToastContext.styles';

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
