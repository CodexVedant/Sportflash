import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({
    card: {
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: theme.sizes.xs,
        fontWeight: 'bold',
    },
    league: {
        color: theme.colors.textMuted,
        fontSize: theme.sizes.xs,
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    team: {
        alignItems: 'center',
        flex: 1,
    },
    logoPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    teamName: {
        color: '#FFFFFF', // Force white for visibility on dark gradient
        fontWeight: 'bold',
        fontSize: 16, // theme.sizes.md,
        marginBottom: 4,
    },
    score: {
        color: '#FFFFFF', // Force white
        fontSize: 14,
        opacity: 0.9,
    },
    subText: {
        color: theme.colors.textMuted,
        fontSize: 10,
        marginTop: 2,
    },
    centerInfo: {
        alignItems: 'center',
        width: 80,
    },
    vs: {
        color: theme.colors.textMuted,
        fontSize: 20,
        fontWeight: 'bold',
        opacity: 0.5,
    },
    liveScore: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    timer: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    footer: {
        alignItems: 'center',
        marginTop: 8,
    },
    footerText: {
        fontSize: 12,
        opacity: 0.9,
    }
});
