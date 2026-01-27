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
    passwordRequirements: {
        backgroundColor: theme.colors.background,
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 12,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    requirementText: {
        fontSize: 13,
        color: theme.colors.secondary,
    },
    requirementMet: {
        color: theme.colors.success,
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
    successMessage: {
        fontSize: 16,
        color: theme.colors.secondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    manualLoginBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    manualLoginText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
