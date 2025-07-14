"use client";
import React, { useEffect, useState } from "react";
import MessageContainer from "./MessageContainer";
import { useSocket } from "@/contexts/SocketContext";
import useGetUserData from "@/hooks/useGetUserData";
import { UserData } from "@/lib/types";

const Messenger: React.FC = () => {
  const { socket } = useSocket();
  const { data: user } = useGetUserData();

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  useEffect(() => {
    if (user && socket && !isConnected) {
      socket.connect();
      setIsConnected(true);
    }

    return () => {
      if (socket && isConnected) {
        socket.disconnect();
        setIsConnected(false);
      }
    };
  }, [user, socket, isConnected]);
  return (
    <MessageContainer
      currentUserId={user?.id || ""}
      selectedChatId={selectedChatId || ""}
      onChatSelect={handleChatSelect}
      user={user as UserData}
    />
  );
};

export default Messenger;
