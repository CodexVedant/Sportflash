import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { markAllAsRead, markAsRead } from '@store/slices/notificationsSlice';
import { styles } from '@utils/style/NotificationsScreen.styles';

export default function NotificationsScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications.items);

    const handlePress = (item) => {
        if (!item.read) {
            dispatch(markAsRead(item.id));
        }
        // Navigate if needed
    };

    const renderItem = ({ item }) => (
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
                <TouchableOpacity onPress={() => dispatch(markAllAsRead())}>
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
