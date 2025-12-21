import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { BlurView } from 'expo-blur';
import DatePicker from './DatePicker';
import SportFilter from './SportFilter';
import StatusFilter from './StatusFilter';

export default function FilterPanel({ visible, onClose, onApply, initialFilters = {} }) {
    const [filters, setFilters] = useState({
        sport: initialFilters.sport || 'all',
        status: initialFilters.status || 'all',
        league: initialFilters.league || 'all',
        dateRange: initialFilters.dateRange || { start: null, end: null },
        ...initialFilters,
    });

    const leagues = [
        { id: 'all', name: 'All Leagues', icon: 'globe-outline' },
        { id: 'ipl', name: 'IPL', icon: 'baseball-outline' },
        { id: 'premier-league', name: 'Premier League', icon: 'football-outline' },
        { id: 'nba', name: 'NBA', icon: 'basketball-outline' },
        { id: 'la-liga', name: 'La Liga', icon: 'football-outline' },
        { id: 'champions-league', name: 'Champions League', icon: 'trophy-outline' },
        { id: 'world-cup', name: 'World Cup', icon: 'trophy-outline' },
    ];

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters = {
            sport: 'all',
            status: 'all',
            league: 'all',
            dateRange: { start: null, end: null },
        };
        setFilters(resetFilters);
    };

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const hasActiveFilters = () => {
        return (
            filters.sport !== 'all' ||
            filters.status !== 'all' ||
            filters.league !== 'all' ||
            filters.dateRange.start !== null ||
            filters.dateRange.end !== null
        );
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

                {/* Click outside to close */}
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* Filter Panel */}
                <View style={styles.panel}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Ionicons name="options-outline" size={24} color={theme.colors.text} />
                            <Text style={styles.headerTitle}>Filters</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Sport Filter */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>SPORT</Text>
                            <SportFilter
                                selected={filters.sport}
                                onSelect={(sport) => updateFilter('sport', sport)}
                            />
                        </View>

                        {/* Status Filter */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>STATUS</Text>
                            <StatusFilter
                                selected={filters.status}
                                onSelect={(status) => updateFilter('status', status)}
                            />
                        </View>

                        {/* League Filter */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>LEAGUE</Text>
                            <View style={styles.leagueGrid}>
                                {leagues.map(league => (
                                    <TouchableOpacity
                                        key={league.id}
                                        style={[
                                            styles.leagueChip,
                                            filters.league === league.id && styles.leagueChipActive
                                        ]}
                                        onPress={() => updateFilter('league', league.id)}
                                    >
                                        <Ionicons
                                            name={league.icon}
                                            size={18}
                                            color={filters.league === league.id ? '#fff' : theme.colors.textMuted}
                                        />
                                        <Text style={[
                                            styles.leagueText,
                                            filters.league === league.id && styles.leagueTextActive
                                        ]}>
                                            {league.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Date Range */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>DATE RANGE</Text>
                            <DatePicker
                                dateRange={filters.dateRange}
                                onDateChange={(range) => updateFilter('dateRange', range)}
                            />
                        </View>
                    </ScrollView>

                    {/* Footer Actions */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={handleReset}
                            disabled={!hasActiveFilters()}
                        >
                            <Ionicons name="refresh-outline" size={20} color={hasActiveFilters() ? theme.colors.primary : theme.colors.textMuted} />
                            <Text style={[
                                styles.resetText,
                                !hasActiveFilters() && styles.resetTextDisabled
                            ]}>
                                Reset
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyText}>Apply Filters</Text>
                            <Ionicons name="checkmark" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
