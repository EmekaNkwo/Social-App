import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { Chat } from "@/models";
import { generateId } from "@/lib/utils";

// Update the formatChatResponse function to handle the Prisma response type
const formatChatResponse = (
  chat: {
    name: string;
    isGroup: boolean;
    participants: Array<{
      id: string;
      displayName: string | null;
      username: string;
      avatarUrl: string | null;
    }>;
    messages: Array<{
      id: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
    _count?: {
      messages: number;
    };
    updatedAt: Date;
  },
  currentUserId: string,
): Chat => {
  const otherParticipants = chat.participants.filter(
    (p) => p.id !== currentUserId,
  );

  const chatName =
    !chat.isGroup && otherParticipants[0]
      ? otherParticipants[0].displayName || otherParticipants[0].username
      : chat.name;

  return {
    id: generateId("chat"),
    name: chatName,
    isGroup: chat.isGroup,
    participants: otherParticipants.map((p) => ({
      id: p.id,
      displayName: p.displayName || p.username,
      username: p.username,
      avatarUrl: p.avatarUrl || "/default-avatar.png",
    })),
    lastMessage: chat.messages[0]
      ? {
          content: chat.messages[0].content,
          timestamp: chat.messages[0].createdAt.toISOString(),
        }
      : null,
    unreadCount: chat._count?.messages || 0,
    updatedAt: chat.updatedAt.toISOString(),
  };
};

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const followers = await prisma.follow.findMany({
      where: { followingId: user.id },
      select: { followerId: true },
    });
    const followerIds = followers.map((f) => f.followerId);

    // Then get chats only with those users
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: { id: user.id },
        },
      },
      select: {
        id: true,
        name: true,
        isGroup: true,
        participants: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                read: false,
                NOT: { senderId: user.id },
              },
            },
          },
        },
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const formattedChats = chats.map((chat) =>
      formatChatResponse(
        {
          ...chat,
          name: chat.name || "",
        },
        user.id,
      ),
    );

    // Format the response
    const existingChatParticipantIds = new Set(
      formattedChats.flatMap((chat) => chat.participants.map((p) => p.id)),
    );

    const followersWithoutChat = await prisma.user.findMany({
      where: {
        id: { in: followerIds },
        NOT: { id: { in: [...existingChatParticipantIds, user.id] } },
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        avatarUrl: true,
      },
    });

    // Create placeholder chats for followers without existing chats
    const followerChats = followersWithoutChat.map((follower) => ({
      id: `follower-${follower.id}`, // Temporary ID
      isGroup: false,
      name: follower.displayName || follower.username,
      participants: [follower],
      avatar: follower.avatarUrl || "/default-avatar.png",
      _count: { messages: 0 },
      lastMessage: null,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
      isNew: true, // Flag to indicate this is a new chat
    }));

    return NextResponse.json([...formattedChats, ...followerChats]);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { participantIds, isGroup, name } = await req.json();

    // For single chats
    if (!isGroup) {
      if (!participantIds || participantIds.length !== 1) {
        return new NextResponse(
          "Single chat requires exactly one participant",
          {
            status: 400,
          },
        );
      }

      const participantId = participantIds[0];

      // Check if the participant is following the current user
      const isFollower = await prisma.follow.findFirst({
        where: {
          followerId: participantId,
          followingId: user.id,
        },
      });

      if (!isFollower) {
        return new NextResponse("You can only chat with users who follow you", {
          status: 403,
        });
      }

      // Check if chat already exists
      const existingChat = await prisma.chat.findFirst({
        where: {
          participants: {
            every: {
              id: { in: [user.id, participantId] },
            },
          },
        },
        include: { participants: true, messages: true },
      });

      if (existingChat) {
        return NextResponse.json(
          formatChatResponse(
            {
              ...existingChat,
              name: existingChat.name || "",
              messages: existingChat.messages,
            },
            user.id,
          ),
        );
      }

      // Create new 1:1 chat
      const newChat = await prisma.chat.create({
        data: {
          participants: {
            connect: [{ id: user.id }, { id: participantId }],
          },
        },
        include: {
          participants: {
            select: {
              id: true,
              displayName: true,
              username: true,
              avatarUrl: true,
            },
          },
          messages: { take: 0 }, // No messages yet
        },
      });

      return NextResponse.json(
        formatChatResponse(
          {
            ...newChat,
            name: newChat.name || "",
          },
          user.id,
        ),
      );
    }

    // For group chats
    if (participantIds.length < 2) {
      return new NextResponse("Group chat requires at least 2 participants", {
        status: 400,
      });
    }

    if (!name) {
      return new NextResponse("Group name is required", { status: 400 });
    }

    const newGroupChat = await prisma.chat.create({
      data: {
        isGroup: true,
        name,
        participants: {
          connect: [
            { id: user.id },
            ...participantIds.map((id: string) => ({ id })),
          ],
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
          },
        },
        messages: { take: 0 }, // No messages yet
      },
    });

    return NextResponse.json(
      formatChatResponse(
        {
          ...newGroupChat,
          name: newGroupChat.name || "",
        },
        user.id,
      ),
    );
  } catch (error) {
    console.error("Error creating chat:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
