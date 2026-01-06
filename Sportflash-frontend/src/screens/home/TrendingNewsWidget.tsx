import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/TrendingNewsWidget.styles';
import { useGetNewsQuery } from '@store/api/newsApi';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { NewsCategory } from '@app-types/models/news';

interface TrendingNewsWidgetProps {
    sport?: string;
}

export default function TrendingNewsWidget({ sport = 'all' }: TrendingNewsWidgetProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // Map sport to news category
    const getNewsCategory = (sportName: string): NewsCategory => {
        const categoryMap: Record<string, NewsCategory> = {
            'cricket': 'cricket',
            'football': 'football',
            'basketball': 'basketball',
            'all': 'all'
        };
        return categoryMap[sportName.toLowerCase()] || 'all';
    };

    const category = getNewsCategory(sport);
    const { data: newsItems = [], isLoading, error, refetch } = useGetNewsQuery(category);

    // Automatically refetch when component mounts or sport changes
    React.useEffect(() => {
        refetch();
    }, [sport, refetch]);

    // Get top 3 news items
    const topNews = newsItems.slice(0, 3);


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

    const handleNewsPress = (newsId: string) => {
        navigation.navigate('NewsDetail', { newsId });
    };

    const handleViewAll = () => {
        navigation.navigate('News');
    };

    const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({});

    const handleImageError = (newsId: string) => {
        setImageErrors(prev => ({ ...prev, [newsId]: true }));
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>TRENDING NEWS</Text>
                {topNews.length > 0 && (
                    <TouchableOpacity onPress={handleViewAll}>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {isLoading && (
                <View style={styles.newsPlaceholder}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                </View>
            )}

            {error && (
                <View style={styles.newsPlaceholder}>
                    <Text style={{ color: theme.colors.textMuted }}>Failed to load news</Text>
                </View>
            )}

            {!isLoading && !error && topNews.length === 0 && (
                <View style={styles.newsPlaceholder}>
                    <Text style={{ color: theme.colors.textMuted }}>No news available</Text>
                </View>
            )}

            {!isLoading && !error && topNews.length > 0 && (
                <View style={styles.newsContainer}>
                    {topNews.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.newsCard}
                            onPress={() => handleNewsPress(String(item.id))}
                        >
                            <View style={styles.newsImageContainer}>
                                {item.imageUrl && !imageErrors[String(item.id)] ? (
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        style={styles.newsImage}
                                        resizeMode="cover"
                                        onError={() => handleImageError(String(item.id))}
                                    />
                                ) : (
                                    <View style={styles.newsImagePlaceholder}>
                                        <Ionicons name="newspaper-outline" size={24} color={theme.colors.textMuted} />
                                    </View>
                                )}
                            </View>
                            <View style={styles.newsContent}>
                                <View style={styles.newsMetaRow}>
                                    <Text style={styles.newsCategory}>{item.category || 'Sports'}</Text>
                                    <Text style={styles.newsDot}>•</Text>
                                    <Text style={styles.newsTime}>{getTimeAgo(item.publishedAt)}</Text>
                                </View>
                                <Text style={styles.newsTitle} numberOfLines={2}>
                                    {item.title}
                                </Text>
                                {item.description && (
                                    <Text style={styles.newsDescription} numberOfLines={2}>
                                        {item.description}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}
