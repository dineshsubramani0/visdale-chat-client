import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useChatApi } from '../endpoints/use-chat-api';
import type {
  ChatListResponse,
  CreateGroupResponse,
  UserListResponse,
  MessageResponse,
  MessageListResponse,
  SendMessageRequest,
} from '@/@types/chat/chat.interface';

export const useChat = () => {
  const {
    listRooms,
    createRoom,
    getRoom,
    listUser,
    addParticipants,
    getMessages,
    sendMessage,
  } = useChatApi();
  const queryClient = useQueryClient();

  /** Fetch all rooms */
  const roomsQuery = useQuery<ChatListResponse>({
    queryKey: ['chat_rooms'],
    queryFn: async () => {
      const response = await listRooms();
      if (!response) throw new Error('Failed to fetch rooms');
      return response;
    },
  });

  /** Create new group room */
  const createGroupMutation = useMutation<
    CreateGroupResponse,
    unknown,
    { groupName: string; participants: string[] }
  >({
    mutationFn: (data) =>
      createRoom({
        isGroup: true,
        groupName: data.groupName,
        participants: data.participants,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['chat_rooms'] }),
  });

  /** Fetch a single room by ID */
  const useRoomQuery = (roomId?: string) =>
    useQuery<CreateGroupResponse | null>({
      queryKey: ['chat_room', roomId],
      queryFn: async () => {
        if (!roomId) throw new Error('Room ID is required');
        const response = await getRoom(roomId);
        if (!response) throw new Error('Room not found');
        return response;
      },
      enabled: !!roomId,
    });

  /** Fetch all users */
  const userQuery = useQuery<UserListResponse>({
    queryKey: ['users_list'],
    queryFn: async () => {
      const response = await listUser();
      if (!response) throw new Error('Failed to fetch users');
      return response;
    },
  });

  /** Add participants to an existing room */
  const addParticipantsMutation = useMutation<
    CreateGroupResponse,
    unknown,
    { roomId: string; userIds: string[] }
  >({
    mutationFn: ({ roomId, userIds }) => addParticipants(roomId, userIds),
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: ['users_list'] });
      queryClient.invalidateQueries({ queryKey: ['chat_room', roomId] });
    },
  });

  /** Fetch messages for a room */
  const useMessagesQuery = (roomId?: string, limit?: number, offset?: number) =>
    useQuery<MessageListResponse | null>({
      queryKey: ['chat_messages', roomId, limit, offset],
      queryFn: async () => {
        if (!roomId) return null;
        const messages = await getMessages(roomId, limit, offset);
        return messages;
      },
      enabled: !!roomId,
    });

  const sendMessageMutation = useMutation<
    MessageResponse,
    unknown,
    SendMessageRequest
  >({
    mutationFn: async (data) => {
      const response = await sendMessage(data.chatId, data);
      if (!response || !response.data.length)
        throw new Error('Failed to send message');
      return response.data[0];
    },
    onSuccess: (newMessage, variables) => {
      // Update messages cache
      queryClient.setQueryData<MessageListResponse>(
        ['chat_messages', variables.chatId],
        (old) => {
          if (!old)
            return {
              status_code: 200,
              data: [newMessage],
              time_stamp: new Date().toISOString(),
            };
          return { ...old, data: [...old.data, newMessage] };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['chat_rooms'] });
    },
  });

  return {
    roomsQuery,
    createGroupMutation,
    useRoomQuery,
    userQuery,
    addParticipantsMutation,
    useMessagesQuery,
    sendMessageMutation,
  };
};
