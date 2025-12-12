import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../../utils/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation, route }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock login function - in real app connect to authSlice
    const handleLogin = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Determine if we need to update state via params or dispatch
            if (route.params?.setIsAuthenticated) {
                route.params.setIsAuthenticated(true);
            } else {
                // Just for demo flow if state isn't passed (shouldn't happen with AppNavigator setup)
                console.log("Logged In");
            }
        }, 1500);
    };

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
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue to SportFlash</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        icon="mail-outline"
                    />
                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        icon="lock-closed-outline"
                    />

                    <TouchableOpacity style={styles.forgotBtn}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <Button
                        title="Log In"
                        onPress={handleLogin}
                        loading={loading}
                        size="lg"
                        style={{ marginTop: 10 }}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.link}>Sign Up</Text>
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
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: theme.spacing.lg,
    },
    forgotText: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.medium,
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
