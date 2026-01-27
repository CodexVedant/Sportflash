import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/SharedComponents.styles';

interface SectionProps {
    title?: string;
    children: ReactNode;
    style?: ViewStyle;
}

export const Section = ({ title, children, style = {} }: SectionProps) => (
    <View style={[styles.section, style]}>
        {title && <Text style={styles.sectionTitle}>{title}</Text>}
        {children}
    </View>
);

interface EmptyDataProps {
    message?: string;
}

export const EmptyData = ({ message }: EmptyDataProps) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{message || 'No data available'}</Text>
    </View>
);

interface PlayerRowProps {
    name?: string;
    number?: string | number;
    position?: string;
    isCaptain?: boolean;
    isGoalkeeper?: boolean;
    isWicketKeeper?: boolean;
    battingStyle?: string;
    bowlingStyle?: string;
    sport: 'football' | 'cricket' | 'basketball' | string;
    onPress?: () => void;
}

export const PlayerRow = ({
    name,
    number,
    position,
    isCaptain,
    isGoalkeeper,
    isWicketKeeper,
    battingStyle,
    bowlingStyle,
    sport,
    onPress
}: PlayerRowProps) => {
    // Render badges based on sport
    const renderBadges = () => {
        if (sport === 'cricket') {
            return (
                <>
                    {isCaptain && <Text style={styles.captainBadge}> (C)</Text>}
                    {isWicketKeeper && <Text style={styles.captainBadge}> (WK)</Text>}
                </>
            );
        }

        if (sport === 'football') {
            return (
                <>
                    {isCaptain && <Text style={styles.captainBadge}> (C)</Text>}
                    {isGoalkeeper && <Text style={styles.captainBadge}> (GK)</Text>}
                </>
            );
        }

        return null;
    };

    // Render additional info based on sport
    const renderAdditionalInfo = () => {
        if (sport === 'cricket' && (battingStyle || bowlingStyle)) {
            const info = [];
            if (battingStyle) info.push(battingStyle);
            if (bowlingStyle) info.push(bowlingStyle);
            if (info.length > 0) {
                return <Text style={styles.playerSubInfo}>{info.join(' • ')}</Text>;
            }
        }
        return null;
    };

    return (
        <TouchableOpacity onPress={onPress} disabled={!onPress}>
            <View style={styles.playerRow}>
                <View style={styles.playerInfo}>
                    {!!number && <Text style={styles.playerNumber}>{number}</Text>}
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.playerName, onPress && { color: theme.colors.primary }]}>
                            {name || 'Unknown Player'}{renderBadges()}
                        </Text>
                        {renderAdditionalInfo()}
                    </View>
                </View>
                {!!position && <Text style={styles.playerPosition}>{position}</Text>}
            </View>
        </TouchableOpacity>
    );
};
