import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: theme.spacing.sm,
        letterSpacing: 1,
    },
    emptyContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    playerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerNumber: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        width: 25,
    },
    playerName: {
        color: theme.colors.text,
        fontSize: 14,
    },
    captainBadge: {
        color: theme.colors.secondary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    playerPosition: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
    playerSubInfo: {
        color: theme.colors.textMuted,
        fontSize: 11,
        marginTop: 2,
        fontStyle: 'italic',
    },
});
