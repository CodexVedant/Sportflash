import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, useWindowDimensions, ScrollView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { register } from '@store/slices/authSlice';
import { theme } from '@utils/theme';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { ErrorMessage } from '@components/common';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '@components/common/BackButton';
import { styles } from '@utils/style/RegisterScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { useAppDispatch } from '@hooks/redux';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showOtpButton, setShowOtpButton] = useState(false); // Fallback for auto-nav failure
    const dispatch = useAppDispatch();
    const { width } = useWindowDimensions();

    // Responsive: Card width
    const isDesktop = width > 768;
    const cardWidth = isDesktop ? 450 : width * 0.9;

    const handleRegister = async () => {
        setError(null); // Clear previous errors

        // Client-side validation
        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (name.length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }

        if (name.length > 10) {
            setError('Name must not exceed 10 characters');
            return;
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(name)) {
            setError('Name must contain only alphabets');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const res = await dispatch(register({ name, email, password })).unwrap();

            // Show fallback button in case auto-nav fails visually
            setShowOtpButton(true);

            if (res.requireOtp) {
                // Small delay to ensure state updates or avoids conflicts
                setTimeout(() => {
                    navigation.navigate('OtpVerification', { email });
                }, 500);
            }
        } catch (err: any) {
            console.error('Register Error:', err);
            setError(err || 'Registration failed. Please try again.');
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
                                <Text style={styles.title}>Create Account</Text>
                                <Text style={styles.subtitle}>Join the ultimate sports community</Text>
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
                                    autoCapitalize="none"
                                />
                                <Input
                                    label="Password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    icon="lock-closed-outline"
                                />

                                {showOtpButton && (
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={{ color: theme.colors.primary, textAlign: 'center', marginBottom: 10 }}>
                                            Registration successful! If you weren't redirected...
                                        </Text>
                                        <Button
                                            title="Enter Verification Code"
                                            onPress={() => navigation.navigate('OtpVerification', { email })}
                                            variant="outline"
                                        />
                                    </View>
                                )}

                                <Button
                                    title="Sign Up"
                                    onPress={handleRegister}
                                    loading={loading}
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
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
