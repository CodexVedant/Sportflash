import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        padding: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    unreadContainer: {
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.text,
        marginBottom: 4,
        lineHeight: 20,
    },
    message: {
        fontSize: 13,
        fontFamily: theme.fonts?.regular || 'System',
        color: theme.colors.textMuted,
        lineHeight: 18,
        marginBottom: 6,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    time: {
        fontSize: 12,
        fontFamily: theme.fonts?.regular || 'System',
        color: theme.colors.textMuted,
    },
    unreadDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 4,
        marginLeft: 8,
    },
    actionButton: {
        padding: 6,
    },
});
