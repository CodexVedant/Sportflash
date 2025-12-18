import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { theme } from '../../utils/theme';
import PositionBadge from './PositionBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TeamRow({ team, columns, isFollowed, onPress }) {

    const renderValue = (key) => {
        const value = team[key];

        if (key === 'position') return <PositionBadge position={value} />;

        if (key === 'team') {
            return (
                <View style={styles.teamCell}>
                    {team.logo ? (
                        <Image source={{ uri: team.logo }} style={styles.logo} />
                    ) : (
                        <View style={styles.logoFallback}>
                            <Text style={styles.logoText}>{team.name?.[0]}</Text>
                        </View>
                    )}
                    <View>
                        <Text style={styles.teamName} numberOfLines={1}>{team.name}</Text>
                        {isFollowed && <Text style={styles.followed}>Following</Text>}
                    </View>
                </View>
            );
        }

        return <Text style={styles.text}>{value}</Text>;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.row, isFollowed && styles.followedRow]}
            activeOpacity={0.7}
        >
            {columns.map(col => (
                <View
                    key={col.key}
                    style={[
                        styles.cell,
                        { width: col.width },
                        col.key === 'team' ? styles.alignLeft : styles.alignCenter
                    ]}
                >
                    {renderValue(col.key)}
                </View>
            ))}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingHorizontal: SCREEN_WIDTH < 768 ? theme.spacing.sm : theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    cell: {
        justifyContent: 'center',
    },
    alignLeft: {
        alignItems: 'flex-start',
    },
    alignCenter: {
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        color: theme.colors.text,
    },
    teamCell: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logo: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    logoFallback: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    teamName: {
        fontSize: 14,
        color: theme.colors.text,
    },
    followed: {
        fontSize: 10,
        color: theme.colors.primary,
    },
    followedRow: {
        backgroundColor: 'rgba(59,130,246,0.08)',
    },
});
