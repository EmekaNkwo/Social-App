import { useSocket } from "@/contexts/SocketContext";
import { Paperclip, Send } from "lucide-react";
import React, { useEffect, useState } from "react";

interface MessageInputProps {
  chatId: string;
  recipientId: string;
  currentUser: {
    id: string;
    username: string;
  };
  onSendMessage: (content: string) => Promise<void>;
  isDisabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  recipientId,
  currentUser,
  onSendMessage,
  isDisabled = false,
}) => {
  const [message, setMessage] = useState("");
  const { socket } = useSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isDisabled) return;

    try {
      // First save the message to the database
      await onSendMessage(message);

      // Then emit the socket event for real-time
      if (socket) {
        socket.emit("private-message", {
          to: recipientId,
          from: currentUser.id,
          message: message,
          chatId: chatId,
        });
      }

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("private-message", (data) => {
        // Handle incoming message
        console.log("New message:", data);
      });
    }

    return () => {
      if (socket) {
        socket.off("private-message");
      }
    };
  }, [socket]);

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-12 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isDisabled}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <button
              type="submit"
              className="text-gray-400 hover:text-blue-500"
              disabled={isDisabled || !message.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          disabled={isDisabled}
        >
          <Paperclip className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
