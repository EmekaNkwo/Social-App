"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/app/(main)/SessionProvider";
import { UserData } from "@/lib/types";

const useGetUserData = () => {
  const { user: sessionUser } = useSession();

  return useQuery<UserData, Error>({
    queryKey: ["user", sessionUser?.id],
    queryFn: async () => {
      if (!sessionUser?.id) {
        throw new Error("No user ID found in session");
      }

      const response = await fetch(
        `/api/users/username/${sessionUser.username}`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your profile");
        }
        throw new Error("Failed to fetch user data");
      }

      return response.json();
    },
    enabled: !!sessionUser?.id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default useGetUserData;
