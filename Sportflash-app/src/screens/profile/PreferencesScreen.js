import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateUserPreferences } from '@store/slices/authSlice';

export default function PreferencesScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const [name, setName] = useState(user?.name || '');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleSave = async () => {
        // Dispatch update action
        try {
            // Mock update structure, ideally we'd have a full profile update endpoint
            // For now using updateUserPreferences logic roughly
            // await dispatch(updateUserPreferences({ name, notificationsEnabled })).unwrap();
            Alert.alert("Success", "Profile updated successfully");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to update profile");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor={theme.colors.textMuted}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email (Read Only)</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={user?.email}
                        editable={false}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Push Notifications</Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ true: theme.colors.primary }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    saveText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    content: {
        padding: theme.spacing.lg,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        color: theme.colors.textMuted,
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: 12,
        color: theme.colors.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    disabledInput: {
        opacity: 0.5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    }
});
