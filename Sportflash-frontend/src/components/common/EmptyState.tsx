import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/EmptyState.styles';

interface EmptyStateProps {
    icon?: any; // Ionicons name
    title?: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
    variant?: 'default' | 'search' | 'error' | 'noResults' | 'noMatches' | 'noNews' | 'noBookmarks' | 'noFollowing' | 'noNotifications';
    style?: StyleProp<ViewStyle>;
}

export default function EmptyState({
    icon = 'file-tray-outline',
    title = 'No Data Available',
    subtitle = 'There is nothing to display at the moment',
    actionLabel,
    onAction,
    variant = 'default', // default, search, error, noResults
    style,
}: EmptyStateProps) {
    const getIconAndText = () => {
        switch (variant) {
            case 'search':
                return {
                    icon: 'search-outline',
                    title: 'Start Searching',
                    subtitle: 'Find matches, teams, players, and news',
                };
            case 'error':
                return {
                    icon: 'alert-circle-outline',
                    title: 'Something Went Wrong',
                    subtitle: 'We encountered an error loading this content',
                };
            case 'noResults':
                return {
                    icon: 'search-outline',
                    title: 'No Results Found',
                    subtitle: 'Try adjusting your search or filters',
                };
            case 'noMatches':
                return {
                    icon: 'baseball-outline',
                    title: 'No Matches',
                    subtitle: 'There are no matches available at the moment',
                };
            case 'noNews':
                return {
                    icon: 'newspaper-outline',
                    title: 'No News',
                    subtitle: 'Check back later for the latest updates',
                };
            case 'noBookmarks':
                return {
                    icon: 'bookmark-outline',
                    title: 'No Bookmarks',
                    subtitle: 'Save your favorite matches and news here',
                };
            case 'noFollowing':
                return {
                    icon: 'heart-outline',
                    title: 'Not Following Anyone',
                    subtitle: 'Follow teams and players to see their updates',
                };
            case 'noNotifications':
                return {
                    icon: 'notifications-outline',
                    title: 'No Notifications',
                    subtitle: 'You\'re all caught up!',
                };
            default:
                return { icon, title, subtitle };
        }
    };

    const config = getIconAndText();
    const displayIcon = icon !== 'file-tray-outline' ? icon : config.icon;
    const displayTitle = title !== 'No Data Available' ? title : config.title;
    const displaySubtitle = subtitle !== 'There is nothing to display at the moment' ? subtitle : config.subtitle;

    return (
        <View style={[styles.container, style]}>
            {/* Icon Circle */}
            <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                    <Ionicons name={displayIcon as any} size={48} color={theme.colors.textMuted} />
                </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>{displayTitle}</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>{displaySubtitle}</Text>

            {/* Action Button */}
            {actionLabel && onAction && (
                <TouchableOpacity style={styles.actionButton} onPress={onAction}>
                    <Text style={styles.actionText}>{actionLabel}</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );
}
