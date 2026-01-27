import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_URL } from '@config';

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

import AsyncStorage from '@react-native-async-storage/async-storage';

// Request interceptor
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }
);

export default api;
