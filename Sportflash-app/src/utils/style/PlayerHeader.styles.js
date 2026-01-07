import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 200,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    imageContainer: {
        position: 'relative',
        marginBottom: theme.spacing.md,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: theme.colors.surface,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: theme.colors.textMuted,
    },
    numberBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: theme.colors.background,
    },
    numberText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    role: {
        fontSize: 16,
        color: theme.colors.textMuted,
        marginBottom: 8,
        textAlign: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: theme.spacing.lg,
    },
    location: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    followButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        gap: 8,
    },
    followingButton: {
        backgroundColor: theme.colors.success,
    },
    followButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
