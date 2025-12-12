import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme } from '../../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Background with subtle gradient */}
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative localized glows */}
            <LinearGradient
                colors={[theme.colors.primary, 'transparent']}
                style={styles.glowTopLeft}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <LinearGradient
                colors={[theme.colors.football, 'transparent']}
                style={styles.glowBottomRight}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>

                    {/* Logo Section */}
                    <View style={styles.logoContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="flash" size={48} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.logoText}>
                            Sport<Text style={styles.highlight}>Flash</Text>
                        </Text>
                        <Text style={styles.tagline}>Live Scores. Real Time. Premium.</Text>
                    </View>

                    {/* Feature preview or spacing */}
                    <View style={{ flex: 1 }} />

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <Button
                            title="Sign Up"
                            onPress={() => navigation.navigate('Register')}
                            size="lg"
                            style={{ marginBottom: 16, width: '100%' }}
                            icon="person-add-outline"
                        />
                        <Button
                            title="Log In"
                            variant="outline"
                            onPress={() => navigation.navigate('Login')}
                            size="lg"
                            style={{ width: '100%' }}
                            icon="log-in-outline"
                        />
                    </View>

                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    safeArea: {
        flex: 1,
    },
    glowTopLeft: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.2,
    },
    glowBottomRight: {
        position: 'absolute',
        bottom: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.15,
    },
    content: {
        flex: 1,
        padding: theme.spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    logoText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: theme.colors.text,
        letterSpacing: 2,
        fontFamily: theme.fonts.display,
    },
    highlight: {
        color: theme.colors.primary,
    },
    tagline: {
        color: theme.colors.textMuted,
        fontSize: 18,
        marginTop: 10,
        letterSpacing: 1,
    },
    actions: {
        width: '100%',
        marginBottom: 40,
    }
});
