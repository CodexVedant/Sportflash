import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
    useGetNotificationsQuery,
    useMarkAllNotificationsReadMutation,
    useMarkNotificationReadMutation
} from '@store/api/notificationsApi';
import { setNotifications, markAsRead as markAsReadAction, markAllAsRead as markAllAsReadAction } from '@store/slices/notificationsSlice';
import { styles } from '@utils/style/NotificationsScreen.styles';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useEffect } from 'react';

export default function NotificationsScreen() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(state => state.notifications.items);

    // API Hooks
    const { data: apiData, refetch } = useGetNotificationsQuery();
    const [markReadApi] = useMarkNotificationReadMutation();
    const [markAllReadApi] = useMarkAllNotificationsReadMutation();

    // Sync API Data to Redux Store on Load
    useEffect(() => {
        if (apiData && apiData.data) {
            dispatch(setNotifications(apiData.data));
        }
    }, [apiData, dispatch]);

    const handlePress = async (item: any) => {
        if (!item.read) {
            dispatch(markAsReadAction(item.id)); // Optimistic UI update
            try {
                await markReadApi(item.id).unwrap();
            } catch (error) { console.error('Failed to mark read', error); }
        }

        // Deep Link Navigation
        if (item.matchId) {
            // @ts-ignore - Navigation typing is complex here, suppressing for expediency
            navigation.navigate('MatchDetail', {
                matchId: item.matchId,
                sport: item.sport || 'football'
            });
        }
    };

    const handleMarkAllRead = async () => {
        dispatch(markAllAsReadAction()); // Optimistic
        try {
            await markAllReadApi().unwrap();
        } catch (error) { console.error('Failed to mark all read', error); }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.item, !item.read && styles.unreadItem]}
            onPress={() => handlePress(item)}
        >
            <View style={styles.iconBox}>
                <Ionicons
                    name={item.type === 'goal' ? 'football' : 'information-circle'}
                    size={24}
                    color={theme.colors.primary}
                />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity onPress={handleMarkAllRead}>
                    <Text style={styles.readAll}>Mark all read</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off-outline" size={64} color={theme.colors.textMuted} />
                        <Text style={styles.emptyText}>No notifications</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
