import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Sidebar from '@components/navigation/Sidebar';
import MenuToggle from '@components/navigation/MenuToggle';
import { useGetTrendingNewsQuery } from '@store/api/newsApi';

export default function NewsScreen({ navigation }) {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const { data: newsItems = [], isLoading } = useGetTrendingNewsQuery();

    // Use fetched data or fallback to mock if API returns empty (for demo)
    const displayData = newsItems.length > 0 ? newsItems : [
        {
            id: 1,
            title: "World Cup Final: India vs Australia Preview",
            category: "Cricket",
            time: "2h ago",
            image: null
        },
        {
            id: 2,
            title: "Ronaldo scores hat-trick in Saudi Pro League",
            category: "Football",
            time: "4h ago",
            image: null
        }
    ];

    const featuredArticle = displayData[0];
    const otherNews = displayData.slice(1);

    return (
        <SafeAreaView style={styles.container}>
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <MenuToggle onPress={() => setSidebarVisible(true)} style={styles.menuBtn} />
                    <Text style={styles.headerTitle}>Trending News</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {isLoading && (
                    <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginBottom: 20 }} />
                )}

                {/* Featured News */}
                {featuredArticle && (
                    <TouchableOpacity
                        style={styles.featuredCard}
                        onPress={() => navigation.navigate('NewsDetail', { newsId: featuredArticle.id })}
                    >
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.featuredGradient}
                        />
                        {featuredArticle.image && (
                            <Image source={{ uri: featuredArticle.image }} style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]} />
                        )}
                        <View style={styles.featuredContent}>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{featuredArticle.category}</Text>
                            </View>
                            <Text style={styles.featuredTitle}>{featuredArticle.title}</Text>
                            <Text style={styles.featuredTime}>{featuredArticle.time}</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {/* News List */}
                {otherNews.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.newsItem}
                        onPress={() => navigation.navigate('NewsDetail', { newsId: item.id })}
                    >
                        <View style={styles.newsImagePlaceholder}>
                            {item.image ? (
                                <Image source={{ uri: item.image }} style={styles.listImage} />
                            ) : (
                                <Ionicons name="image-outline" size={24} color={theme.colors.textMuted} />
                            )}
                        </View>
                        <View style={styles.newsContent}>
                            <View style={styles.metaRow}>
                                <Text style={styles.category}>{item.category}</Text>
                                <Text style={styles.dot}>•</Text>
                                <Text style={styles.time}>{item.time}</Text>
                            </View>
                            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={{ height: 80 }} />
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
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitle: {
        fontSize: theme.sizes.xl,
        fontFamily: theme.fonts.display,
        color: theme.colors.text,
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    featuredCard: {
        height: 200,
        backgroundColor: '#1E293B',
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.xl,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    featuredGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    featuredContent: {
        padding: theme.spacing.lg,
    },
    categoryBadge: {
        backgroundColor: theme.colors.primary,
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
    },
    categoryText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: theme.fonts.bold,
        textTransform: 'uppercase',
    },
    featuredTitle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: theme.fonts.bold,
        marginBottom: 4,
    },
    featuredTime: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
    newsItem: {
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
    },
    newsImagePlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover'
    },
    newsContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    category: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    dot: {
        color: theme.colors.textMuted,
        marginHorizontal: 6,
        fontSize: 12,
    },
    time: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
    title: {
        color: theme.colors.text,
        fontSize: 16,
        fontFamily: theme.fonts.medium,
        lineHeight: 22,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuBtn: {
        marginRight: 16,
    }
});
