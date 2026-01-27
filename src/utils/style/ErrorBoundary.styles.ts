import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: theme.colors.background,
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: theme.fonts?.bold || 'System',
        color: theme.colors.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: theme.fonts?.regular || 'System',
        color: theme.colors.textMuted,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
        marginBottom: 24,
    },
    errorDetails: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        maxWidth: 350,
    },
    errorText: {
        fontSize: 13,
        fontFamily: 'monospace',
        color: '#EF4444',
        textAlign: 'left',
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 24,
        gap: 8,
    },
    retryText: {
        fontSize: 16,
        fontFamily: theme.fonts?.medium || 'System',
        color: '#fff',
    },
    statusBadge: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        marginBottom: 24,
    },
    statusText: {
        fontSize: 14,
        fontFamily: theme.fonts?.medium || 'System',
        color: '#F59E0B',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        gap: 12,
        margin: 16,
    },
    messageText: {
        flex: 1,
        fontSize: 14,
        fontFamily: theme.fonts?.regular || 'System',
        color: theme.colors.text,
        lineHeight: 20,
    },
    dismissButton: {
        padding: 4,
    },
});
