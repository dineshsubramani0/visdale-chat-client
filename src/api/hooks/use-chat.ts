import { useQuery, useMutation, useQueryClient, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
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

  /** Infinite messages query */
  const useMessagesInfiniteQuery = (roomId?: string, limit = 10) =>
    useInfiniteQuery<
      MessageResponse[], // TQueryFnData: query function return type
      Error,             // TError
      MessageResponse[]  // TData: cache type
    >({
      queryKey: ['chat_messages', roomId, limit],
      queryFn: async (context) => {
        const pageParam = (context.pageParam as number) ?? 1; 
        if (!roomId) return [];
        const res = await getMessages(roomId, limit, pageParam);
        return res?.data ?? [];
      },
      initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
        // Check the 'lastPage' flag from the *server response*.
        // If true, it means we have reached the beginning of the chat history.
        if (lastPage.lastPage) {
          return undefined; // Stop loading
        }

        // Calculate the next offset based on the total number of pages loaded so far
        // allPages.length gives us the count of already loaded pages (e.g., 1, 2, 3...)
        const nextOffset = allPages.length * limit;
        return nextOffset;
      },
      enabled: !!roomId,
      placeholderData: keepPreviousData,
      refetchOnReconnect: false,
      staleTime: 0,
    });


  /** Send message mutation */
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
          const now = new Date().toISOString();

          if (!old) {
            return {
              status_code: 200,
              data: [newMessage],
              messages: [newMessage],
              time_stamp: now,
              currentPage: 1,
              lastPage: true,
              totalPages: 1,
            } as unknown as MessageListResponse;
          }

          const updatedData = [...old.data, newMessage];
          const updatedMessages = [...old.data, newMessage];

          return {
            ...old,
            data: updatedData,
            messages: updatedMessages,
          };
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
    useMessagesInfiniteQuery, // <-- infinite scroll
    sendMessageMutation,
  };
};
