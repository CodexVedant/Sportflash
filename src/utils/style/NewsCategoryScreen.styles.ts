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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    newsItem: {
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
    },
    newsImagePlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    newsContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    category: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    dot: {
        color: theme.colors.textMuted,
        marginHorizontal: 6,
        fontSize: 12,
    },
    time: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
    title: {
        color: theme.colors.text,
        fontSize: 16,
        fontFamily: theme.fonts.medium,
        lineHeight: 22,
    },
});
