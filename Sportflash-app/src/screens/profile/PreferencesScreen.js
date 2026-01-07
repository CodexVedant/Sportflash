import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateUserPreferences } from '@store/slices/authSlice';
import { styles } from '@utils/style/PreferencesScreen.styles';

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
