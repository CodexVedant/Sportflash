import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        gap: 16,
    },
    quickButtons: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    quickButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    quickButtonText: {
        fontSize: 13,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.textMuted,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dateContainer: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 12,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.textMuted,
        marginBottom: 8,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 8,
    },
    dateText: {
        fontSize: 14,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.text,
        flex: 1,
    },
    separator: {
        marginTop: 20,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 6,
    },
    clearText: {
        fontSize: 14,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.textMuted,
    },
});
