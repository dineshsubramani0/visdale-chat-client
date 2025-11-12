export interface ChatRoom {
  id: number;
  name: string;
  lastMessage: string;
  unread: number;
  isGroup?: boolean;
};
