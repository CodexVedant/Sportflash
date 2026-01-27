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

type Props = NativeStackScreenProps<RootStackParamList, 'ResetOtpVerification'>;

export default function ResetOtpVerificationScreen({ route, navigation }: Props) {
    const { email } = route.params;
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(600); // 10 minutes expiry
    const inputs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (text: string, index: number) => {
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
        if (!text && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/verifyresetotp`, {
                email,
                otp: code
            });

            if (response.data.success) {
                const resetToken = response.data.resetToken;

                // Navigate to ResetPassword with the secure token
                navigation.replace('ResetPassword', { resetToken });
            }
        } catch (error: any) {
            console.error('Verify Error:', error);
            const msg = error.response?.data?.message || 'Invalid or expired code';
            Alert.alert('Verification Failed', msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        // Simple logic: call forgotPassword again
        try {
            await axios.post(`${API_BASE_URL}/auth/forgotpassword`, { email });
            Alert.alert('Sent', 'A new code has been sent to your email');
            setTimer(600);
        } catch (error) {
            Alert.alert('Error', 'Failed to resend code');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="key-outline" size={60} color={theme.colors.primary} />
                </View>

                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    Enter the code sent to your email{'\n'}
                    <Text style={styles.email}>{email}</Text>
                </Text>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputs.current[index] = ref; }}
                            style={[
                                styles.otpInput,
                                digit ? styles.otpInputFilled : null
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
                    title="Verify Code"
                    onPress={handleVerify}
                    loading={loading}
                    size="lg"
                    style={{ marginTop: 30, width: '100%' }}
                />

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive code? </Text>
                    <TouchableOpacity onPress={handleResend}>
                        <Text style={styles.resendLink}>Resend Code</Text>
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
    resendLink: { color: theme.colors.primary, fontWeight: 'bold' }
});
