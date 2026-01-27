import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { BlurView } from 'expo-blur';
import NotificationItemComponent from './NotificationItem';
import { NotificationItem } from '@app-types/models/notification';
import EmptyState from '@components/common/EmptyState';
import { styles } from '@utils/style/NotificationPanel.styles';

interface NotificationPanelProps {
    visible: boolean;
    onClose: () => void;
    notifications?: NotificationItem[];
    onNotificationPress?: (notification: NotificationItem) => void;
}

export default function NotificationPanel({ visible, onClose, notifications = [], onNotificationPress }: NotificationPanelProps) {
    const [localNotifications, setLocalNotifications] = useState<NotificationItem[]>(notifications);
    const [filter, setFilter] = useState<'all' | 'unread'>('all'); // all, unread

    useEffect(() => {
        setLocalNotifications(notifications);
    }, [notifications]);

    const handleMarkAsRead = (id: string | number) => {
        setLocalNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const handleDelete = (id: string | number) => {
        setLocalNotifications(prev =>
            prev.filter(notif => notif.id !== id)
        );
    };

    const handleMarkAllAsRead = () => {
        setLocalNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const handleClearAll = () => {
        setLocalNotifications([]);
    };

    const filteredNotifications = filter === 'unread'
        ? localNotifications.filter(n => !n.read)
        : localNotifications;

    const unreadCount = localNotifications.filter(n => !n.read).length;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

                {/* Click outside to close */}
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* Notification Panel */}
                <View style={styles.panel}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Ionicons name="notifications" size={24} color={theme.colors.text} />
                            <Text style={styles.headerTitle}>Notifications</Text>
                            {unreadCount > 0 && (
                                <View style={styles.headerBadge}>
                                    <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Filter Tabs */}
                    <View style={styles.filterContainer}>
                        <View style={styles.filterTabs}>
                            <TouchableOpacity
                                style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                                onPress={() => setFilter('all')}
                            >
                                <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
                                    All ({localNotifications.length})
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
                                onPress={() => setFilter('unread')}
                            >
                                <Text style={[styles.filterTabText, filter === 'unread' && styles.filterTabTextActive]}>
                                    Unread ({unreadCount})
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Actions */}
                        {localNotifications.length > 0 && (
                            <View style={styles.headerActions}>
                                {unreadCount > 0 && (
                                    <TouchableOpacity onPress={handleMarkAllAsRead}>
                                        <Text style={styles.actionText}>Mark all read</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={handleClearAll}>
                                    <Text style={[styles.actionText, styles.actionTextDanger]}>Clear all</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Notifications List */}
                    <ScrollView
                        style={styles.content}
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {filteredNotifications.length === 0 ? (
                            <EmptyState
                                variant="noNotifications"
                                style={styles.emptyState}
                            />
                        ) : (
                            filteredNotifications.map(notification => (
                                <NotificationItemComponent
                                    key={notification.id}
                                    notification={notification}
                                    onPress={onNotificationPress}
                                    onMarkAsRead={handleMarkAsRead}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
