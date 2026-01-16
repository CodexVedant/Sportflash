import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuBtn: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: theme.colors.textMuted,
    },
    listContent: {
        padding: 16,
    },
    row: {
        justifyContent: 'space-between',
    },
    leagueCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: 16,
        margin: 8,
        maxWidth: '48%',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    leagueCardHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    leagueLogoContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    leagueLogoPlaceholder: {
        fontSize: 24,
    },
    leagueInfo: {
        flex: 1,
    },
    leagueName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    leagueMetadata: {
        flexDirection: 'column',
    },
    countryName: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginBottom: 2,
    },
    season: {
        fontSize: 11,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    leagueCardFooter: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 12,
        marginTop: 8,
    },
    viewDetailsText: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '500',
        textAlign: 'center',
    },
});
