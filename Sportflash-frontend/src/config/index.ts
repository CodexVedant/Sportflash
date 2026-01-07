// Basic configuration
// Using 10.0.2.2 for Android Emulator access to localhost
// For iOS simulator or web, localhost works, but 10.0.2.2 is safe for Android
import { Platform } from 'react-native';

const LOCAL_IP = '192.168.1.13'; // Replace with your machine's local IP for physical devices
const PORT = '5000';

export const API_BASE_URL = Platform.select({
    android: `http://10.0.2.2:${PORT}/api`,
    ios: `http://localhost:${PORT}/api`,
    web: `http://localhost:${PORT}/api`,
    default: `http://localhost:${PORT}/api`,
});

export const SOCKET_URL = Platform.select({
    android: `http://10.0.2.2:${PORT}`,
    ios: `http://localhost:${PORT}`,
    web: `http://localhost:${PORT}`,
    default: `http://localhost:${PORT}`,
});
