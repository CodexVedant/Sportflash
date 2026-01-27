import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/Input.styles';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: any; // Ionicons name
}

export default function Input({
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    icon,
    label,
    error,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[
                styles.inputWrapper,
                isFocused && styles.focused,
                !!error && styles.errorBorder
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
