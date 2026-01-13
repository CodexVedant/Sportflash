import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = (): string => {
    const PORT = '5000';

    // For web platform, always use localhost
    if (Platform.OS === 'web') {
        return `http://127.0.0.1:${PORT}`;
    }

    // Try to get the host from Expo config
    const hostUri = Constants.expoConfig?.hostUri;
    // Default to User's Local IP (Hardcoded for physical device debugging)
    let host = '10.36.177.131';

    if (hostUri) {
        host = hostUri.split(':')[0];
    }

    if (Platform.OS === 'android') {
        // If on emulator, 10.0.2.2 is safe. If on device, use host IP.
        return `http://${host}:${PORT}`;
    }

    // iOS or other
    if (hostUri) {
        return `http://${host}:${PORT}`;
    }

    return `http://127.0.0.1:${PORT}`;
};

export const API_BASE_URL: string = `${getBaseUrl()}/api`;
export const SOCKET_URL: string = getBaseUrl();
