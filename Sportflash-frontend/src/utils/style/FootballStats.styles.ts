import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    statLabel: {
        color: theme.colors.textMuted,
        fontSize: 12,
        flex: 1,
        textAlign: 'center',
    },
    statValue: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 14,
        flex: 1,
        textAlign: 'center',
    },
    eventRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    eventTime: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        width: 30,
    },
    eventDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    eventText: {
        color: theme.colors.text,
        fontSize: 13,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 10,
    },
});
