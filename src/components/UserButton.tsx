"use client";

import { logout } from "@/app/(auth)/actions";
import { useSession } from "@/app/(main)/SessionProvider";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  LogOutIcon,
  Monitor,
  Moon,
  Sun,
  UserIcon,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

interface UserButtonProps {
  className?: string;
}

const THEMES = [
  { id: "system", label: "System default", icon: Monitor },
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
];

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await queryClient.clear();
      await logout();
      router.push("/login");
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }, [queryClient, router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <button
          className={cn(
            "flex-none rounded-full border-2 border-transparent transition-all hover:border-primary/20",
            "focus-visible:ring-2 focus-visible:ring-primary/50",
            className,
          )}
          aria-label="User menu"
        >
          <UserAvatar
            avatarUrl={user.avatarUrl}
            size={40}
            className="ring-2 ring-transparent transition-all group-hover:ring-primary/20"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl p-2 shadow-lg"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex flex-col gap-1 p-3">
          <span className="truncate font-medium">
            {user.displayName || user.username}
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            @{user.username}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1" />

        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem className="group flex cursor-pointer items-center rounded-lg p-2 transition-colors hover:bg-accent">
            <UserIcon className="mr-3 size-4 opacity-70" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/settings">
          <DropdownMenuItem className="group flex cursor-pointer items-center rounded-lg p-2 transition-colors hover:bg-accent">
            <Settings className="mr-3 size-4 opacity-70" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="group flex cursor-pointer items-center rounded-lg p-2 transition-colors hover:bg-accent">
            <Monitor className="mr-3 size-4 opacity-70" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent
              className="rounded-xl p-2 shadow-lg"
              sideOffset={2}
              alignOffset={-5}
            >
              {THEMES.map(({ id, label, icon: Icon }) => (
                <DropdownMenuItem
                  key={id}
                  onClick={() => setTheme(id)}
                  className="group flex cursor-pointer items-center rounded-lg p-2 transition-colors hover:bg-accent"
                >
                  <Icon className="mr-3 size-4 opacity-70" />
                  <span className="flex-1">{label}</span>
                  {theme === id && <Check className="size-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="group flex cursor-pointer items-center rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10 focus:bg-destructive/10"
          aria-label="Log out of your account"
        >
          <LogOutIcon className="mr-3 size-4 opacity-70" />
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
