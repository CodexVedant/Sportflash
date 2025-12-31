import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        position: 'relative',
        marginBottom: theme.spacing.md,
    },
    solid: {
        backgroundColor: theme.colors.surface,
    },
    content: {
        padding: theme.spacing.md,
    }
});
