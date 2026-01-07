import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@utils/theme';
import { styles } from '@utils/style/ErrorBoundary.styles';

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
export default ErrorBoundary;
