import { StyleSheet, Platform } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: theme.sizes.xl,
        fontFamily: theme.fonts.display,
        color: theme.colors.text,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconBtn: {
        padding: 8,
    },
    menuBtn: {
        marginRight: 16,
    },
    tabsContainer: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        gap: 12,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    activeTab: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    tabText: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
    },
    activeTabText: {
        color: '#fff',
    },
    listContent: {
        padding: theme.spacing.lg,
        paddingBottom: 100,
        ...(Platform.OS === 'web' && {
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
        }),
    },
    sectionHeader: {
        backgroundColor: theme.colors.surface,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary
    },
    sectionTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 14
    },
    scrollContainer: {
        flex: 1,
        ...(Platform.OS === 'web' && {
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
        }),
    }
});
