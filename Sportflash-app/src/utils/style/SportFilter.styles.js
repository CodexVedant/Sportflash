import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        gap: 10,
    },
    sportCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    sportCardActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: theme.colors.primary,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconContainerActive: {
        backgroundColor: theme.colors.primary,
    },
    sportName: {
        flex: 1,
        fontSize: 16,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.text,
    },
    sportNameActive: {
        color: theme.colors.primary,
        fontFamily: theme.fonts?.bold || 'System',
    },
    checkmark: {
        marginLeft: 8,
    },
});
