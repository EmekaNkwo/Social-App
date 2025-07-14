// src/app/api/chats/[chatId]/messages/route.ts
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const cursor = searchParams.get("cursor");

    const messages = await prisma.message.findMany({
      where: {
        chatId: params.chatId,
        chat: {
          participants: {
            some: {
              username: user.username,
            },
          },
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit + 1, // Take one extra to know if there are more
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasMore = messages.length > limit;
    const result = messages.slice(0, limit);

    return NextResponse.json({
      messages: result.reverse(), // Return in chronological order
      nextCursor: hasMore ? result[result.length - 1].id : null,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content } = await req.json();

    if (!content || typeof content !== "string") {
      return new NextResponse("Message content is required", { status: 400 });
    }

    // Verify user is a participant in the chat
    const chat = await prisma.chat.findUnique({
      where: { id: params.chatId },
      include: {
        participants: {
          where: { username: user.username },
          select: { id: true },
        },
      },
    });

    if (!chat) {
      return new NextResponse("Chat not found", { status: 404 });
    }

    if (chat.participants.length === 0) {
      return new NextResponse("Not a participant in this chat", {
        status: 403,
      });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        chat: { connect: { id: params.chatId } },
        sender: { connect: { username: user.username } },
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update chat's updatedAt
    await prisma.chat.update({
      where: { id: params.chatId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
