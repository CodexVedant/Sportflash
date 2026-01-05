import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useGetNewsQuery } from '@store/api/newsApi';
import { styles } from '@utils/style/NewsCategoryScreen.styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';

type NewsCategoryScreenRouteProp = RouteProp<RootStackParamList, 'NewsCategory'>;

export default function NewsCategoryScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<NewsCategoryScreenRouteProp>();
    const { category = 'all' } = route.params || {};

    // Fetch news based on category
    const { data: news = [], isLoading, error } = useGetNewsQuery(category as any);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: category.charAt(0).toUpperCase() + category.slice(1),
        });
    }, [category]);

    const handleNewsPress = (item: any) => {
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
                news.map((item: any) => (
                    <TouchableOpacity key={item.id} style={styles.newsItem} onPress={() => handleNewsPress(item)}>
                        <View style={styles.newsImagePlaceholder}>
                            {item.imageUrl ? (
                                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                            ) : (
                                <Ionicons name="image-outline" size={24} color={theme.colors.textMuted} />
                            )}
                        </View>
                        <View style={styles.newsContent}>
                            <View style={styles.metaRow}>
                                <Text style={styles.category}>{item.category || category}</Text>
                                <Text style={styles.dot}>â€¢</Text>
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

