import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingBottom: theme.spacing.xl,
    },
    section: {
        padding: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: theme.borderRadius.md,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
    },
});
