import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        backgroundColor: 'transparent', // Transparent background
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14, // Increase padding for click area
        gap: 6,
        borderBottomWidth: 3, // Reserve space for border
        borderBottomColor: 'transparent',
    },
    activeTab: {
        backgroundColor: 'transparent', // No background color
        borderBottomColor: theme.colors.primary, // Underline color
    },
    icon: {
        marginRight: 4,
    },
    tabText: {
        fontSize: 14,
        fontFamily: theme.fonts.medium,
        color: theme.colors.textMuted,
        textTransform: 'uppercase', // Match the image style usually
        letterSpacing: 0.5,
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});
