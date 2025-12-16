import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import TeamRow from './TeamRow';
import PositionBadge from './PositionBadge';

export default function StandingsTable({
    teams = [],
    sport = 'cricket',
    league = 'IPL',
    onTeamPress
}) {
    const [sortBy, setSortBy] = useState('position');
    const [sortOrder, setSortOrder] = useState('asc');

    // Define columns based on sport
    const getColumns = () => {
        switch (sport) {
            case 'cricket':
                return [
                    { key: 'position', label: 'Pos', width: 50, sortable: true },
                    { key: 'team', label: 'Team', width: 180, sortable: false },
                    { key: 'played', label: 'P', width: 50, sortable: true },
                    { key: 'won', label: 'W', width: 50, sortable: true },
                    { key: 'lost', label: 'L', width: 50, sortable: true },
                    { key: 'nrr', label: 'NRR', width: 70, sortable: true },
                    { key: 'points', label: 'Pts', width: 60, sortable: true },
                ];
            case 'football':
                return [
                    { key: 'position', label: 'Pos', width: 50, sortable: true },
                    { key: 'team', label: 'Team', width: 180, sortable: false },
                    { key: 'played', label: 'P', width: 50, sortable: true },
                    { key: 'won', label: 'W', width: 50, sortable: true },
                    { key: 'drawn', label: 'D', width: 50, sortable: true },
                    { key: 'lost', label: 'L', width: 50, sortable: true },
                    { key: 'gd', label: 'GD', width: 60, sortable: true },
                    { key: 'points', label: 'Pts', width: 60, sortable: true },
                ];
            case 'basketball':
                return [
                    { key: 'position', label: 'Pos', width: 50, sortable: true },
                    { key: 'team', label: 'Team', width: 180, sortable: false },
                    { key: 'played', label: 'P', width: 50, sortable: true },
                    { key: 'won', label: 'W', width: 50, sortable: true },
                    { key: 'lost', label: 'L', width: 50, sortable: true },
                    { key: 'winPct', label: 'Win%', width: 70, sortable: true },
                    { key: 'streak', label: 'Streak', width: 70, sortable: false },
                ];
            default:
                return [
                    { key: 'position', label: 'Pos', width: 50, sortable: true },
                    { key: 'team', label: 'Team', width: 180, sortable: false },
                    { key: 'played', label: 'P', width: 50, sortable: true },
                    { key: 'won', label: 'W', width: 50, sortable: true },
                    { key: 'lost', label: 'L', width: 50, sortable: true },
                    { key: 'points', label: 'Pts', width: 60, sortable: true },
                ];
        }
    };

    const columns = getColumns();

    const handleSort = (columnKey) => {
        if (columnKey === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(columnKey);
            setSortOrder('asc');
        }
    };

    const sortedTeams = [...teams].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{league} Standings</Text>
                <View style={styles.headerBadge}>
                    <Ionicons name="trophy" size={14} color={theme.colors.primary} />
                    <Text style={styles.headerBadgeText}>{teams.length} Teams</Text>
                </View>
            </View>

            {/* Table */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        {columns.map(column => (
                            <TouchableOpacity
                                key={column.key}
                                style={[styles.headerCell, { width: column.width }]}
                                onPress={() => column.sortable && handleSort(column.key)}
                                disabled={!column.sortable}
                            >
                                <Text style={styles.headerCellText}>{column.label}</Text>
                                {column.sortable && sortBy === column.key && (
                                    <Ionicons
                                        name={sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'}
                                        size={14}
                                        color={theme.colors.primary}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Table Rows */}
                    {sortedTeams.map((team, index) => (
                        <TeamRow
                            key={team.id || index}
                            team={team}
                            columns={columns}
                            sport={sport}
                            onPress={() => onTeamPress && onTeamPress(team)}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <PositionBadge position={1} size="small" />
                    <Text style={styles.legendText}>Champions League</Text>
                </View>
                <View style={styles.legendItem}>
                    <PositionBadge position={5} size="small" />
                    <Text style={styles.legendText}>Europa League</Text>
                </View>
                <View style={styles.legendItem}>
                    <PositionBadge position={18} size="small" />
                    <Text style={styles.legendText}>Relegation</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: theme.fonts?.bold || 'System',
        color: theme.colors.text,
    },
    headerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 4,
    },
    headerBadgeText: {
        fontSize: 12,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.primary,
    },
    table: {
        minWidth: '100%',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerCell: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    headerCellText: {
        fontSize: 12,
        fontFamily: theme.fonts?.bold || 'System',
        color: theme.colors.textMuted,
        textTransform: 'uppercase',
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendText: {
        fontSize: 12,
        fontFamily: theme.fonts?.regular || 'System',
        color: theme.colors.textMuted,
    },
});
