import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Sidebar from '@components/navigation/Sidebar';
import MenuToggle from '@components/navigation/MenuToggle';
import { useGetTrendingNewsQuery } from '@store/api/newsApi';
import { styles } from '@utils/style/NewsScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'News'>;

export default function NewsScreen({ navigation }: Props) {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const { data: newsItems = [], isLoading, error } = useGetTrendingNewsQuery(undefined);

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

    const featuredArticle = newsItems[0];
    const otherNews = newsItems.slice(1);

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
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
                )}

                {error && (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.textMuted }}>Failed to load news. Please try again.</Text>
                    </View>
                )}

                {!isLoading && newsItems.length === 0 && (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.textMuted }}>No news available at the moment.</Text>
                    </View>
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
                        {featuredArticle.imageUrl && (
                            <Image source={{ uri: featuredArticle.imageUrl }} style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]} />
                        )}
                        <View style={styles.featuredContent}>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{featuredArticle.category || 'Sports'}</Text>
                            </View>
                            <Text style={styles.featuredTitle}>{featuredArticle.title}</Text>
                            <Text style={styles.featuredTime}>{getTimeAgo(featuredArticle.publishedAt)}</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {/* News List */}
                {otherNews.map((item: any) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.newsItem}
                        onPress={() => navigation.navigate('NewsDetail', { newsId: item.id })}
                    >
                        <View style={styles.newsImagePlaceholder}>
                            {item.imageUrl ? (
                                <Image source={{ uri: item.imageUrl }} style={styles.listImage} />
                            ) : (
                                <Ionicons name="image-outline" size={24} color={theme.colors.textMuted} />
                            )}
                        </View>
                        <View style={styles.newsContent}>
                            <View style={styles.metaRow}>
                                <Text style={styles.category}>{item.category || 'Sports'}</Text>
                                <Text style={styles.dot}>â€¢</Text>
                                <Text style={styles.time}>{getTimeAgo(item.publishedAt)}</Text>
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

