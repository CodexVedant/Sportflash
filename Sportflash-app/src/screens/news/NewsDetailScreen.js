import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetNewsDetailQuery } from '@store/api/newsApi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark } from '@store/slices/newsSlice';

export default function NewsDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { newsId } = route.params || {};

    const dispatch = useDispatch();
    const bookmarks = useSelector(state => state.news.bookmarks);
    const isBookmarked = bookmarks.includes(newsId);

    const { data: article, isLoading, error } = useGetNewsDetailQuery(newsId);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this news: ${article?.title}`,
            });
        } catch (error) {
            console.log(error.message);
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
                    {article.image ? (
                        <Image source={{ uri: article.image }} style={styles.image} />
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
                            <TouchableOpacity onPress={() => dispatch(toggleBookmark(newsId))} style={styles.iconBtn}>
                                <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={24} color={isBookmarked ? theme.colors.primary : "#FFF"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
                                <Ionicons name="share-social-outline" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{article.category || 'News'}</Text>
                    </View>

                    <Text style={styles.title}>{article.title}</Text>

                    <View style={styles.meta}>
                        <Text style={styles.metaText}>{article.author || 'SportFlash Team'}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.metaText}>{article.time || 'Just now'}</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.body}>
                        {article.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    imageContainer: {
        height: 300,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerActions: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(10px)', // iOS only
    },
    content: {
        padding: theme.spacing.xl,
        marginTop: -20,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    badge: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    badgeText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    title: {
        color: theme.colors.text,
        fontSize: 24,
        fontFamily: theme.fonts.display, // Assuming display font exists
        fontWeight: 'bold',
        lineHeight: 32,
        marginBottom: 16,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    metaText: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    dot: {
        color: theme.colors.textMuted,
        marginHorizontal: 8,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 24,
    },
    body: {
        color: theme.colors.text,
        fontSize: 16,
        lineHeight: 26,
        opacity: 0.9,
    }
});
