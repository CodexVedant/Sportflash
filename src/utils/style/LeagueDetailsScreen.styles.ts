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
    backBtn: {
        // Placeholder for back button specific styling if needed
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    hero: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    logoPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    leagueName: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    seasonText: {
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
    },
    tabContent: {
        padding: theme.spacing.lg,
    },
    placeholderContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    placeholderText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
    }
});
