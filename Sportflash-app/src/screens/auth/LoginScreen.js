import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, useWindowDimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '@context/AuthContext';
import { theme } from '@utils/theme';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { ErrorMessage } from '@components/common';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation, route }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const { width, height } = useWindowDimensions();

    // Responsive: Card width
    const isDesktop = width > 768;
    const cardWidth = isDesktop ? 450 : width * 0.9;

    const handleLogin = async () => {
        setError(null); // Clear previous errors

        // Client-side validation
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (!result.success) {
            setError(result.message || 'Login failed. Please check your credentials.');
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Back Button */}
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>

                    {/* Centered Content */}
                    <View style={styles.centerContainer}>

                        {/* Logo / Brand */}
                        <View style={styles.brandContainer}>
                            <Text style={styles.brandText}>Sport<Text style={styles.brandHighlight}>Flash</Text></Text>
                        </View>

                        {/* Login Card */}
                        <View style={[styles.card, { width: cardWidth }]}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Welcome Back</Text>
                                <Text style={styles.subtitle}>Sign in to continue</Text>
                            </View>

                            <View style={styles.form}>
                                {error && (
                                    <ErrorMessage
                                        message={error}
                                        type="error"
                                        onDismiss={() => setError(null)}
                                    />
                                )}

                                <Input
                                    label="Email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    icon="mail-outline"
                                    autoCapitalize="none"
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
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: theme.spacing.lg,
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 8,
        borderRadius: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 600, // Ensure vertical centering on taller screens
    },
    brandContainer: {
        marginBottom: 40,
    },
    brandText: {
        fontSize: 42,
        fontFamily: theme.fonts.display,
        fontWeight: 'bold',
        color: theme.colors.text,
        letterSpacing: 1.5,
    },
    brandHighlight: {
        color: theme.colors.primary,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)', // Semi-transparent card
        borderRadius: 24,
        padding: 32,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    title: {
        fontFamily: theme.fonts.display,
        fontSize: 28,
        color: theme.colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: theme.fonts.regular,
        fontSize: 16,
        color: theme.colors.textMuted,
    },
    form: {
        width: '100%',
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: theme.spacing.lg,
    },
    forgotText: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.medium,
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
        paddingTop: theme.spacing.lg,
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
