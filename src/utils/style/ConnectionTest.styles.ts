import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: theme.sizes.display,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: theme.sizes.md,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.xl,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.sizes.lg,
        fontWeight: '600',
        color: theme.colors.text,
        marginLeft: theme.spacing.sm,
    },
    statusCard: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: theme.sizes.md,
        color: theme.colors.textMuted,
    },
    statusValue: {
        fontSize: theme.sizes.md,
        fontWeight: 'bold',
    },
    dataCard: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    dataLabel: {
        fontSize: theme.sizes.sm,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.xs,
    },
    dataValue: {
        fontSize: theme.sizes.sm,
        color: theme.colors.text,
        fontFamily: 'monospace',
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonSecondary: {
        backgroundColor: theme.colors.secondary,
    },
    buttonText: {
        color: theme.colors.text,
        fontSize: theme.sizes.md,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    buttonHalf: {
        flex: 1,
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    infoText: {
        flex: 1,
        fontSize: theme.sizes.sm,
        color: theme.colors.primary,
        marginLeft: theme.spacing.sm,
    },
    configSection: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    configTitle: {
        fontSize: theme.sizes.md,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    configText: {
        fontSize: theme.sizes.sm,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.xs,
        fontFamily: 'monospace',
    },
});
