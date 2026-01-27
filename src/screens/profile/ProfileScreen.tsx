import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { logout } from '@store/slices/authSlice';
import { styles } from '@utils/style/ProfileScreen.styles';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';

export default function ProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);

    const handleLogout = async () => {
        // Platform-aware confirmation
        const confirmed = Platform.OS === 'web'
            ? window.confirm('Are you sure you want to logout?')
            : await new Promise<boolean>((resolve) => {
                Alert.alert(
                    "Logout",
                    "Are you sure you want to logout?",
                    [
                        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
                        {
                            text: "Logout",
                            style: "destructive",
                            onPress: () => resolve(true)
                        }
                    ]
                );
            });

        if (confirmed) {
            try {
                await dispatch(logout()).unwrap();
                // Navigate to Home screen and reset navigation stack
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    })
                );
            } catch (err) {
                console.error("Logout error:", err);
            }
        }
    };

    const handleNavigation = (label: string) => {
        switch (label) {
            case 'Edit Profile':
                navigation.navigate('Preferences');
                break;
            case 'Notifications':
                navigation.navigate('NotificationSettings'); // Changed from Notifications to NotificationSettings
                break;
            case 'Settings':
                navigation.navigate('Settings');
                break;
            case 'Bookmarks':
                navigation.navigate('Bookmarks');
                break;
            default:
                break;
        }
    }

    const MENU_ITEMS = [
        { icon: 'person-outline', label: 'Edit Profile' },
        { icon: 'notifications-outline', label: 'Notifications' },
        { icon: 'bookmark-outline', label: 'Bookmarks' },
        { icon: 'settings-outline', label: 'Settings' },
        { icon: 'shield-checkmark-outline', label: 'Privacy & Security' },
        { icon: 'help-circle-outline', label: 'Help & Support' },
    ];

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.guestContainer}>
                    <View style={styles.guestIconBg}>
                        <Ionicons name="person" size={40} color={theme.colors.textMuted} />
                    </View>
                    <Text style={styles.guestTitle}>Guest User</Text>
                    <Text style={styles.guestSub}>Login to track your favorite teams and get personalized updates.</Text>

                    <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginBtnText}>Login / Register</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user?.name || 'User'}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Premium Member</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user?.preferences?.favoriteTeams?.length || 0}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user?.preferences?.favoritePlayers?.length || 0}</Text>
                        <Text style={styles.statLabel}>Players</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>24</Text>
                        <Text style={styles.statLabel}>Alerts</Text>
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menuContainer}>
                    {MENU_ITEMS.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={() => handleNavigation(item.label)}>
                            <View style={styles.menuIconBox}>
                                <Ionicons name={item.icon as any} size={20} color={theme.colors.text} />
                            </View>
                            <Text style={styles.menuText}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

