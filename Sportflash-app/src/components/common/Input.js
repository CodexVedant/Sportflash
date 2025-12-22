import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';

export default function Input({
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    icon,
    label,
    error,
    ...props
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
                    {...props}
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
        backgroundColor: 'rgba(164, 163, 194, 0.05)',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: 'transparent', // Prepare for border transition
    },
    focused: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        backgroundColor: 'rgba(30, 41, 59, 1)', // Darker background on focus
    },
    errorBorder: {
        borderWidth: 1,
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
        backgroundColor: 'transparent',
        ...Platform.select({
            web: {
                outlineStyle: 'none',
            },
        }),
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    }
});
