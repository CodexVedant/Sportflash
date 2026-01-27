import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        position: 'relative',
        padding: 8,
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    badgeText: {
        fontSize: 10,
        fontFamily: theme.fonts?.bold || 'System',
        color: '#fff',
    },
});
