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
                    bookmarkedArticles.map((item: any) => (
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

