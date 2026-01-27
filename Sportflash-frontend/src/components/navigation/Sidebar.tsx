import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Animated, TouchableWithoutFeedback, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles, SIDEBAR_WIDTH } from '@utils/style/Sidebar.styles';
import { MENU_SECTIONS, handleSidebarNavigation } from '@utils/script/Sidebar.helpers';

interface SidebarContentProps {
    onClose: () => void;
    style?: StyleProp<ViewStyle>;
    showClose?: boolean;
}

export function SidebarContent({ onClose, style, showClose = true }: SidebarContentProps) {
    const navigation = useNavigation();
    const route = useRoute();
    const activeRoute = route.name;

    const handleNavigation = (targetRoute: string) => {
        handleSidebarNavigation(navigation, targetRoute, onClose);
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

interface SidebarProps {
    visible: boolean;
    onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
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
