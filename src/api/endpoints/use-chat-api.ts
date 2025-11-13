import type {
  ChatListResponse,
  CreateGroupResponse,
  UserListResponse,
  MessageListResponse,
  SendMessageRequest,
} from '@/@types/chat/chat.interface';
import { useApi } from '@/hooks/use-api';

export const useChatApi = () => {
  const { fetchData } = useApi();
  const BASE_URL = import.meta.env.VITE_CHAT_API_URL;

  return {
    listRooms: async (): Promise<ChatListResponse | null> => {
      return fetchData<ChatListResponse>(`${BASE_URL}/rooms`, 'GET');
    },

    createRoom: async (data: {
      isGroup: boolean;
      groupName?: string;
      participants?: string[];
      participantId?: string;
    }): Promise<CreateGroupResponse> => {
      const response = await fetchData<CreateGroupResponse>(
        `${BASE_URL}/rooms`,
        'POST',
        '',
        data
      );
      if (!response) throw new Error('Failed to create room');
      return response;
    },

    getRoom: async (roomId: string): Promise<CreateGroupResponse | null> => {
      return fetchData<CreateGroupResponse>(
        `${BASE_URL}/rooms/${roomId}`,
        'GET'
      );
    },

    getMessages: async (
      roomId: string,
      limit?: number,
      offset?: number
    ): Promise<MessageListResponse | null> => {
      let url = `${BASE_URL}/rooms/${roomId}/messages`;
      const params: Record<string, string> = {};
      if (limit !== undefined) params.limit = limit.toString();
      if (offset !== undefined) params.offset = offset.toString();
      const queryString = new URLSearchParams(params).toString();
      if (queryString) url += `?${queryString}`;
      return fetchData<MessageListResponse | null>(url, 'GET');
    },

    sendMessage: async (
      roomId: string,
      data: SendMessageRequest
    ): Promise<MessageListResponse> => {
      const response = await fetchData<MessageListResponse>(
        `${BASE_URL}/rooms/${roomId}/message`,
        'POST',
        '',
        { ...data }
      );
      if (!response) throw new Error('Failed to send message');
      return response;
    },

    listUser: async (): Promise<UserListResponse | null> => {
      return fetchData<UserListResponse>(`${BASE_URL}/rooms/user/list`, 'GET');
    },

    addParticipants: async (
      roomId: string,
      userIds: string[]
    ): Promise<CreateGroupResponse> => {
      const response = await fetchData<CreateGroupResponse>(
        `${BASE_URL}/rooms/${roomId}/add-participants`,
        'POST',
        '',
        { userIds }
      );
      if (!response) throw new Error('Failed to add participants');
      return response;
    },
  };
};
