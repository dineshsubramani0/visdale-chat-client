import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useChatApi } from '../endpoints/use-chat-api';
import type {
  ChatListResponse,
  CreateGroupResponse,
  UserListResponse,
} from '@/@types/chat/chat.interface';

export const useChat = () => {
  const { listRooms, createRoom, getRoom, listUser, addParticipants } =
    useChatApi();
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
      }) as Promise<CreateGroupResponse>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat_rooms'] });
    },
  });

  /** Fetch a single room by ID */
  const useRoomQuery = (roomId: string | undefined) =>
    useQuery<CreateGroupResponse>({
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

  return {
    roomsQuery,
    createGroupMutation,
    useRoomQuery,
    userQuery,
    addParticipantsMutation,
  };
};
