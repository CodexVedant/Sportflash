import io from 'socket.io-client';
import { Platform } from 'react-native';
import { SOCKET_URL } from '@config';

const socket = io(SOCKET_URL, {
    autoConnect: true,
    // Use polling+websocket for better compatibility on all platforms
    transports: ['polling', 'websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 10000,
    // Web-specific CORS handling
    ...(Platform.OS === 'web' && {
        withCredentials: false,
        extraHeaders: {
            'Access-Control-Allow-Origin': '*'
        }
    })
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

// Log connection status for debugging
socket.on('connect', () => {
    console.log(`✅ Socket connected on ${Platform.OS}`);
});

socket.on('disconnect', (reason) => {
    console.log(`❌ Socket disconnected: ${reason}`);
});

socket.on('connect_error', (error) => {
    console.error(`🔴 Socket connection error on ${Platform.OS}:`, error.message);
});

export default socket;

