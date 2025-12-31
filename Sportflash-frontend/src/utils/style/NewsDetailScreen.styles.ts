import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    imageContainer: {
        height: 300,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerActions: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        // backdropFilter: 'blur(10px)', // iOS only - removed as it's not standard RN style props
    },
    content: {
        padding: theme.spacing.xl,
        marginTop: -20,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    badge: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    badgeText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    title: {
        color: theme.colors.text,
        fontSize: 24,
        fontFamily: theme.fonts.display,
        fontWeight: 'bold',
        lineHeight: 32,
        marginBottom: 16,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    metaText: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    dot: {
        color: theme.colors.textMuted,
        marginHorizontal: 8,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 24,
    },
    body: {
        color: theme.colors.text,
        fontSize: 16,
        lineHeight: 26,
        opacity: 0.9,
    }
});
