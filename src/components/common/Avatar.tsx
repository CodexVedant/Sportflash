import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

interface AvatarProps {
    uri?: string;
    initials?: string;
    size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ uri, initials, size = 40 }) => {
    if (uri) {
        return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
    }
    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.text, { fontSize: size / 2.5 }]}>{initials}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Avatar;
