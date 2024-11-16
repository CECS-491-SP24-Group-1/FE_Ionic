import React, { useState } from "react";
import { IconButton, TextField, Toolbar } from "@mui/material";
import {
	Send as SendIcon,
	AttachFile as AttachIcon,
	Mic as MicIcon
} from "@mui/icons-material";

interface ChatInputProps {
	onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
	const [message, setMessage] = useState("");

	const handleSendMessage = () => {
		if (message.trim()) {
			onSendMessage(message);
			setMessage(""); // Clear the input field after sending
		}
	};

	return (
		<div className="fixed bottom-0 w-full bg-primary dark:bg-primary-light">
			<Toolbar className="flex items-center px-4 py-2">
				<TextField
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Write a message..."
					variant="outlined"
					fullWidth
					className="mr-4"
					InputProps={{
						className:
							"text-textPrimary dark:text-textPrimary-light placeholder-textSecondary dark:placeholder-textSecondary-light",
						classes: {
							root: "bg-backgroundHighlight dark:bg-backgroundHighlight-light"
						}
					}}
				/>
				<IconButton
					onClick={handleSendMessage}
					className="text-accent dark:text-accent-light">
					<SendIcon />
				</IconButton>
				<IconButton className="text-muted dark:text-muted-light">
					<MicIcon />
				</IconButton>
				<IconButton className="text-muted dark:text-muted-light">
					<AttachIcon />
				</IconButton>
			</Toolbar>
		</div>
	);
};

export default ChatInput;
