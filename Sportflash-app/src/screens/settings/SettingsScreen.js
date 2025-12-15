import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme } from '../../utils/theme';
import { AuthContext } from '../../context/AuthContext';

export default function SettingsScreen() {
    const { logout } = useContext(AuthContext);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Settings</Text>

                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
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
        marginBottom: 32,
    },
    logoutBtn: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    logoutText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    }
});
