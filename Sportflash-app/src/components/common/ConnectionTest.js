import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../utils/theme';
import api from '../services/api';
import socket, { connectSocket, disconnectSocket } from '../services/socket';
import { Ionicons } from '@expo/vector-icons';

/**
 * ConnectionTest Component
 * 
 * This component tests the connection to the backend API and Socket.IO server.
 * Use this to verify that the frontend can communicate with the backend.
 */
export default function ConnectionTest() {
    const [apiStatus, setApiStatus] = useState('pending');
    const [socketStatus, setSocketStatus] = useState('pending');
    const [apiData, setApiData] = useState(null);
    const [socketData, setSocketData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Socket.IO event listeners
        socket.on('connect', () => {
            setSocketStatus('connected');
            console.log('✅ Socket.IO connected');
        });

        socket.on('disconnect', () => {
            setSocketStatus('disconnected');
            console.log('❌ Socket.IO disconnected');
        });

        socket.on('score_update', (data) => {
            setSocketData(data);
            console.log('📊 Score update received:', data);
        });

        socket.on('connect_error', (error) => {
            setSocketStatus('error');
            console.error('❌ Socket.IO connection error:', error);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('score_update');
            socket.off('connect_error');
        };
    }, []);

    const testAPI = async () => {
        setLoading(true);
        setApiStatus('testing');
        try {
            const response = await api.get('/health');
            setApiData(response.data);
            setApiStatus('success');
            console.log('✅ API Health Check:', response.data);
        } catch (error) {
            setApiStatus('error');
            setApiData({ error: error.message });
            console.error('❌ API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const testSocket = () => {
        setSocketStatus('connecting');
        connectSocket();
    };

    const disconnectSocketTest = () => {
        disconnectSocket();
        setSocketStatus('disconnected');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success':
            case 'connected':
                return theme.colors.success;
            case 'error':
            case 'disconnected':
                return theme.colors.danger;
            case 'testing':
            case 'connecting':
                return theme.colors.warning;
            default:
                return theme.colors.textMuted;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
            case 'connected':
                return 'checkmark-circle';
            case 'error':
            case 'disconnected':
                return 'close-circle';
            case 'testing':
            case 'connecting':
                return 'time';
            default:
                return 'help-circle';
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Backend Connection Test</Text>
            <Text style={styles.subtitle}>Verify API and Socket.IO connectivity</Text>

            {/* API Test Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons
                        name={getStatusIcon(apiStatus)}
                        size={24}
                        color={getStatusColor(apiStatus)}
                    />
                    <Text style={styles.sectionTitle}>API Connection</Text>
                </View>

                <View style={styles.statusCard}>
                    <Text style={styles.statusLabel}>Status:</Text>
                    <Text style={[styles.statusValue, { color: getStatusColor(apiStatus) }]}>
                        {apiStatus.toUpperCase()}
                    </Text>
                </View>

                {apiData && (
                    <View style={styles.dataCard}>
                        <Text style={styles.dataLabel}>Response:</Text>
                        <Text style={styles.dataValue}>{JSON.stringify(apiData, null, 2)}</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={testAPI}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={theme.colors.text} />
                    ) : (
                        <Text style={styles.buttonText}>Test API Connection</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Socket.IO Test Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons
                        name={getStatusIcon(socketStatus)}
                        size={24}
                        color={getStatusColor(socketStatus)}
                    />
                    <Text style={styles.sectionTitle}>Socket.IO Connection</Text>
                </View>

                <View style={styles.statusCard}>
                    <Text style={styles.statusLabel}>Status:</Text>
                    <Text style={[styles.statusValue, { color: getStatusColor(socketStatus) }]}>
                        {socketStatus.toUpperCase()}
                    </Text>
                </View>

                {socketData && (
                    <View style={styles.dataCard}>
                        <Text style={styles.dataLabel}>Last Update:</Text>
                        <Text style={styles.dataValue}>{JSON.stringify(socketData, null, 2)}</Text>
                    </View>
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonHalf]}
                        onPress={testSocket}
                    >
                        <Text style={styles.buttonText}>Connect</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonHalf, styles.buttonSecondary]}
                        onPress={disconnectSocketTest}
                    >
                        <Text style={styles.buttonText}>Disconnect</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
                <Text style={styles.infoText}>
                    Make sure the backend server is running on http://localhost:5000
                </Text>
            </View>

            {/* Configuration Info */}
            <View style={styles.configSection}>
                <Text style={styles.configTitle}>Configuration</Text>
                <Text style={styles.configText}>API URL: {api.defaults.baseURL}</Text>
                <Text style={styles.configText}>Socket URL: Check services/socket.js</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: theme.sizes.display,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: theme.sizes.md,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.xl,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.sizes.lg,
        fontWeight: '600',
        color: theme.colors.text,
        marginLeft: theme.spacing.sm,
    },
    statusCard: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: theme.sizes.md,
        color: theme.colors.textMuted,
    },
    statusValue: {
        fontSize: theme.sizes.md,
        fontWeight: 'bold',
    },
    dataCard: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    dataLabel: {
        fontSize: theme.sizes.sm,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.xs,
    },
    dataValue: {
        fontSize: theme.sizes.sm,
        color: theme.colors.text,
        fontFamily: 'monospace',
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonSecondary: {
        backgroundColor: theme.colors.secondary,
    },
    buttonText: {
        color: theme.colors.text,
        fontSize: theme.sizes.md,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    buttonHalf: {
        flex: 1,
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    infoText: {
        flex: 1,
        fontSize: theme.sizes.sm,
        color: theme.colors.primary,
        marginLeft: theme.spacing.sm,
    },
    configSection: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    configTitle: {
        fontSize: theme.sizes.md,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    configText: {
        fontSize: theme.sizes.sm,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.xs,
        fontFamily: 'monospace',
    },
});
