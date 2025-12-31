import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    readAll: {
        color: theme.colors.primary,
        fontSize: 14,
    },
    listContent: {
        padding: theme.spacing.md,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    unreadItem: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
    },
    iconBox: {
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    title: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    message: {
        color: theme.colors.textMuted,
        fontSize: 14,
        marginBottom: 4,
    },
    time: {
        color: theme.colors.textMuted,
        fontSize: 10,
        opacity: 0.7,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
        marginLeft: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: theme.colors.textMuted,
        marginTop: 16,
    }
});
