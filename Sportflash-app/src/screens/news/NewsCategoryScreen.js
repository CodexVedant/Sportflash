import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetNewsQuery } from '@store/api/newsApi';
import { styles } from '@utils/style/NewsCategoryScreen.styles';

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
