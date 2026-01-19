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
import { useAppDispatch } from '@hooks/redux';
import { setCredentials } from '@store/slices/authSlice';
import { styles } from '@utils/style/ResetPasswordScreen.styles';
import {
    validatePassword,
    passwordsMatch,
    meetsMinLength,
    sendResetPasswordRequest
} from '@utils/script/ResetPasswordScreen.helpers';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen({ navigation, route }: Props) {
    const { resetToken } = route.params;
    const dispatch = useAppDispatch();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async () => {
        setError(null);

        // Validation
        if (!password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        const validation = validatePassword(password);
        if (!validation.isValid) {
            setError(validation.errors[0]);
            return;
        }

        if (!passwordsMatch(password, confirmPassword)) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const data = await sendResetPasswordRequest(resetToken, password);

            setSuccess(true);

            // Auto-login user with new credentials
            if (data.data?.token) {
                dispatch(setCredentials({
                    user: data.data.user,
                    token: data.data.token
                }));

                // Navigate to home after 2 seconds
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                }, 2000);
            }
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

                        {/* Reset Password Card */}
                        <View style={styles.card}>
                            <View style={styles.header}>
                                <View style={styles.iconContainer}>
                                    <Ionicons
                                        name={success ? "checkmark-circle" : "key-outline"}
                                        size={48}
                                        color={success ? theme.colors.success : theme.colors.primary}
                                    />
                                </View>
                                <Text style={styles.title}>
                                    {success ? 'Password Reset!' : 'Reset Password'}
                                </Text>
                                <Text style={styles.subtitle}>
                                    {success
                                        ? 'Your password has been successfully reset'
                                        : 'Enter your new password below'}
                                </Text>
                            </View>

                            {!success ? (
                                <View style={styles.form}>
                                    {error && (
                                        <ErrorMessage
                                            message={error}
                                            type="error"
                                            onDismiss={() => setError(null)}
                                        />
                                    )}

                                    <Input
                                        label="New Password"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        icon="lock-closed-outline"
                                        autoComplete="off"
                                    />

                                    <Input
                                        label="Confirm Password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        icon="lock-closed-outline"
                                        autoComplete="off"
                                    />

                                    <View style={styles.passwordRequirements}>
                                        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                                        <View style={styles.requirementItem}>
                                            <Ionicons
                                                name={meetsMinLength(password) ? "checkmark-circle" : "ellipse-outline"}
                                                size={16}
                                                color={meetsMinLength(password) ? theme.colors.success : theme.colors.secondary}
                                            />
                                            <Text style={[
                                                styles.requirementText,
                                                meetsMinLength(password) && styles.requirementMet
                                            ]}>
                                                At least 6 characters
                                            </Text>
                                        </View>
                                        <View style={styles.requirementItem}>
                                            <Ionicons
                                                name={passwordsMatch(password, confirmPassword) ? "checkmark-circle" : "ellipse-outline"}
                                                size={16}
                                                color={passwordsMatch(password, confirmPassword) ? theme.colors.success : theme.colors.secondary}
                                            />
                                            <Text style={[
                                                styles.requirementText,
                                                passwordsMatch(password, confirmPassword) && styles.requirementMet
                                            ]}>
                                                Passwords match
                                            </Text>
                                        </View>
                                    </View>

                                    <Button
                                        title="Reset Password"
                                        onPress={handleResetPassword}
                                        loading={loading}
                                        size="lg"
                                        style={{ marginTop: 10 }}
                                    />

                                    <TouchableOpacity
                                        style={styles.backToLoginBtn}
                                        onPress={() => navigation.navigate('Login')}
                                    >
                                        <Ionicons name="arrow-back" size={16} color={theme.colors.primary} />
                                        <Text style={styles.backToLoginText}>Back to Login</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.successContainer}>
                                    <Text style={styles.successMessage}>
                                        Redirecting you to the app...
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.manualLoginBtn}
                                        onPress={() => navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Home' }],
                                        })}
                                    >
                                        <Text style={styles.manualLoginText}>Go to Home</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
