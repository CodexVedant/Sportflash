import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { toggleTheme } from '@store/slices/themeSlice';
import { logout } from '@store/slices/authSlice';
import BackButton from '@components/common/BackButton';

export default function SettingsScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const themeMode = useSelector(state => state.theme.mode);
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton color={theme.colors.text} style={styles.backBtn} />
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Appearance</Text>
                    <View style={styles.row}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="moon-outline" size={24} color={theme.colors.text} style={{ marginRight: 12 }} />
                            <Text style={styles.rowLabel}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={themeMode === 'dark'}
                            onValueChange={() => dispatch(toggleTheme())}
                            trackColor={{ true: theme.colors.primary, false: theme.colors.secondary }}
                            thumbColor={'#fff'}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Preferences</Text>
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => navigation.navigate('NotificationSettings')}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="notifications-outline" size={24} color={theme.colors.text} style={{ marginRight: 12 }} />
                            <Text style={styles.rowLabel}>Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>General</Text>
                    <TouchableOpacity style={styles.row}>
                        <Text style={styles.rowLabel}>Privacy Policy</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <Text style={styles.rowLabel}>Terms of Service</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <Text style={styles.rowLabel}>About SportFlash</Text>
                        <Text style={styles.version}>v1.0.0</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const makeStyles = (theme) => StyleSheet.create({
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
    logoutBtn: {
        marginTop: 20,
        alignItems: 'center',
        padding: 16,
    },
    logoutText: {
        color: theme.colors.danger,
        fontSize: 16,
        fontWeight: 'bold',
    }
});
