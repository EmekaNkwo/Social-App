import { useCallback, useEffect, useState } from "react";
import { useCreateChatClient } from "stream-chat-react";
import kyInstance from "@/lib/ky";
import { useSession } from "../SessionProvider";

interface UseChatClientReturn {
  chatClient: ReturnType<typeof useCreateChatClient>;
  isLoading: boolean;
  error: Error | null;
}

export default function useInitializeChatClient(): UseChatClientReturn {
  const { user } = useSession();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = useCallback(async (): Promise<string> => {
    try {
      const response = await kyInstance.get("/api/get-token");
      const data = await response.json<{ token: string }>();
      return data.token;
    } catch (error) {
      console.error("Failed to get auth token:", error);
      throw new Error("Failed to authenticate with chat service");
    }
  }, []);

  const tokenProvider = useCallback(async () => {
    try {
      console.log("Fetching new token...");
      const token = await getToken();

      if (!token) {
        console.error("Received empty token");
        throw new Error("Authentication failed: Empty token received");
      }

      console.log("Token fetched successfully");
      return token;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error in tokenProvider:", {
        message: errorMessage,
        error: error,
      });

      setError(new Error(`Failed to get token: ${errorMessage}`));
      throw error; // Re-throw to let Stream Chat handle retry logic
    }
  }, [getToken]);

  const chatClient = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_KEY!,
    options: { timeout: 10000 },
    tokenOrProvider: tokenProvider,
    userData: {
      id: user.id,
      username: user.username,
      name: user.displayName,
      image: user.avatarUrl,
    },
  });

  console.log(chatClient);

  useEffect(() => {
    console.log("useEffect triggered", { user, chatClient: !!chatClient });

    if (!user) {
      console.log("No user, setting error");
      setError(new Error("User not authenticated"));
      setIsLoading(false);
      return;
    }

    if (!chatClient) {
      console.log("No chatClient instance yet");
      return;
    }

    console.log("Setting up chat client listeners...");

    const handleConnectionChange = (event: any) => {
      console.log("Connection changed:", event);
      const isOnline = event?.online ?? false;
      console.log(`Connection state: ${isOnline ? "Online" : "Offline"}`);

      if (isOnline) {
        console.log("Successfully connected to Stream Chat");
        setIsLoading(false);
        setError(null);
      } else {
        console.log("Disconnected from Stream Chat");
        setIsLoading(true);
      }
    };

    const handleError = (error: any) => {
      console.error("Stream Chat error:", error);
      setError(new Error("Connection to chat failed. Please try again."));
      setIsLoading(false);
    };

    // Add event listeners
    chatClient.on("connection.changed", handleConnectionChange);
    chatClient.on("error", handleError);

    // Initial connection check
    if (chatClient.user) {
      setIsLoading(false);
    } else {
      console.log("Waiting for connection...");
    }

    // Cleanup function
    return () => {
      if (chatClient) {
        chatClient.off("connection.changed", handleConnectionChange);
        chatClient.off("error", handleError);
      }
    };
  }, [chatClient, user]);

  return { chatClient, isLoading, error };
}
