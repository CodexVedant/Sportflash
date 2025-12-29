import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/NotificationItem.styles';

export default function NotificationItem({
    notification,
    onPress,
    onMarkAsRead,
    onDelete
}) {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'match_start':
                return { name: 'play-circle', color: '#3B82F6' };
            case 'match_end':
                return { name: 'checkmark-circle', color: '#10B981' };
            case 'goal':
            case 'wicket':
            case 'score':
                return { name: 'trophy', color: '#F59E0B' };
            case 'news':
                return { name: 'newspaper', color: '#8B5CF6' };
            case 'team_update':
                return { name: 'people', color: '#EC4899' };
            default:
                return { name: 'notifications', color: theme.colors.primary };
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const notifTime = new Date(timestamp);
        const diffMs = now - notifTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notifTime.toLocaleDateString();
    };

    const icon = getNotificationIcon(notification.type);

    return (
        <TouchableOpacity
            style={[
                styles.container,
                !notification.read && styles.unreadContainer
            ]}
            onPress={() => onPress && onPress(notification)}
            activeOpacity={0.7}
        >
            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: `${icon.color}20` }]}>
                <Ionicons name={icon.name} size={22} color={icon.color} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {notification.title}
                </Text>
                <Text style={styles.message} numberOfLines={2}>
                    {notification.message}
                </Text>
                <View style={styles.footer}>
                    <Text style={styles.time}>{getTimeAgo(notification.timestamp)}</Text>
                    {!notification.read && (
                        <View style={styles.unreadDot} />
                    )}
                </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
                {!notification.read && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            onMarkAsRead && onMarkAsRead(notification.id);
                        }}
                    >
                        <Ionicons name="checkmark" size={18} color={theme.colors.primary} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        onDelete && onDelete(notification.id);
                    }}
                >
                    <Ionicons name="close" size={18} color={theme.colors.textMuted} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}
