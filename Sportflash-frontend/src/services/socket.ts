import io, { Socket } from 'socket.io-client';
import { Platform } from 'react-native';
import { SOCKET_URL } from '@config';

interface SocketOptions {
    autoConnect: boolean;
    transports: string[];
    reconnection: boolean;
    reconnectionDelay: number;
    reconnectionAttempts: number;
    timeout: number;
    withCredentials?: boolean;
    extraHeaders?: {
        [key: string]: string;
    };
}

const options: SocketOptions = {
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
};

const socket: Socket = io(SOCKET_URL, options);

export const connectSocket = (): void => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = (): void => {
    if (socket.connected) {
        socket.disconnect();
    }
};

// Log connection status for debugging
socket.on('connect', () => {
    console.log(`✅ Socket connected on ${Platform.OS}`);
});

socket.on('disconnect', (reason: Socket.DisconnectReason) => {
    console.log(`❌ Socket disconnected: ${reason}`);
});

socket.on('connect_error', (error: Error) => {
    console.error(`🔴 Socket connection error on ${Platform.OS}:`, error.message);
});

export default socket;
