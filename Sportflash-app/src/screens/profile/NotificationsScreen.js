import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { markAllAsRead, markAsRead } from '@store/slices/notificationsSlice';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    readAll: {
        color: theme.colors.primary,
        fontSize: 14,
    },
    listContent: {
        padding: theme.spacing.md,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    unreadItem: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
    },
    iconBox: {
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    title: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    message: {
        color: theme.colors.textMuted,
        fontSize: 14,
        marginBottom: 4,
    },
    time: {
        color: theme.colors.textMuted,
        fontSize: 10,
        opacity: 0.7,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
        marginLeft: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: theme.colors.textMuted,
        marginTop: 16,
    }
});
