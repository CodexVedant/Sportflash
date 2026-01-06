import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useGetNewsDetailQuery } from '@store/api/newsApi';
import { useDispatch } from 'react-redux';
import { toggleBookmark } from '@store/slices/newsSlice';
import { styles } from '@utils/style/NewsDetailScreen.styles';
import { useAppSelector } from '@hooks/redux';
import { RootStackParamList } from '@app-types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NewsDetailScreenRouteProp = RouteProp<RootStackParamList, 'NewsDetail'>;

export default function NewsDetailScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<NewsDetailScreenRouteProp>();
    const { newsId } = route.params || {};

    const dispatch = useDispatch();
    const bookmarks = useAppSelector(state => state.news.bookmarks);
    // Ensure ids are compared as strings or numbers consistently. API usually returns strings or numbers. 
    // Assuming bookmarks stores same type as newsId.
    const isBookmarked = newsId ? bookmarks.includes(String(newsId)) : false;

    const { data: article, isLoading, error } = useGetNewsDetailQuery(String(newsId || ''));

    // Debug logging
    React.useEffect(() => {
        console.log('NewsDetailScreen - newsId:', newsId);
        console.log('NewsDetailScreen - bookmarks:', bookmarks);
        console.log('NewsDetailScreen - isBookmarked:', isBookmarked);
    }, [newsId, bookmarks, isBookmarked]);

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

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this news: ${article?.title}`,
            });
        } catch (error: any) {
            console.log((error as Error).message);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error || !article) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: theme.colors.textMuted }}>Article not found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                    <Text style={{ color: theme.colors.primary }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Header */}
                <View style={styles.imageContainer}>
                    {article.imageUrl ? (
                        <Image source={{ uri: article.imageUrl }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Ionicons name="newspaper-outline" size={64} color="rgba(255,255,255,0.2)" />
                        </View>
                    )}

                    {/* Floating Header Actions */}
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity onPress={() => dispatch(toggleBookmark(String(newsId)))} style={styles.iconBtn}>
                                <Ionicons
                                    name={isBookmarked ? "bookmark" : "bookmark-outline"}
                                    size={24}
                                    color={isBookmarked ? theme.colors.primary : "#FFF"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
                                <Ionicons name="share-social-outline" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View >
                    </View >
                </View >

                {/* Content */}
                < View style={styles.content} >
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{article.category || 'News'}</Text>
                    </View>

                    <Text style={styles.title}>{article.title}</Text>

                    <View style={styles.meta}>
                        <Text style={styles.metaText}>{article.author || 'SportFlash Team'}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.metaText}>{getTimeAgo(article.publishedAt)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.body}>
                        {article.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."}
                    </Text>
                </View >
            </ScrollView >
        </SafeAreaView >
    );
}

