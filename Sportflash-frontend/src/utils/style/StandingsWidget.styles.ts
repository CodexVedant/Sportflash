import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 8,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.02)',
        alignItems: 'center',
    },
    highlightedRow: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    th: {
        color: theme.colors.textMuted,
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '600',
    },
    td: {
        color: theme.colors.textMuted,
        fontSize: 12,
        textAlign: 'center',
    },
    tdName: {
        color: theme.colors.text,
        fontSize: 13,
        fontWeight: '500',
    },
    highlightText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
    }
});
