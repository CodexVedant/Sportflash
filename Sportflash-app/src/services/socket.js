import io from 'socket.io-client';
import { Platform } from 'react-native';

const getSocketUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5000';
    }
    return 'http://localhost:5000';
};

const socket = io(getSocketUrl(), {
    autoConnect: false,
    transports: ['websocket'], // Force websocket
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

export default socket;
