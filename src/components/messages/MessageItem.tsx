import { Message } from "@/models";
import React from "react";

export interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwnMessage }) => {
  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex ${isOwnMessage ? "flex-row-reverse" : "flex-row"} max-w-[80%] items-start gap-3`}
      >
        {!isOwnMessage && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
            {message.sender.displayName[0]}
          </div>
        )}
        <div
          className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
        >
          <div
            className={`rounded-lg p-3 ${
              isOwnMessage
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-900"
            } max-w-[80%]`}
          >
            <p className="break-words text-sm">{message.content}</p>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {new Date(message.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
