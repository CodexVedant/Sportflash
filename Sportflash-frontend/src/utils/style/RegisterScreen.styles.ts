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
        padding: theme.spacing.lg,
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 8,
        borderRadius: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 600,
    },
    brandContainer: {
        marginBottom: 40,
    },
    brandText: {
        fontSize: 42,
        fontFamily: theme.fonts.display,
        fontWeight: 'bold',
        color: theme.colors.text,
        letterSpacing: 1.5,
    },
    brandHighlight: {
        color: theme.colors.primary,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: 24,
        padding: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    title: {
        fontFamily: theme.fonts.display,
        fontSize: 28,
        color: theme.colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: theme.fonts.regular,
        fontSize: 16,
        color: theme.colors.textMuted,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
        paddingTop: theme.spacing.lg,
    },
    footerText: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.regular,
    },
    link: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold,
    }
});
