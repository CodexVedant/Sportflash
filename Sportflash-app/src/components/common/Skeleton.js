import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { theme } from '@utils/theme';

// Shimmer animation component
const ShimmerPlaceholder = ({ width, height, borderRadius = 8, style }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [animatedValue]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    return (
        <View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    overflow: 'hidden',
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            />
        </View>
    );
};

// Match Card Skeleton
export const MatchCardSkeleton = () => {
    return (
        <View style={styles.matchCard}>
            {/* League Badge */}
            <View style={styles.matchHeader}>
                <ShimmerPlaceholder width={60} height={20} borderRadius={10} />
                <ShimmerPlaceholder width={80} height={20} borderRadius={10} />
            </View>

            {/* Teams */}
            <View style={styles.teamsContainer}>
                {/* Home Team */}
                <View style={styles.teamRow}>
                    <ShimmerPlaceholder width={40} height={40} borderRadius={20} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <ShimmerPlaceholder width="80%" height={16} borderRadius={4} />
                        <View style={{ height: 6 }} />
                        <ShimmerPlaceholder width="60%" height={12} borderRadius={4} />
                    </View>
                    <ShimmerPlaceholder width={40} height={32} borderRadius={8} />
                </View>

                {/* VS Divider */}
                <View style={styles.vsDivider}>
                    <ShimmerPlaceholder width={30} height={30} borderRadius={15} />
                </View>

                {/* Away Team */}
                <View style={styles.teamRow}>
                    <ShimmerPlaceholder width={40} height={40} borderRadius={20} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <ShimmerPlaceholder width="80%" height={16} borderRadius={4} />
                        <View style={{ height: 6 }} />
                        <ShimmerPlaceholder width="60%" height={12} borderRadius={4} />
                    </View>
                    <ShimmerPlaceholder width={40} height={32} borderRadius={8} />
                </View>
            </View>

            {/* Footer */}
            <View style={styles.matchFooter}>
                <ShimmerPlaceholder width={100} height={14} borderRadius={4} />
                <ShimmerPlaceholder width={60} height={14} borderRadius={4} />
            </View>
        </View>
    );
};

// News Card Skeleton
export const NewsCardSkeleton = () => {
    return (
        <View style={styles.newsCard}>
            <ShimmerPlaceholder width="100%" height={180} borderRadius={12} />
            <View style={{ padding: 16 }}>
                <ShimmerPlaceholder width="90%" height={18} borderRadius={4} />
                <View style={{ height: 8 }} />
                <ShimmerPlaceholder width="70%" height={18} borderRadius={4} />
                <View style={{ height: 12 }} />
                <ShimmerPlaceholder width="100%" height={14} borderRadius={4} />
                <View style={{ height: 6 }} />
                <ShimmerPlaceholder width="80%" height={14} borderRadius={4} />
                <View style={{ height: 12 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ShimmerPlaceholder width={80} height={12} borderRadius={4} />
                    <ShimmerPlaceholder width={60} height={12} borderRadius={4} />
                </View>
            </View>
        </View>
    );
};

// Team Card Skeleton
export const TeamCardSkeleton = () => {
    return (
        <View style={styles.teamCard}>
            <ShimmerPlaceholder width={60} height={60} borderRadius={30} />
            <View style={{ marginTop: 12, alignItems: 'center' }}>
                <ShimmerPlaceholder width={100} height={16} borderRadius={4} />
                <View style={{ height: 6 }} />
                <ShimmerPlaceholder width={80} height={12} borderRadius={4} />
            </View>
        </View>
    );
};

// Player Card Skeleton
export const PlayerCardSkeleton = () => {
    return (
        <View style={styles.playerCard}>
            <ShimmerPlaceholder width={80} height={80} borderRadius={40} />
            <View style={{ flex: 1, marginLeft: 16 }}>
                <ShimmerPlaceholder width="70%" height={18} borderRadius={4} />
                <View style={{ height: 8 }} />
                <ShimmerPlaceholder width="50%" height={14} borderRadius={4} />
                <View style={{ height: 8 }} />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <ShimmerPlaceholder width={60} height={12} borderRadius={4} />
                    <ShimmerPlaceholder width={60} height={12} borderRadius={4} />
                </View>
            </View>
        </View>
    );
};

// List Skeleton (multiple items)
export const SkeletonList = ({ type = 'match', count = 3 }) => {
    const SkeletonComponent = {
        match: MatchCardSkeleton,
        news: NewsCardSkeleton,
        team: TeamCardSkeleton,
        player: PlayerCardSkeleton,
    }[type] || MatchCardSkeleton;

    return (
        <View style={styles.listContainer}>
            {Array.from({ length: count }).map((_, index) => (
                <View key={index} style={{ marginBottom: 16 }}>
                    <SkeletonComponent />
                </View>
            ))}
        </View>
    );
};

// Generic Skeleton
export const Skeleton = ({ width, height, borderRadius, style }) => {
    return <ShimmerPlaceholder width={width} height={height} borderRadius={borderRadius} style={style} />;
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        position: 'relative',
    },
    shimmer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    matchCard: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    teamsContainer: {
        gap: 12,
    },
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vsDivider: {
        alignItems: 'center',
        marginVertical: 8,
    },
    matchFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    newsCard: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    teamCard: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        minWidth: 140,
    },
    playerCard: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    listContainer: {
        padding: 16,
    },
});

export default Skeleton;
