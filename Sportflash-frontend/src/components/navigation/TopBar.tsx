import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@utils/style/TopBar.styles';

interface TabItem {
    id: string;
    label: string;
    icon: any; // Ionicons name
}

interface TopBarProps {
    activeTab: string;
    onTabChange: (id: string) => void;
    tabs: TabItem[];
}

export default function TopBar({ activeTab, onTabChange, tabs }: TopBarProps) {
    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                    onPress={() => onTabChange(tab.id)}
                >
                    <Ionicons
                        name={tab.icon}
                        size={20}
                        color={activeTab === tab.id ? '#fff' : theme.colors.textMuted}
                        style={styles.icon}
                    />
                    <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
