import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@hooks/redux';
import { setPremiumStatus } from '@store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '@components/common/BackButton';
import { Theme } from '@utils/theme';

export default function PremiumScreen() {
    const theme = useTheme();
    const navigation = useNavigation();
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useAppDispatch();
    const handleSubscribe = () => {
        setLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            setLoading(false);
            dispatch(setPremiumStatus(true)); // ACTIVATE PREMIUM
            setPaymentSuccess(true);
            // Auto close after 2 seconds
            setTimeout(() => {
                navigation.goBack();
            }, 2500);
        }, 2000);
    };

    if (paymentSuccess) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <View style={styles.successContainer}>
                    <View style={styles.successIconCircle}>
                        <Ionicons name="checkmark" size={60} color="#fff" />
                    </View>
                    <Text style={[styles.successTitle, { color: theme.colors.text }]}>Payment Successful!</Text>
                    <Text style={[styles.successSubtitle, { color: theme.colors.textMuted }]}>
                        Welcome to Sportflash Premium.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <BackButton color={theme.colors.text} />
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Go Premium</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="diamond" size={60} color="#FFD700" />
                    </View>
                    <Text style={[styles.title, { color: theme.colors.text }]}>Unlock Sportflash Pro</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                        Get the ultimate sports experience with these exclusive benefits.
                    </Text>

                    <View style={styles.benefitList}>
                        <BenefitItem icon="mail-outline" text="Instant Email Alerts for Wickets & Goals" theme={theme} />
                        <BenefitItem icon="newspaper-outline" text="Daily Match Digests & Summaries" theme={theme} />
                        <BenefitItem icon="flash-outline" text="Priority Notifications (Zero Delay)" theme={theme} />
                        <BenefitItem icon="ban-outline" text="Ad-Free Experience (Coming Soon)" theme={theme} />
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
                <View style={styles.priceContainer}>
                    <Text style={[styles.priceLabel, { color: theme.colors.textMuted }]}>Monthly Plan</Text>
                    <Text style={[styles.price, { color: theme.colors.primary }]}>$4.99<Text style={{ fontSize: 16, color: theme.colors.text }}>/mo</Text></Text>
                </View>
                <TouchableOpacity
                    style={[styles.subscribeBtn, { backgroundColor: theme.colors.primary }]}
                    onPress={handleSubscribe}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.subscribeText}>Subscribe Now</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const BenefitItem = ({ icon, text, theme }: { icon: any, text: string, theme: Theme }) => (
    <View style={styles.benefitItem}>
        <View style={[styles.checkCircle, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name={icon} size={20} color={theme.colors.primary} />
        </View>
        <Text style={[styles.benefitText, { color: theme.colors.text }]}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    successContainer: {
        alignItems: 'center',
        padding: 40,
    },
    successIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4CAF50', // Success Green
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    content: {
        padding: 24,
    },
    card: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    benefitList: {
        width: '100%',
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    benefitText: {
        fontSize: 16,
        flex: 1,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceContainer: {
        flexDirection: 'column',
    },
    priceLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subscribeBtn: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        minWidth: 160,
        alignItems: 'center',
    },
    subscribeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
