import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuBtn: {
        marginRight: 16,
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: 20,
        fontFamily: theme.fonts.bold,
    },
    content: {
        padding: theme.spacing.lg,
    },
    subtitle: {
        color: theme.colors.textMuted,
        fontSize: 16,
        fontFamily: theme.fonts.medium,
    },
    backBtn: {
        marginRight: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        opacity: 0.7,
    },
    emptyText: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
    },
    emptySubText: {
        color: theme.colors.textMuted,
        marginTop: 8,
    },
    newsItem: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: theme.borderRadius.md,
        padding: 8,
        alignItems: 'center',
    },
    newsImagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    newsContent: {
        flex: 1,
    },
    title: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    time: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
    removeBtn: {
        padding: 8,
    }
});
