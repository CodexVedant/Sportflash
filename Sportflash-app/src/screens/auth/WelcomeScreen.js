import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Fix: Default export check
import Button from '../../components/common/Button';
import { theme } from '../../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Background Graphic Placeholder */}
            <View style={styles.backgroundGraphic}>
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.background]}
                    style={styles.gradient}
                />
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Sport<Text style={styles.highlight}>Flash</Text></Text>
                    <Text style={styles.subtitle}>Live Scores. Real Time. Premium Experience.</Text>
                </View>

                <View style={styles.actions}>
                    <Button
                        title="Get Started"
                        onPress={() => navigation.navigate('Register')}
                        size="lg"
                        style={{ marginBottom: 16, width: '100%' }}
                    />
                    <Button
                        title="I have an account"
                        variant="outline"
                        onPress={() => navigation.navigate('Login')}
                        size="lg"
                        style={{ width: '100%' }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    backgroundGraphic: {
        flex: 1,
        backgroundColor: '#1E293B', // Slate 800
        justifyContent: 'flex-end',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        opacity: 0.5
    },
    content: {
        padding: theme.spacing.xl,
        paddingBottom: theme.spacing.xxl * 1.5,
    },
    header: {
        marginBottom: theme.spacing.xxl,
    },
    title: {
        // fontFamily: theme.fonts.display, // Font disabled
        fontWeight: 'bold',
        fontSize: 48,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    highlight: {
        color: theme.colors.primary,
    },
    subtitle: {
        // fontFamily: theme.fonts.medium, // Font disabled
        fontSize: 18,
        color: theme.colors.textMuted,
        lineHeight: 26,
    },
    actions: {
        width: '100%',
    }
});
