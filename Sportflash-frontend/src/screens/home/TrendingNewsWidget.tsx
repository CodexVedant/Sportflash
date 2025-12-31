import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/TrendingNewsWidget.styles';

export default function TrendingNewsWidget() {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>TRENDING NEWS</Text>
            <View style={styles.newsPlaceholder}>
                <Text style={{ color: theme.colors.textMuted }}>News feed coming in Phase 1B...</Text>
            </View>
        </View>
    );
}
