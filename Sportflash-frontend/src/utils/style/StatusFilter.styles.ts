import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        gap: 10,
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    statusCardActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: theme.colors.primary,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    statusName: {
        fontSize: 16,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.text,
        marginBottom: 2,
    },
    statusNameActive: {
        color: theme.colors.primary,
        fontFamily: theme.fonts?.bold || 'System',
    },
    statusDescription: {
        fontSize: 13,
        fontFamily: theme.fonts?.regular || 'System',
        color: theme.colors.textMuted,
    },
});
