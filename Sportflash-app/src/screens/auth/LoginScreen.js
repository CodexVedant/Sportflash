import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, useWindowDimensions, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '@store/slices/authSlice';
import { theme } from '@utils/theme';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { ErrorMessage } from '@components/common';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '@components/common/BackButton';
import { styles } from '@utils/style/LoginScreen.styles';

export default function LoginScreen({ navigation, route }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
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
        try {
            await dispatch(login({ email, password })).unwrap();
            navigation.goBack();
        } catch (err) {
            setError(err || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
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
                    <BackButton color={theme.colors.text} style={styles.backBtn} />


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
                                    autoComplete="off"
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
