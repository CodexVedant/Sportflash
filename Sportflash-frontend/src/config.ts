import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Environment configuration
const ENV = {
    // Set to 'production' to use Render backend, 'development' for local
    MODE: process.env.NODE_ENV || 'development',

    // Production backend URL (Render)
    PRODUCTION_URL: 'https://sportflash-backend-1.onrender.com',

    // Local development port
    LOCAL_PORT: '5000'
};

const getBaseUrl = (): string => {
    // Use production URL if in production mode
    if (ENV.MODE === 'production') {
        return ENV.PRODUCTION_URL;
    }

    // Development mode - use local backend
    const PORT = ENV.LOCAL_PORT;

    // For web platform, always use localhost
    if (Platform.OS === 'web') {
        return `http://localhost:${PORT}`;
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

// Log current configuration (helpful for debugging)
// Uncomment below to see API configuration in console
// console.log(`🔧 API Configuration:
//   Mode: ${ENV.MODE}
//   API URL: ${API_BASE_URL}
//   Socket URL: ${SOCKET_URL}
// `);
