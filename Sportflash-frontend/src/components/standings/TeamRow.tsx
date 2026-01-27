import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { theme } from '@utils/theme';
import PositionBadge from './PositionBadge';
import { styles } from '@utils/style/TeamRow.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Column {
    key: string;
    label: string;
    width: number;
    sortable: boolean;
}

interface TeamRowProps {
    team: any;
    columns: Column[];
    isFollowed: boolean;
    onPress?: () => void;
    sport?: string;
}

export default function TeamRow({ team, columns, isFollowed, onPress }: TeamRowProps) {

    const renderValue = (key: string) => {
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
