import React, { useRef, useEffect, useState, useCallback } from "react";
import MessageItem from "./MessageItem";
import ChatList from "./ChatList";
import ConversationHeader from "./ConversationHeader";
import MessageInput from "./MessageInput";
import { UserData } from "@/lib/types";
import { useSocket } from "@/contexts/SocketContext";
import { Message } from "@/models";
import { generateId } from "@/lib/utils";
import { useChats } from "@/hooks/useChats";
import { useInView } from "react-intersection-observer";

interface MessageContainerProps {
  currentUserId: string;
  selectedChatId: string;
  onChatSelect: (chatId: string) => void;
  user: UserData;
}

const MessageContainer: React.FC<MessageContainerProps> = ({
  currentUserId,
  selectedChatId,
  onChatSelect,
  user,
}) => {
  const { socket } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
  });
  const { sendMessage, chats, messages: chatMessages, markAsRead } = useChats();

  const {
    data: messages,
    isLoading: isLoadingMessages,
    error: messagesError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = chatMessages(selectedChatId);

  const handleMarkAsRead = useCallback(
    async (messageId: string) => {
      try {
        await markAsRead({ chatId: selectedChatId, messageId });
      } catch (error) {
        console.error("Failed to mark message as read:", error);
      }
    },
    [markAsRead],
  );
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (data: {
        id: string;
        content: string;
        sender: { id: string; name: string; avatar: string };
        chatId: string;
        createdAt: string;
      }) => {
        if (data.chatId === selectedChatId) {
          return {
            id: generateId("msg"),
            content: data.content,
            sender: data.sender,
            createdAt: new Date().toISOString(),
            read: false,
          };
        }
      };
      socket.on("private-message", (data) => {
        handleNewMessage(data);
      });
    }

    return () => {
      if (socket) {
        socket.off("private-message");
      }
    };
  }, [socket, selectedChatId]);

  console.log(messages);

  useEffect(() => {
    const unreadMessages = messages?.pages
      ?.flatMap((page) => page.data)
      .filter((msg) => !msg?.read && msg?.sender?.id !== user?.id);

    unreadMessages?.forEach((msg) => {
      handleMarkAsRead(msg?.id);
    });
  }, [messages, user?.id, handleMarkAsRead]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoadingMessages) {
    return <div>Loading messages...</div>;
  }

  // Add error state if needed
  if (messagesError) {
    return <div>Error loading messages</div>;
  }

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  const otherParticipants =
    selectedChat?.participants.filter((p) => p.id !== currentUserId) || [];
  const isChatEmpty = chats?.length === 0;
  return (
    <div className="grid h-full grid-cols-6">
      {/* Chat List Sidebar */}
      <div className={isChatEmpty ? "col-span-6" : "col-span-2"}>
        <ChatList onSelectChat={onChatSelect} currentChatId={selectedChatId} />
      </div>

      {/* Message Container */}
      <div
        className={isChatEmpty ? "hidden" : "col-span-4 flex flex-1 flex-col"}
      >
        <ConversationHeader
          participants={otherParticipants}
          currentUserId={currentUserId}
          onBackClick={() => console.log("Back clicked")}
        />
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages?.pages?.map((page) =>
            page?.data?.map((message: Message) => (
              <MessageItem
                key={message.id}
                message={message}
                isOwnMessage={message.sender.id === currentUserId}
              />
            )),
          )}
          <div ref={messagesEndRef} />
          {isLoadingMessages && hasNextPage && (
            <div ref={loadMoreRef}>Loading more messages...</div>
          )}
        </div>
        <MessageInput
          chatId={selectedChatId}
          recipientId={selectedChat?.participants[0].id || ""}
          currentUser={user}
          onSendMessage={async (content) => {
            if (!selectedChatId) return;
            await sendMessage({ chatId: selectedChatId, content });
          }}
          isDisabled={!selectedChatId}
        />
      </div>
    </div>
  );
};

export default MessageContainer;
