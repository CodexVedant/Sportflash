import axios from 'axios';
import { Platform } from 'react-native';

// Helper to determine base URL based on platform
// Android Emulator uses 10.0.2.2 to access host machine localhost
const getBaseUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5000/api';
    }
    // iOS Simulator and Web use localhost
    return 'http://localhost:5000/api';
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor (useful for auth tokens later)
api.interceptors.request.use(
    (config) => {
        // TODO: specific token logic here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
