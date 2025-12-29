import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({
    card: {
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: `${theme.colors.basketball}66`,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    badgeContainer: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.textMuted,
    },
    league: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.xs,
        flex: 1,
        textAlign: 'right',
        marginLeft: 8
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingRight: 8
    },
    quartersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 140,
    },
    headerText: {
        fontSize: 10,
        color: theme.colors.textMuted,
        width: 30,
        textAlign: 'center',
    },
    headerTextTotal: {
        fontSize: 10,
        color: theme.colors.textMuted,
        width: 40,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    teamInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1.5,
        gap: 8,
    },
    teamName: {
        color: theme.colors.text,
        fontWeight: '600',
        fontSize: 14,
        flex: 1,
    },
    quartersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 140,
    },
    qScore: {
        color: theme.colors.textMuted,
        fontSize: 12,
        width: 30,
        textAlign: 'center',
    },
    totalScore: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 16,
        width: 40,
        textAlign: 'center',
    },
    footer: {
        marginTop: 12,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingTop: 8
    },
    footerText: {
        fontSize: 10,
        color: theme.colors.basketball,
        opacity: 0.8
    }
});
