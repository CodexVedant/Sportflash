import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../../utils/theme';

export default function BookmarksScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Bookmarks</Text>
                <Text style={styles.subtitle}>Saved news and highlights will appear here.</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: theme.colors.text,
        fontSize: 24,
        fontFamily: theme.fonts.bold,
        marginBottom: 8,
    },
    subtitle: {
        color: theme.colors.textMuted,
        fontSize: 16,
        fontFamily: theme.fonts.medium,
    }
});
