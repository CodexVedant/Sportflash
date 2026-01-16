import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: {
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    leagueName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    leagueCountry: {
        fontSize: 14,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.textMuted,
    },
    tabTextActive: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    tabContent: {
        flex: 1,
    },
    infoCard: {
        backgroundColor: theme.colors.surface,
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
    },
    viewAllText: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    infoLabel: {
        fontSize: 14,
        color: theme.colors.textMuted,
    },
    infoValue: {
        fontSize: 14,
        color: theme.colors.text,
        fontWeight: '500',
    },
    standingsPreview: {
        marginTop: 8,
    },
    standingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    position: {
        width: 30,
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    teamName: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.text,
    },
    points: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    noDataText: {
        fontSize: 14,
        color: theme.colors.textMuted,
        textAlign: 'center',
        paddingVertical: 20,
    },
    filterBar: {
        flexDirection: 'row',
        padding: 16,
        gap: 8,
        backgroundColor: theme.colors.surface,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: theme.colors.textMuted,
    },
    filterButtonTextActive: {
        color: '#FFFFFF',
    },
    matchesList: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    matchCard: {
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    matchDate: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginBottom: 8,
    },
    matchTeams: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    teamText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.text,
    },
    vsText: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginHorizontal: 12,
    },
    matchStatus: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    standingsTable: {
        padding: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    tableHeaderText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.textMuted,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    tableCell: {
        fontSize: 13,
        color: theme.colors.text,
        textAlign: 'center',
    },
});
