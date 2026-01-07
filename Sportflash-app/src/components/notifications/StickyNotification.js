import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearStickyNotification } from '@store/slices/notificationsSlice';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function StickyNotification() {
    const notification = useSelector(state => state.notifications.stickyNotification);
    const dispatch = useDispatch();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const translateY = React.useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (notification) {
            // Slide Down
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                speed: 12,
                bounciness: 8
            }).start();

            // Auto dismiss after 5 seconds
            const timer = setTimeout(handleDismiss, 5000);
            return () => clearTimeout(timer);
        } else {
            // Reset position when null
            translateY.setValue(-100);
        }
    }, [notification]);

    const handleDismiss = () => {
        Animated.timing(translateY, {
            toValue: -150,
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            dispatch(clearStickyNotification());
        });
    };

    if (!notification) return null;

    const styles = makeStyles(theme, insets);

    // Color based on type
    const getBorderColor = () => {
        switch (notification.type) {
            case 'wicket': return '#FF4B4B'; // Red
            case 'four': return '#4CAF50'; // Green
            case 'six': return '#9C27B0'; // Purple
            case 'goal': return '#2196F3'; // Blue
            default: return theme.colors.primary;
        }
    };

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
            <View style={[styles.content, { borderLeftColor: getBorderColor() }]}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{notification.title}</Text>
                    <Text style={styles.message}>{notification.message}</Text>
                </View>
                <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
                    <Ionicons name="close" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const makeStyles = (theme, insets) => StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999, // Ensure it's above everything
        paddingTop: insets.top + 10,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    content: {
        width: '100%',
        maxWidth: 600,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        color: theme.colors.text,
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        color: theme.colors.textMuted,
    },
    closeButton: {
        padding: 8,
    }
});
