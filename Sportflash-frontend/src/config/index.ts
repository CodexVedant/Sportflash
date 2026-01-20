// Basic configuration
// Using 10.0.2.2 for Android Emulator access to localhost
// For iOS simulator or web, localhost works, but 10.0.2.2 is safe for Android
import { Platform } from 'react-native';

const LOCAL_IP = '192.168.1.7'; // Found from Metro logs
const PORT = '5000';

export const API_BASE_URL = Platform.select({
    android: `http://${LOCAL_IP}:${PORT}/api`,
    ios: `http://${LOCAL_IP}:${PORT}/api`,
    web: `http://localhost:${PORT}/api`,
    default: `http://${LOCAL_IP}:${PORT}/api`,
});

export const SOCKET_URL = Platform.select({
    android: `http://${LOCAL_IP}:${PORT}`,
    ios: `http://${LOCAL_IP}:${PORT}`,
    web: `http://localhost:${PORT}`,
    default: `http://${LOCAL_IP}:${PORT}`,
});
