import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    section: {
        marginBottom: theme.spacing.xl,
        minHeight: 200,
    },
    matchesScroll: {
        maxHeight: 780, // Limit height to make it a scrollable widget
    },
    sectionTitle: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.sm,
        fontWeight: '600',
        marginBottom: theme.spacing.md,
        letterSpacing: 1,
    },
    leagueHeader: {
        backgroundColor: theme.colors.surface,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: theme.spacing.sm,
        marginTop: theme.spacing.md,
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
        // Ensure zIndex is managed if needed, but in normal View flow it should be fine
        zIndex: 10,
    },
    leagueTitle: {
        color: theme.colors.text,
        fontWeight: '700',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    emptyContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: theme.borderRadius.lg,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: theme.sizes.md,
    },
});
