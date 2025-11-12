import { io, Socket } from 'socket.io-client';

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_CHAT_API_URL
    : '/';

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (socket && socket.connected) return socket;

  socket = io(BASE_URL + '/chat', {
    query: { token },
    autoConnect: true,
    transports: ['websocket'],
  });

  socket.on('connect', () => console.log('Socket connected:', socket?.id));
  socket.on('disconnect', (reason) =>
    console.log('Socket disconnected:', reason)
  );
  socket.on('connect_error', (err) =>
    console.error('Socket error:', err.message)
  );

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;
