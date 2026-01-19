import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingVertical: 20,
    },
    backBtn: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    brandContainer: {
        marginBottom: 30,
    },
    brandText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    brandHighlight: {
        color: theme.colors.primary,
    },
    card: {
        width: '100%',
        maxWidth: 450,
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.secondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    form: {
        gap: 16,
    },
    backToLoginBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 20,
        padding: 12,
    },
    backToLoginText: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    successContainer: {
        alignItems: 'center',
    },
    successIcon: {
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 12,
    },
    successMessage: {
        fontSize: 14,
        color: theme.colors.secondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    devModeContainer: {
        width: '100%',
        backgroundColor: theme.colors.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.primary + '40',
    },
    devModeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 8,
    },
    devModeText: {
        fontSize: 13,
        color: theme.colors.secondary,
        marginBottom: 12,
        lineHeight: 18,
    },
});
