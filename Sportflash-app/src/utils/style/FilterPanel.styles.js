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
        maxHeight: '90%',
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
    closeButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: theme.fonts?.bold || 'System',
        color: theme.colors.textMuted,
        letterSpacing: 1.2,
        marginBottom: 12,
    },
    leagueGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    leagueChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 8,
    },
    leagueChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    leagueText: {
        fontSize: 14,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.textMuted,
    },
    leagueTextActive: {
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    resetButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 8,
    },
    resetText: {
        fontSize: 16,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.primary,
    },
    resetTextDisabled: {
        color: theme.colors.textMuted,
    },
    applyButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: theme.colors.primary,
        gap: 8,
    },
    applyText: {
        fontSize: 16,
        fontFamily: theme.fonts?.medium || 'System',
        color: '#fff',
    },
});
