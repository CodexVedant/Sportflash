import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Match } from '@app-types/models/match';
import { Theme } from '@utils/theme'; // Assuming theme type

interface NotificationOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    match: Match | null;
    onSave: (preferences: NotificationPreferences) => void;
    initialPreferences?: { [key: string]: boolean };
}

export interface NotificationPreferences {
    match: boolean;
    series: boolean;
    homeTeam: boolean;
    awayTeam: boolean;
}

export default function NotificationOptionsModal({ visible, onClose, match, onSave, initialPreferences = {} }: NotificationOptionsModalProps) {
    const theme = useTheme();
    const styles = makeStyles(theme);

    const [preferences, setPreferences] = useState<NotificationPreferences>({
        match: false,
        series: false,
        homeTeam: false,
        awayTeam: false,
    });

    useEffect(() => {
        if (visible && match) {
            setPreferences({
                match: initialPreferences[`match_${match.id}`] || false,
                series: initialPreferences[`series_${match.league}`] || false,
                homeTeam: initialPreferences[`team_${match.homeTeam?.name}`] || false,
                awayTeam: initialPreferences[`team_${match.awayTeam?.name}`] || false,
            });
        }
    }, [visible, match, initialPreferences]);

    const handleSave = () => {
        onSave(preferences);
        onClose();
    };

    const toggle = (key: keyof NotificationPreferences) => setPreferences(prev => ({ ...prev, [key]: !prev[key] }));

    if (!match) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Customize Notifications</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.subtitle}>Select what you want to follow:</Text>

                        {/* This Match */}
                        <View style={styles.optionRow}>
                            <View style={styles.labelContainer}>
                                <Ionicons name="notifications-outline" size={20} color={theme.colors.primary} />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.optionTitle}>This Match</Text>
                                    <Text style={styles.optionDesc}>{match.homeTeam?.name} vs {match.awayTeam?.name}</Text>
                                </View>
                            </View>
                            <Switch
                                value={preferences.match}
                                onValueChange={() => toggle('match')}
                                trackColor={{ true: theme.colors.primary, false: theme.colors.surface }}
                                thumbColor={'#fff'}
                            />
                        </View>

                        {/* Series/League */}
                        <View style={styles.optionRow}>
                            <View style={styles.labelContainer}>
                                <Ionicons name="trophy-outline" size={20} color={theme.colors.textMuted} />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.optionTitle}>Series / League</Text>
                                    <Text style={styles.optionDesc}>
                                        All matches in {typeof match.league === 'string' ? match.league : (match.league as any)?.name || 'this league'}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={preferences.series}
                                onValueChange={() => toggle('series')}
                                trackColor={{ true: theme.colors.primary, false: theme.colors.surface }}
                                thumbColor={'#fff'}
                            />
                        </View>

                        {/* Home Team */}
                        <View style={styles.optionRow}>
                            <View style={styles.labelContainer}>
                                <Ionicons name="shirt-outline" size={20} color={theme.colors.textMuted} />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.optionTitle}>{match.homeTeam?.name}</Text>
                                    <Text style={styles.optionDesc}>All matches for {match.homeTeam?.name}</Text>
                                </View>
                            </View>
                            <Switch
                                value={preferences.homeTeam}
                                onValueChange={() => toggle('homeTeam')}
                                trackColor={{ true: theme.colors.primary, false: theme.colors.surface }}
                                thumbColor={'#fff'}
                            />
                        </View>

                        {/* Away Team */}
                        <View style={styles.optionRow}>
                            <View style={styles.labelContainer}>
                                <Ionicons name="shirt-outline" size={20} color={theme.colors.textMuted} />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.optionTitle}>{match.awayTeam?.name}</Text>
                                    <Text style={styles.optionDesc}>All matches for {match.awayTeam?.name}</Text>
                                </View>
                            </View>
                            <Switch
                                value={preferences.awayTeam}
                                onValueChange={() => toggle('awayTeam')}
                                trackColor={{ true: theme.colors.primary, false: theme.colors.surface }}
                                thumbColor={'#fff'}
                            />
                        </View>

                        {/* Action Buttons */}
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveText}>Save Preferences</Text>
                        </TouchableOpacity>

                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
}

const makeStyles = (theme: any) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: theme.colors.background, // Using background for better contrast in dark mode
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    subtitle: {
        color: theme.colors.textMuted,
        marginBottom: 20,
        fontSize: 14,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionTitle: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    optionDesc: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    saveBtn: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    saveText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
