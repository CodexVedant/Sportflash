import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/Commentary.styles';

export default function Commentary({ commentary }) {
    if (!commentary || commentary.length === 0) {
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: theme.colors.textMuted }}>Waiting for live updates...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {commentary.map((item, i) => (
                <View key={i} style={styles.commBubble}>
                    <View style={styles.overBadge}>
                        <Text style={styles.overText}>{item.time || 'Live'}</Text>
                    </View>
                    <Text style={styles.commText}>{item.text}</Text>
                </View>
            ))}
        </View>
    );
}
