import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import TeamRow from './TeamRow';
import PositionBadge from './PositionBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function StandingsTable({
    teams = [],
    sport = 'cricket',
    league = 'IPL',
    followedTeams = [],
    onTeamPress
}) {
    const [sortBy, setSortBy] = useState('position');
    const [sortOrder, setSortOrder] = useState('asc');

    // Define columns based on sport with responsive widths
    const getColumns = () => {
        const isMobile = SCREEN_WIDTH < 768;
        const teamWidth = isMobile ? 140 : 180;
        const smallColWidth = isMobile ? 35 : 40;
        const mediumColWidth = isMobile ? 50 : 60;
        const largeColWidth = isMobile ? 75 : 90;

        switch (sport) {
            case 'cricket':
                return [
                    { key: 'position', label: 'Pos', width: 45, sortable: true },
                    { key: 'team', label: 'Team', width: teamWidth, sortable: false },
                    { key: 'played', label: 'P', width: smallColWidth, sortable: true },
                    { key: 'won', label: 'W', width: smallColWidth, sortable: true },
                    { key: 'lost', label: 'L', width: smallColWidth, sortable: true },
                    { key: 'for', label: 'For', width: largeColWidth, sortable: false },
                    { key: 'against', label: 'Ag', width: largeColWidth, sortable: false },
                    { key: 'nrr', label: 'NRR', width: mediumColWidth, sortable: true },
                    { key: 'points', label: 'Pts', width: 45, sortable: true },
                ];
            case 'football':
                return [
                    { key: 'position', label: 'Pos', width: 45, sortable: true },
                    { key: 'team', label: 'Team', width: teamWidth, sortable: false },
                    { key: 'played', label: 'P', width: smallColWidth, sortable: true },
                    { key: 'won', label: 'W', width: smallColWidth, sortable: true },
                    { key: 'drawn', label: 'D', width: smallColWidth, sortable: true },
                    { key: 'lost', label: 'L', width: smallColWidth, sortable: true },
                    { key: 'gf', label: 'GF', width: smallColWidth, sortable: true },
                    { key: 'ga', label: 'GA', width: smallColWidth, sortable: true },
                    { key: 'gd', label: 'GD', width: 45, sortable: true },
                    { key: 'points', label: 'Pts', width: 45, sortable: true },
                ];
            case 'basketball':
                return [
                    { key: 'position', label: 'Pos', width: 45, sortable: true },
                    { key: 'team', label: 'Team', width: teamWidth, sortable: false },
                    { key: 'played', label: 'P', width: smallColWidth, sortable: true },
                    { key: 'won', label: 'W', width: smallColWidth, sortable: true },
                    { key: 'lost', label: 'L', width: smallColWidth, sortable: true },
                    { key: 'winPct', label: 'Win%', width: mediumColWidth, sortable: true },
                    { key: 'ppg', label: 'PPG', width: mediumColWidth, sortable: true },
                    { key: 'streak', label: 'Streak', width: mediumColWidth, sortable: false },
                ];
            default:
                return [
                    { key: 'position', label: 'Pos', width: 45, sortable: true },
                    { key: 'team', label: 'Team', width: teamWidth, sortable: false },
                    { key: 'played', label: 'P', width: smallColWidth, sortable: true },
                    { key: 'won', label: 'W', width: smallColWidth, sortable: true },
                    { key: 'lost', label: 'L', width: smallColWidth, sortable: true },
                    { key: 'points', label: 'Pts', width: 45, sortable: true },
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

    const renderHeader = () => (
        <View style={styles.tableHeader}>
            {columns.map(column => (
                <TouchableOpacity
                    key={column.key}
                    style={[
                        styles.headerCell,
                        { width: column.width },
                        column.key === 'team' ? styles.alignLeft : styles.alignCenter
                    ]}
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
    );

    const renderLegend = () => (
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
    );

    return (
        <View style={styles.container}>
            {/* Header Title Section (Outside Horizontal scroll) */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{league} Standings</Text>
                <View style={styles.headerBadge}>
                    <Ionicons name="trophy" size={14} color={theme.colors.primary} />
                    <Text style={styles.headerBadgeText}>{teams.length} Teams</Text>
                </View>
            </View>

            {/* Horizontal Scroll for Table Content */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tableContainer}>
                    {renderHeader()}
                    <FlatList
                        data={sortedTeams}
                        keyExtractor={(item) => (item.id || item.position).toString()}
                        renderItem={({ item }) => (
                            <TeamRow
                                team={item}
                                columns={columns}
                                sport={sport}
                                isFollowed={followedTeams.includes(item.id)}
                                onPress={() => onTeamPress && onTeamPress(item)}
                            />
                        )}
                        ListFooterComponent={renderLegend}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexShrink: 1,
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
        paddingHorizontal: SCREEN_WIDTH < 768 ? theme.spacing.sm : theme.spacing.md,
        paddingVertical: theme.spacing.sm,
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
    tableContainer: {
        flex: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1E293B', // Same as background to prevent flicker when sticking
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: SCREEN_WIDTH < 768 ? theme.spacing.sm : theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerCell: {
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'center',
    },
    alignLeft: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    alignCenter: {
        alignItems: 'center',
        justifyContent: 'center',
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
        padding: theme.spacing.md,
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: '#1E293B',
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
