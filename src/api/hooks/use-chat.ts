import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useChatApi } from '../endpoints/use-chat-api';
import type { ChatRoom } from '@/@types/chat/chat.interface';

export const useChat = () => {
  const { listRooms, createRoom } = useChatApi();
  const queryClient = useQueryClient();

  const roomsQuery = useQuery<ChatRoom[]>({
    queryKey: ['chat_rooms'],
    queryFn: async () => {
      const response = await listRooms();
      if (!response) throw new Error('Failed to fetch rooms');
      return response;
    },
  });

  const createGroupMutation = useMutation<ChatRoom, unknown, { groupName: string; participants: string[] }>({
    mutationFn: (data) =>
      createRoom({ isGroup: true, groupName: data.groupName, participants: data.participants }) as Promise<ChatRoom>,
    onSuccess: (newGroup: ChatRoom) => {
      queryClient.setQueryData<ChatRoom[]>(['chat_rooms'], (old) =>
        old ? [newGroup, ...old] : [newGroup]
      );
    },
  });

  return { roomsQuery, createGroupMutation };
};
