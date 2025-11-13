import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './use-typed-redux';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import { setOnlineUsers, setTypingUser } from '@/store/features/socket/socket.slice';
import { useQueryClient } from '@tanstack/react-query';
import type { MessageResponse } from '@/@types/chat/chat.interface';

export const useSocket = (token: string, chatId?: string) => {
  const dispatch = useAppDispatch();
  const onlineUsers = useAppSelector((state) => state.socket.onlineUsers);
  const typingUsers = useAppSelector((state) => state.socket.typingUsers);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    socket.on('online:users', (userIds: string[]) => dispatch(setOnlineUsers(userIds)));

    socket.on('typing', ({ chatId, userName }: { chatId: string; userName: string }) => {
      dispatch(setTypingUser({ chatId, userName }));
      setTimeout(() => dispatch(setTypingUser({ chatId, userName: null })), 3000);
    });

    socket.on('newMessage', (message: MessageResponse) => {
      if (!chatId) return;

      queryClient.setQueryData<MessageResponse[]>(['messages', chatId], (oldData) => {
        if (!oldData) return [message];
        return [...oldData, message];
      });
    });
    if (chatId) socket.emit('joinRoom', chatId);

    return () => {
      if (chatId) socket.emit('leaveRoom', chatId);
      socket.off('online:users');
      socket.off('typing');
      socket.off('newMessage');
      disconnectSocket();
    };
  }, [token, chatId, dispatch]);

  const sendMessage = (chatId: string, content: string) => {
    getSocket()?.emit('sendMessage', { chatId, content });
  };

  const sendTyping = (chatId: string) => {
    getSocket()?.emit('typing', { chatId });
  };

  return { onlineUsers, typingUsers, sendMessage, sendTyping };
};
