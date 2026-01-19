import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGetNewsQuery } from '@store/api/newsApi';
import { toggleBookmark } from '@store/slices/newsSlice';
import { styles } from '@utils/style/BookmarksScreen.styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { useAppDispatch, useAppSelector } from '@hooks/redux';

export default function BookmarksScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const bookmarks = useAppSelector(state => state.news.bookmarks);

    // Fetch news from all categories to ensure we can find bookmarked articles
    const { data: allNews = [] } = useGetNewsQuery('all');
    const { data: cricketNews = [] } = useGetNewsQuery('cricket');
    const { data: footballNews = [] } = useGetNewsQuery('football');
    const { data: basketballNews = [] } = useGetNewsQuery('basketball');

    // Combine all news and remove duplicates
    const combinedNews = React.useMemo(() => {
        const newsMap = new Map();
        [...allNews, ...cricketNews, ...footballNews, ...basketballNews].forEach(article => {
            newsMap.set(String(article.id), article);
        });
        return Array.from(newsMap.values());
    }, [allNews, cricketNews, footballNews, basketballNews]);

    const bookmarkedArticles = combinedNews.filter(item => bookmarks.includes(String(item.id)));



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
                            <TouchableOpacity style={styles.removeBtn} onPress={() => dispatch(toggleBookmark(String(item.id)))}>
                                <Ionicons name="trash-outline" size={20} color={theme.colors.textMuted} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

