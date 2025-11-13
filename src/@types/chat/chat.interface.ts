export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ChatParticipant {
  id: string;
  user: User;
  isAdmin: boolean;
  joinedAt: string;
}

export interface ChatRoom {
  id: string;
  isGroup: boolean;
  name: string;
  lastMessage?: string | { content: string };
  groupName?: string;
  unread: number;
  participants?: ChatParticipant[];
}

export interface CreateGroupResponse {
  status_code: number;
  data: ChatRoom;
  time_stamp: string;
}

export interface ChatListResponse {
  status_code: number;
  data: ChatRoom[];
  time_stamp: string;
}

export interface UserListResponse {
  status_code: number;
  data: User[];
  time_stamp: string;
}

export type MessageResponse = {
  id: string;
  content: string;
  senderId: string;
  sender: { first_name: string; last_name: string };
  createdAt: string;
  image?: string;
  chatId: string;
};

export type SendMessageRequest = {
  chatId: string;
  content: string;
  image?: string;
};

export interface MessageListResponse {
  status_code: number;
  data: MessageResponse[];
  time_stamp: string;
}

export interface MessageList {
  pages: {
    currentPage: number;
    lastPage: boolean;
    totalPages: number;
    messages: MessageResponse[];
  }[];
  pageParams: number[];
}

