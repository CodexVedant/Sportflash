import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@utils/style/PlayerStats.styles';

export default function PlayerStats({ stats, form, achievements }) {
    const renderStatItem = (label, value, icon) => (
        <View style={styles.statCard}>
            <View style={styles.statHeader}>
                <Ionicons name={icon} size={18} color={theme.colors.primary} />
                <Text style={styles.statLabel}>{label}</Text>
            </View>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    );

    const renderFormBadge = (result, index) => {
        let backgroundColor = theme.colors.surface;
        let textColor = theme.colors.textMuted;

        if (result === 'W') {
            backgroundColor = 'rgba(34, 197, 94, 0.2)';
            textColor = theme.colors.football;
        } else if (result === 'L') {
            backgroundColor = 'rgba(239, 68, 68, 0.2)';
            textColor = theme.colors.danger;
        } else if (result === 'D') {
            backgroundColor = 'rgba(234, 179, 8, 0.2)';
            textColor = theme.colors.warning;
        }

        return (
            <View key={index} style={[styles.formBadge, { backgroundColor }]}>
                <Text style={[styles.formText, { color: textColor }]}>{result}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Career Stats Grid */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Career Stats</Text>
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.gridItem}>
                            {renderStatItem(stat.label, stat.value, stat.icon)}
                        </View>
                    ))}
                </View>
            </View>

            {/* Recent Form */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Form</Text>
                <View style={styles.formContainer}>
                    {form.map((result, index) => renderFormBadge(result, index))}
                </View>
            </View>

            {/* Achievements */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsScroll}>
                    {achievements.map((item, index) => (
                        <View key={index} style={styles.achievementCard}>
                            <View style={styles.achievementIcon}>
                                <Ionicons name="trophy" size={24} color="#FDB931" />
                            </View>
                            <View>
                                <Text style={styles.achievementTitle}>{item.title}</Text>
                                <Text style={styles.achievementYear}>{item.year}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
