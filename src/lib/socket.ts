import { io, Socket } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_CHAT_API_URL;

let socket: Socket | null = null;

/** Debug logging helper */
const log = (...args: unknown[]) => console.log('[Socket]', ...args);

/**
 * Connect to WebSocket server
 * Uses access_token from sessionStorage
 */
export const connectSocket = (): Socket => {
  if (socket && socket.connected) {
    log('Already connected:', socket.id);
    return socket;
  }

  const token = sessionStorage.getItem('access_token');
  if (!token) {
    console.warn('[Socket] No access_token found in sessionStorage');
  }

  log('Connecting to socket server...');

  socket = io(`${BASE_URL}/chat`, {
    auth: { token },          // JWT sent to backend
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    log('Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    log('Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    log('Connect error:', err.message, err);
  });

  // Optional global event listeners
  socket.on('typing', (data: { chatId: string; userId: string; userName: string }) => {
    log('Typing event:', data);
  });

  socket.on('newMessage', (message) => {
    log('New message received:', message);
  });

  return socket;
};

/** Disconnect socket safely */
export const disconnectSocket = () => {
  if (socket) {
    log('Manually disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
};

/** Get current socket instance */
export const getSocket = (): Socket | null => socket;

/** Emit new message */
export const sendMessage = (chatId: string, content: string) => {
  if (!socket || !socket.connected) {
    log('Cannot send message, socket not connected');
    return;
  }
  log(`Sending message to chat ${chatId}:`, content);
  socket.emit('sendMessage', { chatId, content });
};

/** Emit typing */
export const emitTyping = (chatId: string) => {
  if (!socket || !socket.connected) return;
  log(`Emitting typing event in chat ${chatId}`);
  socket.emit('typing', { chatId });
};
