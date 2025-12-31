import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { toggleTheme } from '@store/slices/themeSlice';
import { logout } from '@store/slices/authSlice';
import BackButton from '@components/common/BackButton';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';
import { Theme } from '@utils/theme';

export default function SettingsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const themeMode = useAppSelector(state => state.theme.mode);
    const { user } = useAppSelector(state => state.auth);
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton color={theme.colors.text} style={styles.backBtn} />
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Appearance Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Appearance</Text>
                    <View style={styles.row}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="moon-outline" size={24} color={theme.colors.text} style={{ marginRight: 12 }} />
                            <Text style={styles.rowLabel}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={themeMode === 'dark'}
                            onValueChange={() => { dispatch(toggleTheme()); }}
                            trackColor={{ true: theme.colors.primary, false: theme.colors.secondary }}
                            thumbColor={'#fff'}
                        />
                    </View>
                </View>

                {/* General Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>General</Text>
                    <TouchableOpacity style={styles.row}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.text} style={{ marginRight: 12 }} />
                            <Text style={styles.rowLabel}>Privacy Policy</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="document-text-outline" size={24} color={theme.colors.text} style={{ marginRight: 12 }} />
                            <Text style={styles.rowLabel}>Terms of Service</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="information-circle-outline" size={24} color={theme.colors.text} style={{ marginRight: 12 }} />
                            <Text style={styles.rowLabel}>About SportFlash</Text>
                        </View>
                        <Text style={styles.version}>v1.0.0</Text>
                    </TouchableOpacity>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Account</Text>
                    {user ? (
                        <>
                            <View style={styles.userInfoContainer}>
                                <View style={styles.userAvatar}>
                                    <Ionicons name="person" size={32} color={theme.colors.primary} />
                                </View>
                                <View style={styles.userDetails}>
                                    <Text style={styles.userName}>{user.name || 'User'}</Text>
                                    <Text style={styles.userEmail}>{user.email || ''}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                                <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} style={{ marginRight: 8 }} />
                                <Text style={styles.logoutText}>Log Out</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={styles.authButtonsContainer}>
                            <Text style={styles.authPrompt}>Sign in to access all features</Text>
                            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                                <Text style={styles.loginText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
                                <Text style={styles.registerText}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backBtn: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    content: {
        padding: theme.spacing.lg,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        color: theme.colors.textMuted,
        textTransform: 'uppercase',
        fontSize: 12,
        marginBottom: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    rowLabel: {
        color: theme.colors.text,
        fontSize: 16,
    },
    version: {
        color: theme.colors.textMuted,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    logoutBtn: {
        flexDirection: 'row',
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        backgroundColor: 'transparent',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.danger,
    },
    logoutText: {
        color: theme.colors.danger,
        fontSize: 16,
        fontWeight: 'bold',
    },
    authButtonsContainer: {
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    authPrompt: {
        color: theme.colors.textMuted,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 8,
    },
    loginBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 48,
        paddingVertical: 14,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    loginText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerBtn: {
        backgroundColor: 'transparent',
        paddingHorizontal: 48,
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        width: '100%',
        alignItems: 'center',
    },
    registerText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

