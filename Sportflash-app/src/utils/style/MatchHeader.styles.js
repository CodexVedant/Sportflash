import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    scoreHero: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.xl,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    teamContainer: {
        alignItems: 'center',
        flex: 1,
    },
    logoLg: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    teamNameHero: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16, // Slightly smaller to prevent wrap
        textAlign: 'center',
    },
    // Football/Basketball Center Styles
    centerScoreBoard: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        flex: 1.5, // Give more space to center
    },
    dateText: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginBottom: 8,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    bigScore: {
        fontSize: 42,
        fontWeight: '900', // Heavy font
        color: '#FF2E63', // Neon Red/Pink for score
        textShadowColor: 'rgba(255, 46, 99, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    scoreDash: {
        fontSize: 32,
        color: theme.colors.textMuted,
        fontWeight: 'bold',
    },
    statusBadge: {
        color: '#FF2E63',
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
    },

    // Cricket Specific Styles
    cricketCenterBoard: {
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 35,
    },
    teamScore: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
    },
    vsText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});
