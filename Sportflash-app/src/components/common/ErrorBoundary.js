import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';

// Error Boundary Class Component
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallback
                    error={this.state.error}
                    resetError={this.handleReset}
                    showDetails={this.props.showDetails}
                />
            );
        }

        return this.props.children;
    }
}

// Error Fallback UI
export const ErrorFallback = ({ error, resetError, showDetails = false }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={80} color="#EF4444" />
            </View>

            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.subtitle}>
                We encountered an unexpected error. Please try again.
            </Text>

            {showDetails && error && (
                <View style={styles.errorDetails}>
                    <Text style={styles.errorText}>{error.toString()}</Text>
                </View>
            )}

            <TouchableOpacity style={styles.retryButton} onPress={resetError}>
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );
};

// Network Error Component
export const NetworkError = ({ onRetry, message }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="cloud-offline-outline" size={80} color={theme.colors.textMuted} />
            </View>

            <Text style={styles.title}>No Internet Connection</Text>
            <Text style={styles.subtitle}>
                {message || 'Please check your internet connection and try again.'}
            </Text>

            {onRetry && (
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Ionicons name="refresh" size={20} color="#fff" />
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// API Error Component
export const ApiError = ({ onRetry, message, statusCode }) => {
    const getErrorMessage = () => {
        if (message) return message;

        switch (statusCode) {
            case 400:
                return 'Bad request. Please check your input.';
            case 401:
                return 'Unauthorized. Please log in again.';
            case 403:
                return 'Access forbidden.';
            case 404:
                return 'Resource not found.';
            case 500:
                return 'Server error. Please try again later.';
            case 503:
                return 'Service unavailable. Please try again later.';
            default:
                return 'An error occurred. Please try again.';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="warning-outline" size={80} color="#F59E0B" />
            </View>

            <Text style={styles.title}>Request Failed</Text>
            <Text style={styles.subtitle}>{getErrorMessage()}</Text>

            {statusCode && (
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Error {statusCode}</Text>
                </View>
            )}

            {onRetry && (
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Ionicons name="refresh" size={20} color="#fff" />
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// Generic Error Message Component
export const ErrorMessage = ({ message, onDismiss, type = 'error' }) => {
    const getIconAndColor = () => {
        switch (type) {
            case 'warning':
                return { icon: 'warning', color: '#F59E0B' };
            case 'info':
                return { icon: 'information-circle', color: '#3B82F6' };
            case 'success':
                return { icon: 'checkmark-circle', color: '#10B981' };
            default:
                return { icon: 'alert-circle', color: '#EF4444' };
        }
    };

    const { icon, color } = getIconAndColor();

    return (
        <View style={[styles.messageContainer, { borderLeftColor: color }]}>
            <Ionicons name={icon} size={24} color={color} />
            <Text style={styles.messageText}>{message}</Text>
            {onDismiss && (
                <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
                    <Ionicons name="close" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: theme.colors.background,
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: theme.fonts?.bold || 'System',
        color: theme.colors.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: theme.fonts?.regular || 'System',
        color: theme.colors.textMuted,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
        marginBottom: 24,
    },
    errorDetails: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        maxWidth: 350,
    },
    errorText: {
        fontSize: 13,
        fontFamily: 'monospace',
        color: '#EF4444',
        textAlign: 'left',
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 24,
        gap: 8,
    },
    retryText: {
        fontSize: 16,
        fontFamily: theme.fonts?.medium || 'System',
        color: '#fff',
    },
    statusBadge: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        marginBottom: 24,
    },
    statusText: {
        fontSize: 14,
        fontFamily: theme.fonts?.medium || 'System',
        color: '#F59E0B',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        gap: 12,
        margin: 16,
    },
    messageText: {
        flex: 1,
        fontSize: 14,
        fontFamily: theme.fonts?.regular || 'System',
        color: theme.colors.text,
        lineHeight: 20,
    },
    dismissButton: {
        padding: 4,
    },
});

export default ErrorBoundary;
