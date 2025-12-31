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
    const { data: newsItems = [], isLoading } = useGetTrendingNewsQuery(undefined); // Pass undefined if no args needed

    // Use fetched data or fallback to mock if API returns empty (for demo)
    const displayData = newsItems.length > 0 ? newsItems : [
        {
            id: '1',
            title: "World Cup Final: India vs Australia Preview",
            category: "Cricket",
            time: "2h ago",
            image: null
        },
        {
            id: '2',
            title: "Ronaldo scores hat-trick in Saudi Pro League",
            category: "Football",
            time: "4h ago",
            image: null
        }
    ];

    const featuredArticle = displayData[0];
    // Ensure displayData is an array before slicing
    const otherNews = Array.isArray(displayData) ? displayData.slice(1) : [];

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
                        // @ts-ignore - Assuming NewsDetail params are correct in navigation types
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
                {otherNews.map((item: any) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.newsItem}
                        // @ts-ignore
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
                                <Text style={styles.dot}>â€¢</Text>
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

