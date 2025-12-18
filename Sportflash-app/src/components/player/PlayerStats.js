import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: theme.spacing.md,
    },
    gridItem: {
        width: '50%',
        padding: theme.spacing.xs,
    },
    statCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textMuted,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    formContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: theme.spacing.lg,
    },
    formBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    achievementsScroll: {
        paddingHorizontal: theme.spacing.lg,
        gap: 12,
    },
    achievementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 12,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        gap: 12,
        minWidth: 180,
    },
    achievementIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(253, 185, 49, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    achievementTitle: {
        color: theme.colors.text,
        fontWeight: '600',
        fontSize: 14,
    },
    achievementYear: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
});
