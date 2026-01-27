import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { theme } from '@utils/theme';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { ErrorMessage } from '@components/common';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '@components/common/BackButton';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { styles } from '@utils/style/ForgotPasswordScreen.styles';
import { validateEmail, sendForgotPasswordRequest } from '@utils/script/ForgotPasswordScreen.helpers';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [resetToken, setResetToken] = useState<string | null>(null);

    const handleForgotPassword = async () => {
        setError(null);
        setSuccess(false);

        // Validation
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            await sendForgotPasswordRequest(email);
            // Navigate to OTP verification
            navigation.navigate('ResetOtpVerification', { email });
        } catch (err: any) {
            setError(err.message || 'Network error. Please try again.');
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

                        {/* Forgot Password Card */}
                        <View style={styles.card}>
                            <View style={styles.header}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="lock-closed-outline" size={48} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.title}>Forgot Password?</Text>
                                <Text style={styles.subtitle}>
                                    {success
                                        ? 'Check your email for reset instructions'
                                        : 'Enter your email and we\'ll send you a reset link'}
                                </Text>
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
                                    keyboardType="email-address"
                                />

                                <Button
                                    title="Send Reset Code"
                                    onPress={handleForgotPassword}
                                    loading={loading}
                                    size="lg"
                                    style={{ marginTop: 10 }}
                                />

                                <TouchableOpacity
                                    style={styles.backToLoginBtn}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Ionicons name="arrow-back" size={16} color={theme.colors.primary} />
                                    <Text style={styles.backToLoginText}>Back to Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
