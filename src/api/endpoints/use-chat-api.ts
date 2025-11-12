
import type { ChatRoom } from '@/@types/chat/chat.interface';
import { useApi } from '@/hooks/use-api';

export const useChatApi = () => {
    const { fetchData } = useApi();
    const BASE_URL = import.meta.env.VITE_CHAT_API_URL;

    return {
        listRooms: async (): Promise<ChatRoom[] | null> => {
            return fetchData<ChatRoom[]>(`${BASE_URL}/rooms`, 'GET');
        },

        createRoom: async (data: {
            isGroup: boolean;
            groupName?: string;
            participants?: string[];
            participantId?: string;
        }) => {
            return fetchData(`${BASE_URL}/rooms`, 'POST', '', data);
        }
    };
};
