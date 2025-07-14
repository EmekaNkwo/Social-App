import { useSession } from "@/app/(main)/SessionProvider";
import { Chat } from "@/models";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

export function useChats() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const fetchChats = async (): Promise<Chat[]> => {
    const response = await fetch("/api/chats");
    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }
    return response.json();
  };

  const createChat = async (participantIds: string[]) => {
    const response = await fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participantIds }),
    });
    if (!response.ok) {
      throw new Error("Failed to create chat");
    }
    return response.json();
  };

  const fetchMessages = async (chatId: string, cursor?: string) => {
    const url = new URL(
      `/api/chats/${chatId}/messages`,
      window.location.origin,
    );
    if (cursor) {
      url.searchParams.append("cursor", cursor);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    return response.json();
  };

  const sendMessage = async ({
    chatId,
    content,
  }: {
    chatId: string;
    content: string;
  }) => {
    const response = await fetch(`/api/chats/${chatId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error("Failed to send message");
    }
    return response.json();
  };

  const createOneOnOneChat = async (participantId: string) => {
    const response = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participantIds: [participantId],
        isGroup: false,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create one-on-one chat");
    }
    return response.json();
  };

  // Create a group chat
  const createGroupChat = async (name: string, participantIds: string[]) => {
    const response = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participantIds,
        isGroup: true,
        name,
      }),
    });
    return response.json();
  };

  const markAsRead = async ({
    chatId,
    messageId,
  }: {
    chatId: string;
    messageId: string;
  }) => {
    const response = await fetch(
      `/api/chats/${chatId}/messages/${messageId}/read`,
      { method: "PATCH" },
    );
    if (!response.ok) {
      throw new Error("Failed to mark message as read");
    }
    return response.json();
  };

  // Queries
  const ChatsQuery = useQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
    enabled: !!user,
  });

  const MessagesQuery = (chatId: string) =>
    useInfiniteQuery({
      queryKey: ["messages", chatId],
      queryFn: ({ pageParam }) => fetchMessages(chatId, pageParam),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      getPreviousPageParam: (firstPage) => firstPage.previousCursor,
      enabled: !!chatId,
    });

  // Mutations
  const createChatMutation = useMutation({
    mutationFn: createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.chatId],
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.chatId],
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const createOneOnOneChatMutation = useMutation({
    mutationFn: createOneOnOneChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  // const createGroupChatMutation = useMutation({
  //   mutationFn: createGroupChat ,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["chats"] });
  //   },
  // });

  return {
    chats: ChatsQuery.data || [],
    isLoading: ChatsQuery.isLoading,
    error: ChatsQuery.error,
    messages: MessagesQuery,
    createChat: createChatMutation.mutateAsync,
    isCreating: createChatMutation.isPending,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    markAsRead: markAsReadMutation.mutateAsync,
    isMarkingAsRead: markAsReadMutation.isPending,
    createOneOnOneChat: createOneOnOneChatMutation.mutateAsync,
    isCreatingOneOnOneChat: createOneOnOneChatMutation.isPending,
  };
}
