import React from "react";
import { Avatar, Badge, Typography } from "@mui/material";

interface ChatItemProps {
	avatarUrl: string;
	name: string;
	message: string;
	time: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ avatarUrl, name, message, time }) => {
	return (
		<div className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
			{/* Avatar */}
			<Avatar src={avatarUrl} alt={name} className="mr-4" />

			{/* Chat Information */}
			<div className="flex-grow">
				<Typography
					variant="subtitle1"
					className="font-semibold text-gray-900 dark:text-gray-100">
					{name}
				</Typography>
				<Typography variant="body2" className="text-gray-600 dark:text-gray-400">
					{message}
				</Typography>
			</div>

			{/* Timestamp Badge */}
			<Badge
				color="primary"
				variant="dot"
				anchorOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				className="text-xs font-medium text-gray-500 dark:text-gray-300">
				{time}
			</Badge>
		</div>
	);
};

export default ChatItem;
