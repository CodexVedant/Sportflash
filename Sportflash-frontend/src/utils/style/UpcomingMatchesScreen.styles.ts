import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textMuted,
    },
    dateScrollContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        maxHeight: 90, // Limit height to prevent layout jumps
    },
    dateItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        marginRight: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surface,
        minWidth: 70,
    },
    dateItemActive: {
        backgroundColor: theme.colors.primary,
    },
    dateDay: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginBottom: 4,
    },
    dateDayActive: {
        color: '#FFFFFF',
    },
    dateNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    dateNumberActive: {
        color: '#FFFFFF',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        gap: theme.spacing.sm,
        maxHeight: 60,
    },
    filterChip: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.round,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterChipText: {
        fontSize: 14,
        color: theme.colors.textMuted,
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    dateSection: {
        marginBottom: theme.spacing.xl,
    },
    dateSectionHeader: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    dateSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    matchesList: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
    },
    matchCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
    },
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    leagueName: {
        fontSize: 12,
        color: theme.colors.textMuted,
        fontWeight: '600',
        textTransform: 'uppercase',
        flex: 1,
    },
    matchTime: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    matchContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    teamContainer: {
        flex: 1,
        alignItems: 'center',
    },
    teamLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: theme.spacing.xs,
    },
    teamName: {
        fontSize: 14,
        color: theme.colors.text,
        fontWeight: '600',
        textAlign: 'center',
    },
    vsContainer: {
        paddingHorizontal: theme.spacing.lg,
        alignItems: 'center',
    },
    vsText: {
        fontSize: 12,
        color: theme.colors.textMuted,
        fontWeight: 'bold',
    },
    countdownBadge: {
        backgroundColor: 'rgba(255,107,107,0.15)',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
        marginTop: theme.spacing.xs,
    },
    countdownText: {
        fontSize: 11,
        color: '#FF6B6B',
        fontWeight: '600',
    },
    sportBadge: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    sportBadgeText: {
        fontSize: 10,
        color: theme.colors.textMuted,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
        marginTop: 50,
    },
    emptyIcon: {
        marginBottom: theme.spacing.md,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: theme.colors.textMuted,
        textAlign: 'center',
        lineHeight: 20,
    },
});
