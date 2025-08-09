// socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (url: string) => {
  if (!socket) {
    socket = io(url, {
      transports: ['websocket'],
    });
    console.log('[socket] Connected to:', url);
  }
  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error('Socket not connected. Call connectSocket first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('[socket] Disconnected');
    socket = null;
  }
};
