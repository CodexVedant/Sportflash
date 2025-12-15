import { Platform } from 'react-native';

const DEV_API_URL = 'http://localhost:5000';
const ANDROID_API_URL = 'http://10.0.2.2:5000';

const getBaseUrl = () => {
    if (Platform.OS === 'android') {
        return ANDROID_API_URL;
    }
    return DEV_API_URL;
};

export const API_BASE_URL = `${getBaseUrl()}/api`;
export const SOCKET_URL = getBaseUrl();
