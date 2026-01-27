import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

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
