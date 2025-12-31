import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({
    section: {
        marginBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.sm,
        fontWeight: '600',
        marginBottom: theme.spacing.md,
        letterSpacing: 1,
    },
    matchesScroll: {
        flex: 1,
    },
    leagueHeader: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        marginBottom: 4,
    },
    leagueTitle: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
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
        textAlign: 'center',
    }
});
