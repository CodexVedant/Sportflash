import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/SharedComponents.styles';

export const Section = ({ title, children, style = {} }) => (
    <View style={[styles.section, style]}>
        {title && <Text style={styles.sectionTitle}>{title}</Text>}
        {children}
    </View>
);

export const EmptyData = ({ message }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{message || 'No data available'}</Text>
    </View>
);


export const PlayerRow = ({ name, number, position, isCaptain, isGoalkeeper, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={styles.playerRow}>
            <View style={styles.playerInfo}>
                {number && <Text style={styles.playerNumber}>{number}</Text>}
                <Text style={[styles.playerName, onPress && { color: theme.colors.primary }]}>{name}</Text>
                {isCaptain && <Text style={styles.captainBadge}> (C)</Text>}
                {isGoalkeeper && <Text style={styles.captainBadge}> (GK)</Text>}
            </View>
            {position && <Text style={styles.playerPosition}>{position}</Text>}
        </View>
    </TouchableOpacity>
);
