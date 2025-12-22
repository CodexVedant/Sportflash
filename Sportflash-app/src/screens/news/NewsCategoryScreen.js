import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetNewsQuery } from '@store/api/newsApi';

export default function NewsCategoryScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { category = 'all' } = route.params || {};

    // Fetch news based on category
    const { data: news = [], isLoading, error } = useGetNewsQuery(category);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: category.charAt(0).toUpperCase() + category.slice(1),
        });
    }, [category]);

    const handleNewsPress = (item) => {
        navigation.navigate('NewsDetail', { newsId: item.id });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: theme.colors.textMuted }}>Failed to load news</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {news.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <Text style={{ color: theme.colors.textMuted }}>No news found for {category}</Text>
                </View>
            ) : (
                news.map(item => (
                    <TouchableOpacity key={item.id} style={styles.newsItem} onPress={() => handleNewsPress(item)}>
                        <View style={styles.newsImagePlaceholder}>
                            {item.image ? (
                                <Image source={{ uri: item.image }} style={styles.image} />
                            ) : (
                                <Ionicons name="image-outline" size={24} color={theme.colors.textMuted} />
                            )}
                        </View>
                        <View style={styles.newsContent}>
                            <View style={styles.metaRow}>
                                <Text style={styles.category}>{item.category || category}</Text>
                                <Text style={styles.dot}>•</Text>
                                <Text style={styles.time}>{item.time || 'Recent'}</Text>
                            </View>
                            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
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
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
        textTransform: 'capitalize',
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
});
