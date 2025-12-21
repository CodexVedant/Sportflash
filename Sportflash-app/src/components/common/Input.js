import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';

export default function Input({
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    icon,
    label,
    error
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[
                styles.inputWrapper,
                isFocused && styles.focused,
                error && styles.errorBorder
            ]}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={isFocused ? theme.colors.active : theme.colors.textMuted}
                        style={styles.icon}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textMuted}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Ionicons
                            name={isPasswordVisible ? "eye-off" : "eye"}
                            size={20}
                            color={theme.colors.textMuted}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        color: theme.colors.text,
        fontFamily: theme.fonts.medium,
        marginBottom: 6,
        marginLeft: 4,
    },
    inputWrapper: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
    },
    focused: {
        borderColor: theme.colors.primary,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    errorBorder: {
        borderColor: theme.colors.danger,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: theme.colors.text,
        fontFamily: theme.fonts.regular,
        fontSize: 16,
        height: '100%',
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    }
});
