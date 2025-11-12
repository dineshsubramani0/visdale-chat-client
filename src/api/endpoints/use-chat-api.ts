import type { ChatListResponse, CreateGroupResponse, UserListResponse } from '@/@types/chat/chat.interface';
import { useApi } from '@/hooks/use-api';

export const useChatApi = () => {
  const { fetchData } = useApi();
  const BASE_URL = import.meta.env.VITE_CHAT_API_URL;

  return {
    /** Get all rooms */
    listRooms: async (): Promise<ChatListResponse | null> => {
      return fetchData<ChatListResponse>(`${BASE_URL}/rooms`, 'GET');
    },

    /** Create new chat/group room */
    createRoom: async (data: {
      isGroup: boolean;
      groupName?: string;
      participants?: string[];
      participantId?: string;
    }) => {
      return fetchData(`${BASE_URL}/rooms`, 'POST', '', data);
    },

    /** Get single chat room details */
    getRoom: async (roomId: string): Promise<CreateGroupResponse | null> => {
      return fetchData<CreateGroupResponse>(`${BASE_URL}/rooms/${roomId}`, 'GET');
    },

    listUser: async (): Promise<UserListResponse| null> => {
      return fetchData<UserListResponse>(
        `${BASE_URL}/rooms/user/list`,
        'GET',
        ''
      );
    },
  };
};
