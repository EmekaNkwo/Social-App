import { useChats } from "@/hooks/useChats";
import { MessageCircle } from "lucide-react";
import React from "react";
import { Label } from "../ui/label";
import { formatTimeAgo } from "@/lib/utils";

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  currentChatId: string;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, currentChatId }) => {
  const { chats, isLoading, createOneOnOneChat, isCreatingOneOnOneChat } =
    useChats();

  if (isLoading) {
    return <div>Loading chats...</div>;
  }
  return (
    <div className="h-full border-r border-gray-200 dark:border-gray-800">
      <div className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Chats</h2>

        <div className="space-y-1">
          {chats?.length === 0 ? (
            <div className="flex h-[calc(100vh-18rem)] flex-col items-center justify-center text-center">
              <MessageCircle className="mb-4 h-16 w-16 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-700">
                No conversations yet
              </h3>
              <p className="max-w-xs text-sm text-gray-500">
                Start a conversation with someone who follows you. Your messages
                will appear here.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    // Handler for finding people to follow
                  }}
                  className="block w-full rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Find People to Follow
                </button>
              </div>
            </div>
          ) : (
            chats?.map((chat) => {
              const isUnread = chat.unreadCount > 0;
              const isSelected = chat.id === currentChatId;

              return (
                <button
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat.id);
                    createOneOnOneChat(chat.participants[0].id);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : isUnread
                        ? "bg-blue-50 text-gray-900"
                        : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      {chat.name}
                    </div>
                    <div>
                      <Label className="font-medium">{chat.name}</Label>
                      <Label className="max-w-[150px] truncate text-sm">
                        {chat.lastMessage === null
                          ? null
                          : chat.lastMessage.content}
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {chat.lastMessage === null ? null : (
                      <Label className="text-xs text-gray-500">
                        {formatTimeAgo(chat.lastMessage?.timestamp || "")}
                      </Label>
                    )}
                    {isUnread && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                        <span className="text-xs text-white">
                          {chat.unreadCount}
                        </span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
