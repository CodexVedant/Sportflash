import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.sm,
        fontWeight: '600',
        letterSpacing: 1,
    },
    viewAllText: {
        color: theme.colors.primary,
        fontSize: theme.sizes.sm,
        fontWeight: '600',
    },
    newsPlaceholder: {
        height: 150,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    newsContainer: {
        gap: theme.spacing.md,
    },
    newsCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        flexDirection: 'row',
    },
    newsImageContainer: {
        width: 100,
        height: 100,
    },
    newsImage: {
        width: '100%',
        height: '100%',
    },
    newsImagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.03)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    newsContent: {
        flex: 1,
        padding: theme.spacing.md,
        justifyContent: 'space-between',
    },
    newsMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    newsCategory: {
        color: theme.colors.primary,
        fontSize: theme.sizes.xs,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    newsDot: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.xs,
        marginHorizontal: theme.spacing.xs,
    },
    newsTime: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.xs,
    },
    newsTitle: {
        color: theme.colors.text,
        fontSize: theme.sizes.md,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
        lineHeight: 20,
    },
    newsDescription: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.sm,
        lineHeight: 18,
    },
});
