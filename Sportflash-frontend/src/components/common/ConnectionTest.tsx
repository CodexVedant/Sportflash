import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '@utils/theme';
import api from '@services/api';
import socket, { connectSocket, disconnectSocket } from '@services/socket';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@utils/style/ConnectionTest.styles';

/**
 * ConnectionTest Component
 * 
 * This component tests the connection to the backend API and Socket.IO server.
 * Use this to verify that the frontend can communicate with the backend.
 */
export default function ConnectionTest() {
    type Status = 'pending' | 'testing' | 'connecting' | 'connected' | 'disconnected' | 'success' | 'error';

    const [apiStatus, setApiStatus] = useState<Status>('pending');
    const [socketStatus, setSocketStatus] = useState<Status>('pending');
    const [apiData, setApiData] = useState<any>(null);
    const [socketData, setSocketData] = useState<any>(null);
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

        socket.on('score_update', (data: any) => {
            setSocketData(data);
            console.log('📊 Score update received:', data);
        });

        socket.on('connect_error', (error: any) => {
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
        } catch (error: any) {
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

    const getStatusColor = (status: Status) => {
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

    const getStatusIcon = (status: Status) => {
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
                        name={getStatusIcon(apiStatus) as any}
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
                        name={getStatusIcon(socketStatus) as any}
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
