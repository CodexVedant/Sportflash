import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '@utils/theme';

const { width } = Dimensions.get('window');
export const SIDEBAR_WIDTH = Math.min(width * 0.75, 300);

export const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    overlay: {
        flex: 1,
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sidebarContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: '#0f172a',
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        height: 64,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 20,
        fontFamily: theme.fonts.display,
        fontWeight: 'bold',
        color: theme.colors.text,
        lineHeight: 24,
    },
    highlight: {
        color: theme.colors.primary,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    },
    menuContent: {
        flex: 1,
        paddingTop: theme.spacing.sm,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionHeader: {
        color: theme.colors.textMuted,
        fontSize: 11,
        fontWeight: '700',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: 8,
        marginTop: 8,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: theme.spacing.lg,
        borderLeftWidth: 3,
        borderLeftColor: 'transparent',
        marginBottom: 2,
    },
    menuItemActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderLeftColor: theme.colors.primary,
        marginRight: 16,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    menuIcon: {
        marginRight: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
    },
    menuTextActive: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    footer: {
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    versionText: {
        color: theme.colors.textMuted,
        fontSize: 12,
        textAlign: 'center',
        opacity: 0.7,
    }
});
