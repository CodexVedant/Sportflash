import axios from 'axios';
import { API_BASE_URL } from '@config';

const api = axios.create({
    baseURL: API_BASE_URL,
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
