import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    cell: {
        justifyContent: 'center',
    },
    alignLeft: {
        alignItems: 'flex-start',
    },
    alignCenter: {
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        color: theme.colors.text,
    },
    teamCell: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logo: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    logoFallback: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    teamName: {
        fontSize: 14,
        color: theme.colors.text,
    },
    followed: {
        fontSize: 10,
        color: theme.colors.primary,
    },
    followedRow: {
        backgroundColor: 'rgba(59,130,246,0.08)',
    },
});
