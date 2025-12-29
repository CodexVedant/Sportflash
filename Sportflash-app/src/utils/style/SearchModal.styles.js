import { StyleSheet } from 'react-native';
import { theme } from '@utils/theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    modalWrapper: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        justifyContent: 'flex-start',
    },
    modalCard: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
        overflow: 'hidden',
        marginTop: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 12,
        gap: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        gap: 10,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontFamily: theme.fonts?.medium || 'System',
        height: '100%',
        backgroundColor: 'transparent',
        ...Platform.select({
            web: {
                outlineStyle: 'none',
            },
        }),
    },
    closeBtn: {
        padding: 8,
    },
    cancelText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontFamily: theme.fonts?.medium,
    },
    filterRow: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    chipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        color: theme.colors.textMuted,
        fontSize: 13,
        fontWeight: '600',
    },
    chipTextActive: {
        color: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    content: {
        padding: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        opacity: 0.8,
    },
    emptyIconBg: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        color: theme.colors.text,
        fontSize: 18,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    emptySub: {
        color: theme.colors.textMuted,
        fontSize: 14,
        textAlign: 'center',
    },
    sectionHeader: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 12,
        letterSpacing: 1,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    recentText: {
        color: theme.colors.text,
        fontSize: 15,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        marginBottom: 8,
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    itemSub: {
        color: theme.colors.textMuted,
        fontSize: 13,
    },
    noResults: {
        color: theme.colors.textMuted,
        textAlign: 'center',
        fontSize: 16,
    },
});
