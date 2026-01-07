import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { useDispatch } from 'react-redux';
import { showToast } from '@store/actions/toastActions';
// import { useToast } from '@context/ToastContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchModal({ visible, onClose }) {
    const [query, setQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [results, setResults] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    // const { showToast } = useToast();
    const dispatch = useDispatch();
    const { width, height } = useWindowDimensions();

    const isDesktop = width > 768;
    const cardWidth = isDesktop ? 600 : width * 0.95;
    const cardMaxHeight = height * 0.8;

    // Load recent searches on mount
    useEffect(() => {
        loadRecentSearches();
    }, []);

    const loadRecentSearches = async () => {
        try {
            const saved = await AsyncStorage.getItem('recentSearches');
            let items = [];
            if (saved) {
                items = JSON.parse(saved);
            }

            // If empty, show defaults so the UI isn't empty
            if (items.length === 0) {
                items = ['India vs Australia', 'Lakers vs Warriors', 'Cristiano Ronaldo', 'Mumbai Indians', 'Lionel Messi'];
            }

            setRecentSearches(items);
        } catch (error) {
            console.log('Error loading recent searches:', error);
        }
    };

    const clearRecentSearches = async () => {
        try {
            await AsyncStorage.removeItem('recentSearches');
            setRecentSearches([]);
        } catch (error) {
            console.log('Error clearing history:', error);
        }
    };

    // Mock Search Data
    const MOCK_DATA = [
        { id: 1, title: 'India vs Australia', subtitle: 'Live • Cricket', icon: 'baseball-outline', type: 'Matches' },
        { id: 2, title: 'Man Utd vs Chelsea', subtitle: 'Live • Football', icon: 'football-outline', type: 'Matches' },
        { id: 3, title: 'Lakers vs Warriors', subtitle: 'Live • Basketball', icon: 'basketball-outline', type: 'Matches' },
        { id: 4, title: 'Virat Kohli', subtitle: 'Player • India', icon: 'person-outline', type: 'Players' },
        { id: 5, title: 'Mumbai Indians', subtitle: 'Team • IPL', icon: 'people-outline', type: 'Teams' },
        { id: 6, title: 'World Cup Finals', subtitle: 'News • 2h ago', icon: 'newspaper-outline', type: 'News' },
        { id: 7, title: 'Rohit Sharma', subtitle: 'Player • India', icon: 'person-outline', type: 'Players' },
        { id: 8, title: 'Real Madrid', subtitle: 'Team • La Liga', icon: 'people-outline', type: 'Teams' },
    ];

    useEffect(() => {
        if (query.length > 0) {
            let filtered = MOCK_DATA.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase())
            );

            if (activeFilter !== 'All') {
                filtered = filtered.filter(item => item.type === activeFilter);
            }

            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query, activeFilter]);

    const handleSelect = async (item) => {
        // dispatch(showToast({ type: 'info', text1: 'Selected', text2: item.title }));

        let newRecent = [item.title, ...recentSearches.filter(r => r !== item.title)].slice(0, 5);
        setRecentSearches(newRecent);
        try {
            await AsyncStorage.setItem('recentSearches', JSON.stringify(newRecent));
        } catch (e) {
            console.log('Error saving search:', e);
        }

        onClose();
        // Here you would typically navigation.navigate to detail screen
    };

    const filters = ['All', 'Matches', 'Teams', 'Players', 'News'];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

                {/* Click outside to close */}
                <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

                <SafeAreaView style={[styles.safeArea, { pointerEvents: 'box-none' }]}>
                    <View style={[styles.modalWrapper, { alignItems: 'center' }]}>
                        {/* Floating Modal Card */}
                        <View style={[
                            styles.modalCard,
                            {
                                width: cardWidth,
                                maxHeight: cardMaxHeight
                            }
                        ]}>

                            {/* Header: Input + Close */}
                            <View style={styles.headerRow}>
                                <View style={styles.searchContainer}>
                                    <Ionicons name="search" size={20} color={theme.colors.textMuted} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Search..."
                                        placeholderTextColor={theme.colors.textMuted}
                                        value={query}
                                        onChangeText={setQuery}
                                        autoFocus
                                    />
                                    {query.length > 0 && (
                                        <TouchableOpacity onPress={() => setQuery('')}>
                                            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Filter Chips */}
                            <View style={styles.filterRow}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                                    {filters.map(filter => (
                                        <TouchableOpacity
                                            key={filter}
                                            style={[
                                                styles.chip,
                                                activeFilter === filter && styles.chipActive
                                            ]}
                                            onPress={() => setActiveFilter(filter)}
                                        >
                                            <Text style={[
                                                styles.chipText,
                                                activeFilter === filter && styles.chipTextActive
                                            ]}>{filter}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.divider} />

                            {/* Content Area */}
                            <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                                {query.length === 0 ? (
                                    // Empty State / Recent
                                    recentSearches.length === 0 ? (
                                        <View style={styles.emptyState}>
                                            <View style={styles.emptyIconBg}>
                                                <Ionicons name="search-outline" size={40} color={theme.colors.textMuted} />
                                            </View>
                                            <Text style={styles.emptyTitle}>Search SportFlash</Text>
                                            <Text style={styles.emptySub}>Find matches, teams, and news</Text>
                                        </View>
                                    ) : (
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                                <Text style={styles.sectionHeader}>RECENT</Text>
                                                <TouchableOpacity onPress={clearRecentSearches}>
                                                    <Text style={{ color: theme.colors.primary, fontSize: 13 }}>Clear</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {recentSearches.map((item, index) => (
                                                <TouchableOpacity key={index} style={styles.recentItem} onPress={() => setQuery(item)}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                        <Ionicons name="time-outline" size={16} color={theme.colors.textMuted} />
                                                        <Text style={styles.recentText}>{item}</Text>
                                                    </View>
                                                    <Ionicons name="arrow-forward-outline" size={16} color={theme.colors.textMuted} />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )
                                ) : (
                                    // Results
                                    <View>
                                        {results.length === 0 ? (
                                            <View style={styles.emptyState}>
                                                <Text style={styles.noResults}>No results found for "{query}"</Text>
                                            </View>
                                        ) : (
                                            results.map(item => (
                                                <TouchableOpacity key={item.id} style={styles.resultItem} onPress={() => handleSelect(item)}>
                                                    <View style={styles.iconBox}>
                                                        <Ionicons name={item.icon} size={20} color={theme.colors.text} />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.itemTitle}>{item.title}</Text>
                                                        <Text style={styles.itemSub}>{item.subtitle}</Text>
                                                    </View>
                                                    <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
                                                </TouchableOpacity>
                                            ))
                                        )}
                                    </View>
                                )}
                            </ScrollView>

                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
