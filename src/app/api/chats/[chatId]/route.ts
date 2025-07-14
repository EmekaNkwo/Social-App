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

    const chat = await prisma.chat.findUnique({
      where: { id: params.chatId },
      include: {
        participants: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!chat) {
      return new NextResponse("Chat not found", { status: 404 });
    }

    const isParticipant = chat.participants.some(
      (p) => p.username === user.username,
    );

    if (!isParticipant) {
      return new NextResponse("Not a participant in this chat", {
        status: 403,
      });
    }

    return NextResponse.json({
      id: chat.id,
      participants: chat.participants.map((p) => ({
        id: p.id,
        displayName: p.displayName || "Unknown User",
        username: p.username,
        avatarUrl: p.avatarUrl || "/default-avatar.png",
      })),
      updatedAt: chat.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
