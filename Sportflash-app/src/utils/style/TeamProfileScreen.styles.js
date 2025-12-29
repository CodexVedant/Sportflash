import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    hero: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    teamNameHero: {
        color: theme.colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    countryText: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    tabItem: {
        marginRight: theme.spacing.xl,
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabItem: {
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    activeTabText: {
        color: theme.colors.primary,
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    cardTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
        marginBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        paddingBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        color: theme.colors.textMuted,
    },
    value: {
        color: theme.colors.text,
        fontWeight: '500',
    },
    formRow: {
        flexDirection: 'row',
        gap: 8,
    },
    formBadge: {
        width: 30,
        height: 30,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    placeholderContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    placeholderText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
    },
    tabContent: {
        // padding handled by scrollview content container
    }
});
