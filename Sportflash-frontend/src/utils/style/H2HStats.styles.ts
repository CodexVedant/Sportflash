import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        marginBottom: 20,
    },
    header: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    headerTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 14,
    },
    list: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 8,
        padding: 8,
    },
    matchItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    matchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    date: {
        color: theme.colors.textMuted,
        fontSize: 10,
        position: 'absolute',
        top: -8,
        left: 0,
    },
    teamContainer: {
        flex: 1,
    },
    teamName: {
        color: theme.colors.textMuted,
        fontSize: 13,
    },
    highlightTeam: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    scoreContainer: {
        width: 60,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 4,
        borderRadius: 4,
        marginHorizontal: 8,
    },
    score: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 14,
    },
    conversational: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontStyle: 'italic',
    }
});
