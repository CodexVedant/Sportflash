import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGetBookmarksQuery, useToggleBookmarkMutation } from '@store/api/newsApi';
import { styles } from '@utils/style/BookmarksScreen.styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { useAppDispatch, useAppSelector } from '@hooks/redux';

export default function BookmarksScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();

    // Fetch directly from backend (populated articles)
    const { data: bookmarkedArticles = [], isLoading, error } = useGetBookmarksQuery();
    const [toggleBookmarkApi] = useToggleBookmarkMutation();

    // Helper function to format time ago
    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const handleRemove = async (articleId: string) => {
        try {
            // Optimistic removal logic could go here, but RTK Query tags handle it well
            await toggleBookmarkApi({ articleId, articleData: {} }).unwrap();
        } catch (err) {
            console.error('Failed to remove bookmark:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bookmarks</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {isLoading ? (
                    <View style={{ padding: 20 }}>
                        <Text style={{ color: theme.colors.textMuted, textAlign: 'center' }}>Loading bookmarks...</Text>
                    </View>
                ) : bookmarkedArticles.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="bookmark-outline" size={64} color={theme.colors.textMuted} />
                        <Text style={styles.emptyText}>No bookmarks yet</Text>
                        <Text style={styles.emptySubText}>Articles you bookmark will appear here.</Text>
                    </View>
                ) : (
                    bookmarkedArticles.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.newsItem}
                            onPress={() => navigation.navigate('NewsDetail', { newsId: String(item.id) })}
                        >
                            <View style={styles.newsImagePlaceholder}>
                                {item.imageUrl ? (
                                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                                ) : (
                                    <Ionicons name="image-outline" size={24} color={theme.colors.textMuted} />
                                )}
                            </View>
                            <View style={styles.newsContent}>
                                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.time}>{getTimeAgo(item.publishedAt)}</Text>
                            </View>
                            <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(String(item.id))}>
                                <Ionicons name="trash-outline" size={20} color={theme.colors.textMuted} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

