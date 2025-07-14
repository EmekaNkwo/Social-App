import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ArrowLeft, Menu } from "lucide-react";

interface Participant {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
}

interface ConversationHeaderProps {
  participants: Participant[];
  currentUserId: string;
  onBackClick: () => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  participants,
  currentUserId,
  onBackClick,
}) => {
  const otherParticipants = participants.filter((p) => p.id !== currentUserId);
  const isGroupChat = otherParticipants.length > 1;

  return (
    <div className="flex items-center gap-4 border-b p-4">
      <button
        onClick={onBackClick}
        className="rounded-full p-2 hover:bg-gray-100"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={otherParticipants[0]?.avatarUrl}
            alt={otherParticipants[0]?.displayName}
          />
          <AvatarFallback>
            {otherParticipants[0]?.displayName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">
            {isGroupChat ? "Group Chat" : otherParticipants[0]?.displayName}
          </h2>
          <p className="text-sm text-gray-500">
            {isGroupChat
              ? `${otherParticipants?.length} participants`
              : "Active now"}
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* <button className="rounded-full p-2 hover:bg-gray-100">
          <Video className="h-6 w-6" />
        </button> */}
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ConversationHeader;
