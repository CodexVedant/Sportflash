import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    inningContainer: {
        marginBottom: theme.spacing.xl,
    },
    inningHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        marginBottom: theme.spacing.sm,
    },
    inningTitle: {
        color: theme.colors.primary,
        fontSize: theme.sizes.md,
        fontWeight: 'bold',
    },
    inningScore: {
        color: theme.colors.text,
        fontSize: theme.sizes.md,
        fontWeight: 'bold',
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: theme.spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        marginBottom: theme.spacing.xs,
    },
    headerText: {
        flex: 1,
        color: theme.colors.textMuted,
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        alignItems: 'flex-start', // Align for multiline dismissal
    },
    playerName: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    dismissal: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontStyle: 'italic',
    },
    statText: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        alignSelf: 'center',
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 10,
    },
});
