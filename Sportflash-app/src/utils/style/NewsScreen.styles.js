import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitle: {
        fontSize: theme.sizes.xl,
        fontFamily: theme.fonts.display,
        color: theme.colors.text,
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    featuredCard: {
        height: 200,
        backgroundColor: '#1E293B',
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.xl,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    featuredGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    featuredContent: {
        padding: theme.spacing.lg,
    },
    categoryBadge: {
        backgroundColor: theme.colors.primary,
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
    },
    categoryText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: theme.fonts.bold,
        textTransform: 'uppercase',
    },
    featuredTitle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: theme.fonts.bold,
        marginBottom: 4,
    },
    featuredTime: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
    newsItem: {
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
    },
    newsImagePlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover'
    },
    newsContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    category: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    dot: {
        color: theme.colors.textMuted,
        marginHorizontal: 6,
        fontSize: 12,
    },
    time: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
    title: {
        color: theme.colors.text,
        fontSize: 16,
        fontFamily: theme.fonts.medium,
        lineHeight: 22,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuBtn: {
        marginRight: 16,
    }
});
