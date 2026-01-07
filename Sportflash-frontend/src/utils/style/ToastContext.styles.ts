import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    toastContainer: {
        position: 'absolute',
        top: 60, // Below header
        left: 20,
        right: 20,
        zIndex: 9999,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    blur: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    message: {
        color: theme.colors.text,
        fontFamily: theme.fonts.medium,
        fontSize: 14,
        flex: 1,
    }
});
