import React from "react";
import { Avatar, Button, IconButton } from "@mui/material";
import { Call, Videocam, Info } from "@mui/icons-material";
import { useRoomStore } from "@/stores/room_store";

interface ChatHeaderProps {
	selectedChatId: string;
	membersOnline: number;
	onExitChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	selectedChatId,
	membersOnline,
	onExitChat
}) => {
	// Retrieve the selected chat from Zustand
	const selectedChat = useRoomStore((state) => state.rooms[selectedChatId]);

	// Ensure the selected chat exists
	if (!selectedChat) {
		return null;
	}

	return (
		<div className="flex items-center justify-between bg-primary dark:bg-primary-light p-4 shadow-md">
			{/* Avatar */}
			<Avatar
				src={`https://i.pravatar.cc/300?u=${selectedChatId}`} // Temporary use id for avatar
				alt={`Avatar for chat ${selectedChatId}`}
				className="mr-4"
			/>

			{/* Chat Info */}
			<div className="flex flex-col text-textPrimary dark:text-textPrimary-light">
				<h2 className="text-lg font-semibold">{selectedChatId}</h2>{" "}
				{/* Display selectedChatId as title */}
				<p className="text-sm text-textSecondary dark:text-textSecondary-light">
					Current members online: <strong>{membersOnline}</strong>
				</p>
			</div>

			{/* Action Buttons */}
			<div className="flex items-center space-x-2">
				<Button
					onClick={onExitChat}
					className="text-accent dark:text-accent-light hover:underline">
					Exit Room
				</Button>
				<IconButton className="text-textPrimary dark:text-textPrimary-light">
					<Call fontSize="medium" />
				</IconButton>
				<IconButton className="text-textPrimary dark:text-textPrimary-light">
					<Videocam fontSize="medium" />
				</IconButton>
				<IconButton
					onClick={() => console.log("Menu toggle")}
					className="text-textPrimary dark:text-textPrimary-light">
					<Info fontSize="medium" />
				</IconButton>
			</div>
		</div>
	);
};

export default ChatHeader;
