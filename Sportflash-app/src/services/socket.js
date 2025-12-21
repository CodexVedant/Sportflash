import io from 'socket.io-client';
import { SOCKET_URL } from '@config';

const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['polling', 'websocket'],
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
