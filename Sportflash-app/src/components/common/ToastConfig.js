
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';

/*
  Custom Toast Config
  Usage: <Toast config={toastConfig} />
*/

export const toastConfig = {
    /* 
      1. Overwrite default 'success' / 'error' / 'info' 
      2. Define new types like 'match_update'
    */

    match_update: ({ text1, text2, props, onPress }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.container, { borderLeftColor: theme.colors.primary }]}
        >
            <View style={styles.iconContainer}>
                {/* Bell Icon as requested */}
                <Ionicons name="notifications" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title} numberOfLines={1}>{text1}</Text>
                <Text style={styles.message} numberOfLines={2}>{text2}</Text>
            </View>
        </TouchableOpacity>
    ),

    /* Optional: Custom Success Style */
    success: ({ text1, text2, props, onPress }) => (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.container, { borderLeftColor: theme.colors.success }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{text1}</Text>
                <Text style={styles.message}>{text2}</Text>
            </View>
        </TouchableOpacity>
    ),

    /* Optional: Custom Info Style */
    info: ({ text1, text2, props, onPress }) => (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.container, { borderLeftColor: theme.colors.info }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="information-circle" size={24} color={theme.colors.info} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{text1}</Text>
                <Text style={styles.message}>{text2}</Text>
            </View>
        </TouchableOpacity>
    ),
};

const styles = StyleSheet.create({
    container: {
        height: 70,
        width: '90%',
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderLeftWidth: 6, // The colored accent line
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginTop: 10 // Safe Area spacing if needed
    },
    iconContainer: {
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2
    },
    message: {
        color: theme.colors.textSecondary,
        fontSize: 12
    }
});
