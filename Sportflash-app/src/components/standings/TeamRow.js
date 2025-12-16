import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../../utils/theme';
import PositionBadge from './PositionBadge';

export default function TeamRow({ team, columns, sport, onPress }) {
    const renderCellValue = (columnKey) => {
        const value = team[columnKey];

        switch (columnKey) {
            case 'position':
                return <PositionBadge position={value} />;

            case 'team':
                return (
                    <View style={styles.teamCell}>
                        {team.logo ? (
                            <Image source={{ uri: team.logo }} style={styles.teamLogo} />
                        ) : (
                            <View style={styles.teamLogoPlaceholder}>
                                <Text style={styles.teamLogoText}>{team.name?.charAt(0)}</Text>
                            </View>
                        )}
                        <Text style={styles.teamName} numberOfLines={1}>{team.name}</Text>
                    </View>
                );

            case 'nrr':
                return (
                    <Text style={[
                        styles.cellText,
                        value > 0 ? styles.positiveValue : value < 0 ? styles.negativeValue : null
                    ]}>
                        {value > 0 ? '+' : ''}{value?.toFixed(2)}
                    </Text>
                );

            case 'gd':
                return (
                    <Text style={[
                        styles.cellText,
                        value > 0 ? styles.positiveValue : value < 0 ? styles.negativeValue : null
                    ]}>
                        {value > 0 ? '+' : ''}{value}
                    </Text>
                );

            case 'winPct':
                return <Text style={styles.cellText}>{(value * 100).toFixed(1)}%</Text>;

            case 'streak':
                const isWinStreak = value?.startsWith('W');
                return (
                    <View style={[
                        styles.streakBadge,
                        isWinStreak ? styles.winStreakBadge : styles.loseStreakBadge
                    ]}>
                        <Text style={styles.streakText}>{value}</Text>
                    </View>
                );

            case 'points':
                return <Text style={styles.pointsText}>{value}</Text>;

            default:
                return <Text style={styles.cellText}>{value}</Text>;
        }
    };

    return (
        <TouchableOpacity
            style={styles.row}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {columns.map(column => (
                <View
                    key={column.key}
                    style={[styles.cell, { width: column.width }]}
                >
                    {renderCellValue(column.key)}
                </View>
            ))}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.03)',
        alignItems: 'center',
    },
    cell: {
        justifyContent: 'center',
    },
    teamCell: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    teamLogo: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    teamLogoPlaceholder: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    teamLogoText: {
        fontSize: 12,
        fontFamily: theme.fonts?.bold || 'System',
        color: '#fff',
    },
    teamName: {
        fontSize: 14,
        fontFamily: theme.fonts?.medium || 'System',
        color: theme.colors.text,
        flex: 1,
    },
    cellText: {
        fontSize: 14,
        fontFamily: theme.fonts?.regular || 'System',
        color: theme.colors.text,
        textAlign: 'center',
    },
    pointsText: {
        fontSize: 15,
        fontFamily: theme.fonts?.bold || 'System',
        color: theme.colors.text,
        textAlign: 'center',
    },
    positiveValue: {
        color: '#10B981',
    },
    negativeValue: {
        color: '#EF4444',
    },
    streakBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'center',
    },
    winStreakBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
    },
    loseStreakBadge: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    streakText: {
        fontSize: 12,
        fontFamily: theme.fonts?.bold || 'System',
        color: theme.colors.text,
    },
});
