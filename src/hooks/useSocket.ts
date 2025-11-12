// src/hooks/useSocket.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './use-typed-redux';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import {
  setOnlineUsers,
  setTypingUser,
} from '@/store/features/socket/socket.slice';

export const useSocket = (token: string, chatId?: string) => {
  const dispatch = useAppDispatch();
  const onlineUsers = useAppSelector((state) => state.socket.onlineUsers);
  const typingUsers = useAppSelector((state) => state.socket.typingUsers);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    // Listen for online users
    socket.on('online:users', (userIds: string[]) => {
      dispatch(setOnlineUsers(userIds));
    });

    // Listen for typing indicators
    socket.on(
      'typing',
      ({ chatId, userName }: { chatId: string; userName: string }) => {
        dispatch(setTypingUser({ chatId, userName }));
        // Remove typing after 3 seconds
        setTimeout(
          () => dispatch(setTypingUser({ chatId, userName: null })),
          3000
        );
      }
    );

    // Join room if chatId provided
    if (chatId) socket.emit('joinRoom', chatId);

    return () => {
      if (chatId) socket.emit('leaveRoom', chatId);
      socket.off('online:users');
      socket.off('typing');
      disconnectSocket();
    };
  }, [token, chatId, dispatch]);

  const sendMessage = (chatId: string, content: string) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('sendMessage', { chatId, content });
  };

  const sendTyping = (chatId: string) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('typing', { chatId });
  };

  return { onlineUsers, typingUsers, sendMessage, sendTyping };
};
