import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useGetNewsQuery } from '@store/api/newsApi';
import { toggleBookmark } from '@store/slices/newsSlice';

export default function BookmarksScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const bookmarks = useSelector(state => state.news.bookmarks);

    // In a real app, we might have a specific endpoint for getBookmarkedNews(ids)
    // For now, we fetch all news (or filtered) and filter locally, or mock it.
    // Let's assume fetching all news for demo purposes.
    const { data: allNews = [] } = useGetNewsQuery('all');

    const bookmarkedArticles = allNews.filter(item => bookmarks.includes(item.id));

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bookmarks</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {bookmarkedArticles.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="bookmark-outline" size={64} color={theme.colors.textMuted} />
                        <Text style={styles.emptyText}>No bookmarks yet</Text>
                        <Text style={styles.emptySubText}>Articles you bookmark will appear here.</Text>
                    </View>
                ) : (
                    bookmarkedArticles.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.newsItem}
                            onPress={() => navigation.navigate('NewsDetail', { newsId: item.id })}
                        >
                            <View style={styles.newsImagePlaceholder}>
                                {item.image ? (
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                ) : (
                                    <Ionicons name="image-outline" size={24} color={theme.colors.textMuted} />
                                )}
                            </View>
                            <View style={styles.newsContent}>
                                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.time}>{item.time || 'Recent'}</Text>
                            </View>
                            <TouchableOpacity style={styles.removeBtn} onPress={() => dispatch(toggleBookmark(item.id))}>
                                <Ionicons name="trash-outline" size={20} color={theme.colors.textMuted} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
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
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backBtn: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    content: {
        padding: theme.spacing.lg,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        opacity: 0.7,
    },
    emptyText: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
    },
    emptySubText: {
        color: theme.colors.textMuted,
        marginTop: 8,
    },
    newsItem: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: theme.borderRadius.md,
        padding: 8,
        alignItems: 'center',
    },
    newsImagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    newsContent: {
        flex: 1,
    },
    title: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    time: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
    removeBtn: {
        padding: 8,
    }
});
