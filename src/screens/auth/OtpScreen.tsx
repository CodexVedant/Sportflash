import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import Button from '@components/common/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { API_BASE_URL } from '@config/index';
import axios from 'axios';
import { setCredentials } from '@store/slices/authSlice';
import { useAppDispatch } from '@hooks/redux';
import { ErrorMessage } from '@components/common';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

export default function OtpScreen({ route, navigation }: Props) {
    const { email } = route.params; // Email passed from RegisterScreen
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timer, setTimer] = useState(60); // 60s countdown for resend
    const inputs = useRef<Array<TextInput | null>>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (text: string, index: number) => {
        setError(null); // Clear error on typing
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto focus next
        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }

        // Auto submit if full
        if (newOtp.every(d => d !== '') && index === 5) {
            Keyboard.dismiss();
        }
    };

    const handleBackspace = (text: string, index: number) => {
        setError(null);
        if (!text && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        setError(null);
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
                email,
                otp: code
            });

            if (response.data.success) {
                // Save token to Redux & Storage
                dispatch(setCredentials(response.data.data));

                console.log('✅ OTP Verified. Resetting to Main...');

                // Force navigation reset relative to root
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    });
                }, 100);
            }
        } catch (error: any) {
            console.error('Verify Error:', error);
            const msg = error.response?.data?.message || 'Invalid code';
            setError(msg);
            // Optionally keep Alert if user prefers both, but request said "show verify error message in frontend errormessage"
            // Alert.alert('Verification Failed', msg); 
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return; // Prevent resend if timer is still running

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, {
                email
            });

            if (response.data.success) {
                Alert.alert('Success', 'A new verification code has been sent to your email');
                setTimer(60); // Reset timer
                setOtp(['', '', '', '', '', '']); // Clear OTP inputs
                inputs.current[0]?.focus(); // Focus first input
            }
        } catch (error: any) {
            console.error('Resend Error:', error);
            const msg = error.response?.data?.message || 'Failed to resend code. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="mail-open-outline" size={60} color={theme.colors.primary} />
                </View>

                <Text style={styles.title}>Verification Code</Text>
                <Text style={styles.subtitle}>
                    Please enter the verification code sent to{'\n'}
                    <Text style={styles.email}>{email}</Text>
                </Text>

                <View style={{ width: '100%', marginBottom: 20 }}>
                    {error && (
                        <ErrorMessage
                            message={error}
                            type="error"
                            onDismiss={() => setError(null)}
                        />
                    )}
                </View>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputs.current[index] = ref; }}
                            style={[
                                styles.otpInput,
                                digit ? styles.otpInputFilled : null,
                                error ? { borderColor: theme.colors.danger } : null
                            ]}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace') {
                                    handleBackspace(digit, index);
                                }
                            }}
                        />
                    ))}
                </View>

                <Button
                    title="Verify"
                    onPress={handleVerify}
                    loading={loading}
                    size="lg"
                    style={{ marginTop: 30, width: '100%' }}
                />

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive code? </Text>
                    <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                        <Text style={[styles.resendLink, timer > 0 && styles.resendDisabled]}>
                            {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    backBtn: { padding: 16 },
    content: { flex: 1, padding: 24, alignItems: 'center', paddingTop: 40 },
    iconContainer: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 24
    },
    title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
    subtitle: { fontSize: 16, color: theme.colors.textMuted, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
    email: { color: theme.colors.text, fontWeight: '600' },
    otpContainer: { flexDirection: 'row', justifyContent: 'center', width: '100%', gap: 12 },
    otpInput: {
        width: 45, height: 50,
        borderWidth: 1, borderColor: theme.colors.border,
        borderRadius: 8,
        fontSize: 24, fontWeight: 'bold', color: theme.colors.text,
        textAlign: 'center',
        backgroundColor: theme.colors.surface
    },
    otpInputFilled: { borderColor: theme.colors.primary, backgroundColor: theme.colors.surface },
    resendContainer: { flexDirection: 'row', marginTop: 24 },
    resendText: { color: theme.colors.textMuted },
    resendLink: { color: theme.colors.primary, fontWeight: 'bold' },
    resendDisabled: { color: theme.colors.textMuted, opacity: 0.6 }
});
