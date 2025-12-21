import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Animated, Dimensions, TouchableWithoutFeedback, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = Math.min(width * 0.75, 300); // Cap width at 300px for larger screens
const WEBSITE_SIDEBAR_WIDTH = 250; // This constant is defined but not used in the provided snippet.

const MENU_SECTIONS = [
    {
        title: "MENU",
        data: [
            { icon: 'home', label: 'Home', route: 'Home' },
            { icon: 'calendar', label: 'Matches', route: 'Matches' },
            { icon: 'newspaper', label: 'News', route: 'News' },
            { icon: 'trophy', label: 'Series', route: 'Series' },
        ]
    },
    {
        title: "MY ZONE",
        data: [
            { icon: 'star', label: 'Following', route: 'Following' },
            { icon: 'bookmark', label: 'Bookmarks', route: 'Bookmarks' },
        ]
    },
    {
        title: "PREFERENCES",
        data: [
            { icon: 'settings', label: 'Settings', route: 'Settings' },
        ]
    }
];

export function SidebarContent({ onClose, style, showClose = true }) {
    const navigation = useNavigation();
    const [activeRoute, setActiveRoute] = useState('Home'); // Simulate active route or use explicit prop. For now default to 'Home'

    const handleNavigation = (route) => {
        setActiveRoute(route);
        if (onClose) onClose();

        // Handle Tab Navigation vs Stack Navigation
        const TAB_ROUTES = ['Home', 'Matches', 'News', 'Profile'];

        if (TAB_ROUTES.includes(route)) {
            // If target is a tab, navigate to Main navigator first
            navigation.navigate('Main', { screen: route });
        } else {
            // Otherwise navigate directly (for Stack screens)
            navigation.navigate(route);
        }
    };

    return (
        <View style={[styles.contentContainer, style]}>
            <View style={styles.header}>
                <View style={styles.logoRow}>
                    <Ionicons name="flash" size={24} color={theme.colors.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.logoText}>Sport<Text style={styles.highlight}>Flash</Text></Text>
                </View>
                {/* Always render close button button if onClose is provided, or strictly follow showClose */}
                {showClose && (
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView style={styles.menuContent} contentContainerStyle={{ paddingVertical: 10 }}>
                {MENU_SECTIONS.map((section, secIndex) => (
                    <View key={secIndex} style={styles.sectionContainer}>
                        <Text style={styles.sectionHeader}>{section.title}</Text>
                        {section.data.map((item, index) => {
                            const isActive = activeRoute === item.route;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                                    onPress={() => handleNavigation(item.route)}
                                >
                                    <Ionicons
                                        name={item.icon}
                                        size={20}
                                        color={isActive ? theme.colors.primary : theme.colors.textMuted}
                                        style={styles.menuIcon}
                                    />
                                    <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
        </View>
    );
}

export default function Sidebar({ visible, onClose }) {
    const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -SIDEBAR_WIDTH,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Close sidebar when tapping outside */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        styles.sidebarContainer,
                        { transform: [{ translateX: slideAnim }] },
                        { paddingTop: insets.top, paddingBottom: insets.bottom }
                    ]}
                >
                    <SidebarContent onClose={onClose} />
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    contentContainer: { // New style for shared content
        flex: 1,
        backgroundColor: '#0f172a',
    },
    overlay: {
        flex: 1,
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sidebarContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: '#0f172a', // Dark blue background
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md, // Reduced from xl to match Dashboard Header
        height: 64, // Enforce consistent height
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 20, // Slightly smaller for better proportion
        fontFamily: theme.fonts.display,
        fontWeight: 'bold',
        color: theme.colors.text,
        lineHeight: 24, // Fix vertical alignment
    },
    highlight: {
        color: theme.colors.primary,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    },
    menuContent: {
        flex: 1,
        paddingTop: theme.spacing.sm,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionHeader: {
        color: theme.colors.textMuted,
        fontSize: 11,
        fontWeight: '700',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: 8,
        marginTop: 8,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10, // slightly tighter
        paddingHorizontal: theme.spacing.lg,
        borderLeftWidth: 3,
        borderLeftColor: 'transparent',
        marginBottom: 2,
    },
    menuItemActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderLeftColor: theme.colors.primary,
        marginRight: 16,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    menuIcon: {
        marginRight: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
    },
    menuTextActive: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    footer: {
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(0,0,0,0.2)', // Distinct footer bg
    },
    versionText: {
        color: theme.colors.textMuted,
        fontSize: 12,
        textAlign: 'center',
        opacity: 0.7,
    }
});
