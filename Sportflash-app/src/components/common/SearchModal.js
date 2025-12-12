import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { useToast } from '../../context/ToastContext';

const { width, height } = Dimensions.get('window');

export default function SearchModal({ visible, onClose }) {
    const [query, setQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState([]); // Empty by default to show empty state
    const [results, setResults] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const { showToast } = useToast();

    // Mock Search Data
    const MOCK_DATA = [
        { id: 1, title: 'India vs Australia', subtitle: 'Live • Cricket', icon: 'baseball-outline', type: 'Matches' },
        { id: 2, title: 'Man Utd vs Chelsea', subtitle: 'Live • Football', icon: 'football-outline', type: 'Matches' },
        { id: 3, title: 'Lakers vs Warriors', subtitle: 'Live • Basketball', icon: 'basketball-outline', type: 'Matches' },
        { id: 4, title: 'Virat Kohli', subtitle: 'Player • India', icon: 'person-outline', type: 'Players' },
        { id: 5, title: 'Mumbai Indians', subtitle: 'Team • IPL', icon: 'people-outline', type: 'Teams' },
        { id: 6, title: 'World Cup Finals', subtitle: 'News • 2h ago', icon: 'newspaper-outline', type: 'News' },
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

    const handleSelect = (item) => {
        showToast(`Selected: ${item.title}`);
        if (!recentSearches.includes(item.title)) {
            setRecentSearches([item.title, ...recentSearches].slice(0, 5));
        }
        onClose();
    };

    const filters = ['All', 'Matches', 'Teams', 'Players', 'News'];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Clicking outside closes the modal */}
                <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

                {/* Floating Modal Card */}
                <View style={styles.modalCard}>

                    {/* Header: Input + Close */}
                    <View style={styles.headerRow}>
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color={theme.colors.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="Search matches, teams, players..."
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
                            <Ionicons name="close" size={24} color={theme.colors.textMuted} />
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
                                        <Ionicons name="time-outline" size={40} color={theme.colors.textMuted} />
                                    </View>
                                    <Text style={styles.emptyTitle}>No recent searches</Text>
                                    <Text style={styles.emptySub}>Start typing to search for matches, teams, players, or news</Text>
                                </View>
                            ) : (
                                <View>
                                    <Text style={styles.sectionHeader}>RECENT SEARCHES</Text>
                                    {recentSearches.map((item, index) => (
                                        <TouchableOpacity key={index} style={styles.recentItem} onPress={() => setQuery(item)}>
                                            <Ionicons name="time-outline" size={18} color={theme.colors.textMuted} />
                                            <Text style={styles.recentText}>{item}</Text>
                                            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.2)" style={{ marginLeft: 'auto' }} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )
                        ) : (
                            // Results
                            <View>
                                {results.length === 0 ? (
                                    <Text style={styles.noResults}>No results found.</Text>
                                ) : (
                                    results.map(item => (
                                        <TouchableOpacity key={item.id} style={styles.resultItem} onPress={() => handleSelect(item)}>
                                            <View style={styles.iconBox}>
                                                <Ionicons name={item.icon} size={20} color={theme.colors.text} />
                                            </View>
                                            <View>
                                                <Text style={styles.itemTitle}>{item.title}</Text>
                                                <Text style={styles.itemSub}>{item.subtitle}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </View>
                        )}
                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 60, // Top margin
        alignItems: 'center',
    },
    modalCard: {
        width: width * 0.95,
        height: height * 0.6, // Fixed height card
        backgroundColor: '#1E293B', // Slate 800ish (Cards)
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        gap: 10,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
        fontFamily: theme.fonts?.medium || 'System',
    },
    closeBtn: {
        padding: 4,
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
        flex: 1,
        padding: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        opacity: 0.7,
    },
    emptyIconBg: {
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyTitle: {
        color: theme.colors.text,
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    emptySub: {
        color: theme.colors.textMuted,
        fontSize: 13,
        textAlign: 'center',
        maxWidth: 250,
        lineHeight: 20,
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        gap: 12,
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
        marginTop: 20,
    },
});
