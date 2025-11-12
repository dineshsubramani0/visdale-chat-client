import { useQuery, useMutation } from '@tanstack/react-query';
import { useChatApi } from '../endpoints/use-chat-api';
import type {
  ChatListResponse,
  CreateGroupResponse,
  User,
  UserListResponse,
} from '@/@types/chat/chat.interface';

export const useChat = () => {
  const { listRooms, createRoom, getRoom, listUser } = useChatApi();

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
      enabled: !!roomId, // run only if roomId exists
    });

  /** Fetch all users */
  const userQuery = useQuery<UserListResponse>({
    queryKey: ['users_list'],
    queryFn: async () => {
      const response = await listUser();
      if (!response) throw new Error('Failed to fetch rooms');
      return response;
    },
  });

  return { roomsQuery, createGroupMutation, useRoomQuery, userQuery };
};
