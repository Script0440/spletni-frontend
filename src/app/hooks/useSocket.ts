// useSocket.ts
import { useCallback } from 'react';
import { getSocket } from '../socket';

type EventCallback = (...args: any[]) => void;

export const useSocket = () => {
  const socket = getSocket();

  const emit = useCallback((event: string, data?: any) => {
    socket.emit(event, data);
  }, [socket]);

  const on = useCallback((event: string, callback: EventCallback) => {
    socket.on(event, callback);
  }, [socket]);

  const off = useCallback((event: string, callback?: EventCallback) => {
    socket.off(event, callback);
  }, [socket]);

  return { emit, on, off, socket };
};
