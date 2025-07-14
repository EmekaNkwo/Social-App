export interface Chat {
  id: string;
  name: string;
  isGroup?: boolean;
  participants: Array<{
    id: string;
    displayName: string;
    username: string;
    avatarUrl: string;
  }>;
  lastMessage: {
    content: string;
    timestamp: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    displayName: string;
    username: string;
    avatarUrl: string;
  };
  createdAt: string;
  read: boolean;
}
