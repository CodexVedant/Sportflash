import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../../utils/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the ultimate sports community</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={name}
                        onChangeText={setName}
                        icon="person-outline"
                    />
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        icon="mail-outline"
                    />
                    <Input
                        label="Password"
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        icon="lock-closed-outline"
                    />

                    <Button
                        title="Sign Up"
                        onPress={() => { }}
                        size="lg"
                        style={{ marginTop: 20 }}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.link}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardView: {
        flex: 1,
        padding: theme.spacing.xl,
    },
    backBtn: {
        marginBottom: theme.spacing.lg,
    },
    header: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontFamily: theme.fonts.display,
        fontSize: 32,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontFamily: theme.fonts.regular,
        fontSize: 16,
        color: theme.colors.textMuted,
    },
    form: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
    },
    footerText: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.regular,
    },
    link: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold,
    }
});
