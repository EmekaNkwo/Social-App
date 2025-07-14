import { cache } from "react";
import prisma from "./prisma";
import { getUserDataSelect } from "./types";
import { notFound } from "next/navigation";

export const getUser = cache(
  async (username: string, loggedInUserId: string) => {
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: getUserDataSelect(loggedInUserId),
    });

    if (!user) notFound();

    return user;
  },
);
