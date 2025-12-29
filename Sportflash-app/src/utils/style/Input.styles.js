import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

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
