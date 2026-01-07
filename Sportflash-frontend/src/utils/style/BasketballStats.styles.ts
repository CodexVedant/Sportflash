import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        marginBottom: theme.spacing.sm,
    },
    headerText: {
        flex: 1,
        color: theme.colors.textMuted,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.02)',
    },
    teamName: {
        color: theme.colors.text,
        fontSize: 13,
        fontWeight: '600',
    },
    scoreText: {
        flex: 1,
        color: theme.colors.text,
        textAlign: 'center',
        fontSize: 13,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
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
    emptyText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 10,
    },
});
