"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Chat as StreamChat } from "stream-chat-react";
import ChatChannel from "./ChatChannel";
import ChatSidebar from "./ChatSidebar";
import useInitializeChatClient from "./useInitializeChatClient";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const { chatClient, isLoading, error } = useInitializeChatClient();
  const { resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Handle retry logic
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  // Reset retry count when chatClient becomes available
  useEffect(() => {
    if (chatClient) {
      setRetryCount(0);
    }
  }, [chatClient]);

  // Full page loading state
  if (isLoading && !chatClient) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-lg">Initializing chat...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
        <MessageSquare className="h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-semibold">Chat Unavailable</h2>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <Button onClick={handleRetry} className="mt-6" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Try Again
        </Button>
      </div>
    );
  }

  // Chat client not available
  if (!chatClient) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Chat Not Available</h2>
        <p className="mt-2 text-muted-foreground">
          Unable to initialize chat client. Please try again later.
        </p>
        <Button onClick={handleRetry} className="mt-6" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Retry
        </Button>
      </div>
    );
  }

  return (
    <main className="relative h-[calc(100vh-4rem)] w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="flex h-full w-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
          key={`chat-${retryCount}`} // Force re-render on retry
        >
          <ChatSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannel
            open={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
}
