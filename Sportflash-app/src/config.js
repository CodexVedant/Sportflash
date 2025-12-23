import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = () => {
    const PORT = '5000';

    // For web platform, always use localhost
    if (Platform.OS === 'web') {
        return `http://127.0.0.1:${PORT}`;
    }

    // Try to get the host from Expo config (works for LAN IP on physical devices)
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    let host = '10.0.2.2'; // Default Android Emulator

    if (hostUri) {
        host = hostUri.split(':')[0];
    }

    if (Platform.OS === 'android') {
        // If on emulator, 10.0.2.2 is safe. If on device, use host IP.
        // Determining if emulator vs device is tricky, but hostUri usually exists in development.
        return `http://${host}:${PORT}`;
    }

    // iOS or other
    if (hostUri) {
        return `http://${host}:${PORT}`;
    }

    return `http://127.0.0.1:${PORT}`;
};

export const API_BASE_URL = `${getBaseUrl()}/api`;
export const SOCKET_URL = getBaseUrl();
