import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from './use-typed-redux';
import { setOnlineUsers, setTypingUser } from '@/store/features/socket/socket.slice';
import { useQueryClient } from '@tanstack/react-query';
import type { MessageList, MessageResponse } from '@/@types/chat/chat.interface';
import type { UserProfile } from '@/@types/auth/user.inferface';

const BASE_URL = import.meta.env.VITE_CHAT_API_URL;

// Singleton socket instance
let socket: Socket | null = null;

/** Connect to Socket.io server */
export const connectSocket = () => {
  if (socket && socket.connected) {
    console.log('[Socket] Already connected:', socket.id);
    return socket;
  }

  console.log('[Socket] Connecting to socket server...');
  socket = io(`${BASE_URL}/chat`, {
    auth: { token: sessionStorage.getItem('access_token') || '' },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => console.log('[Socket] Connected:', socket?.id));
  socket.on('disconnect', (reason) => console.log('[Socket] Disconnected:', reason));
  socket.on('connect_error', (err) => console.error('[Socket] Connect error:', err.message));
  socket.io.on('reconnect_attempt', (attempt) => console.log('[Socket] Reconnect attempt:', attempt));
  socket.io.on('reconnect_error', (err) => console.error('[Socket] Reconnect error:', err));

  return socket;
};

/** Disconnect socket manually */
export const disconnectSocket = () => {
  if (socket) {
    console.log('[Socket] Manually disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
};

/** Get current socket instance */
export const getSocket = () => socket;

/** Custom hook for socket logic */
export const useSocket = (user: UserProfile | null, chatId?: string) => {
  const dispatch = useAppDispatch();
  const onlineUsers = useAppSelector((state) => state.socket.onlineUsers);
  const typingUsers = useAppSelector((state) => state.socket.typingUsers);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    console.log('[useSocket] Mounting socket hook for user:', user.id);
    const s = connectSocket();

    // Join room
    if (chatId) {
      console.log('[useSocket] Joining room:', chatId);
      s.emit('joinRoom', chatId);
    }

    /** Online users listener */
    const onlineHandler = (userIds: string[]) => {
      console.log('[Socket] Online users:', userIds);
      dispatch(setOnlineUsers(userIds));
    };
    s.on('online:users', onlineHandler);

     /** Handle participants added */
    const participantsAddedHandler = (data: {
      roomId: string;
      addedUserIds: string[];
      addedBy: string;
      participants: { id: string; name: string }[];
    }) => {
      console.log('[Socket] Participants added:', data);
      if (data.roomId) {
         queryClient.invalidateQueries({ queryKey: ['chat_rooms'] })
      }
    };

    s.on('participantsAdded', participantsAddedHandler);

    /** Typing listener */
    const typingHandler = ({ chatId, userName }: { chatId: string; userName: string }) => {
      if (userName === user.id) return; // Ignore self typing
      console.log(`[Socket] Typing in ${chatId}: ${userName}`);
      dispatch(setTypingUser({ chatId, userName }));
      setTimeout(() => dispatch(setTypingUser({ chatId, userName: null })), 3000);
    };
    s.on('typing', typingHandler);

    /** New message listener with cache validation */
    const updateQueryData = (
      queryKey: readonly unknown[],
      message: MessageResponse
    ): MessageList => {
      const old = queryClient.getQueryData<MessageList>(queryKey);

      console.log('[Socket] Updating query data for', old);

      // If no previous data, create the initial structure
      if (!old) {
        return {
          pages: [
            {
              currentPage: 1,
              lastPage: true,
              totalPages: 1,
              messages: [message],
            },
          ],
          pageParams: [1],
        };
      }

      // Check if the message already exists in the first page
      const exists = old.pages[0]?.messages.some((m) => m.id === message.id);
      if (exists) return old;

      // Add new message to the start or end of first page (depending on your order preference)
      return {
        ...old,
        pages: [
          {
            ...old.pages[0],
            messages: [...old.pages[0].messages, message],
          },
          ...old.pages.slice(1),
        ],
      };
    };


    const messageHandler = (message: MessageResponse) => {
      console.log('[Socket] New message received:', message);

      // Find all chat_messages queries
      const queries = queryClient.getQueryCache().findAll({
        predicate: (query) => query.queryKey[0] === 'chat_messages',
      });

      for (const query of queries) {
        const queryKey = query.queryKey;
        const roomId = queryKey[1];
        if (roomId !== message.chatId) continue;

        const newData = updateQueryData(queryKey, message);
        queryClient.setQueryData<MessageList>(queryKey, newData);
      }
    };

    s.on('newMessage', messageHandler);

    /** Cleanup listeners on unmount */
    return () => {
      console.log('[useSocket] Cleanup socket for chat:', chatId);
      if (chatId) s.emit('leaveRoom', chatId);
      s.off('online:users', onlineHandler);
      s.off('typing', typingHandler);
      s.off('newMessage', messageHandler);
    };
  }, [user, chatId, dispatch, queryClient]);

  /** Send a chat message */
  const sendMessage = (chatId: string, content: string, image?: string) => {
    console.log('[Socket] Sending message to', chatId, content, image);
    getSocket()?.emit('sendMessage', { chatId, content, image });
  };

  /** Send typing event */
  const sendTyping = (chatId: string) => {
    getSocket()?.emit('typing', { chatId });
  };

  const emitAddParticipants = (roomId: string, userIds: string[]) => {
    getSocket()?.emit('addParticipants', { roomId, userIds });
  };

  return { onlineUsers, typingUsers, sendMessage, sendTyping, emitAddParticipants };
};
