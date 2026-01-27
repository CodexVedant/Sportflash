import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuBtn: {
        marginRight: 16,
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: 20,
        fontFamily: theme.fonts.bold,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutBtn: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    logoutText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    authButtonsContainer: {
        alignItems: 'center',
        gap: 16,
    },
    loginBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 48,
        paddingVertical: 14,
        borderRadius: 8,
        minWidth: 200,
        alignItems: 'center',
    },
    loginText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerBtn: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 48,
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        minWidth: 200,
        alignItems: 'center',
    },
    registerText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    }
});
