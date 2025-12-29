import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    panel: {
        backgroundColor: '#1E293B',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: theme.fonts?.bold || 'System',
        color: theme.colors.text,
    },
    headerBadge: {
        backgroundColor: '#EF4444',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 24,
        alignItems: 'center',
    },
    headerBadgeText: {
        fontSize: 12,
        fontFamily: theme.fonts?.bold || 'System',
        color: '#fff',
    },
    closeButton: {
        padding: 4,
    },
    filterContainer: {
        padding: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    filterTabs: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    filterTabActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterTabText: {
        fontSize: 14,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.textMuted,
    },
    filterTabTextActive: {
        color: '#fff',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionText: {
        fontSize: 13,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.primary,
    },
    actionTextDanger: {
        color: '#EF4444',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    emptyState: {
        minHeight: 300,
    },
});
