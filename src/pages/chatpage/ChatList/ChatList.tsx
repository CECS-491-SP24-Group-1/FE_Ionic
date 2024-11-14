import React, { useState } from "react";
import {
	List,
	ListItem,
	ListItemButton,
	ListItemAvatar,
	ListItemText,
	ListItemSecondaryAction,
	Avatar,
	Badge,
	IconButton,
	Popover,
	Typography,
	Button
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import ChatsHeader from "./ChatsHeader";
import emptyFolderImage from "@assets/images/empty_folder.svg";
import { RoomCS } from "@ptypes/roomcs";

interface ChatListProps {
	onChatSelect: (chatId: string) => void;
	selectedChatId: string | null;
	rooms: Record<string, RoomCS>;
	onLeaveRoom: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
	onChatSelect,
	selectedChatId,
	rooms,
	onLeaveRoom
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [popoverChatId, setPopoverChatId] = useState<string | null>(null);

	const handlePopoverOpen = (
		event: React.MouseEvent<HTMLButtonElement>,
		chatId: string
	) => {
		event.stopPropagation(); // Prevents triggering the ListItemButton onClick
		setAnchorEl(event.currentTarget);
		setPopoverChatId(chatId);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
		setPopoverChatId(null);
	};

	const filteredRooms = Object.values(rooms).filter((room) =>
		room.id.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const isEmpty = filteredRooms.length === 0;

	return (
		<>
			{/* Pass search handler to ChatsHeader */}
			<ChatsHeader onSearch={(query) => setSearchQuery(query)} />

			{isEmpty ? (
				<div className="empty-container">
					<div className="empty-chat-message">
						<h2>No chats found</h2>
					</div>
					<img src={emptyFolderImage} className="empty-image" alt="Empty folder" />
				</div>
			) : (
				<List className={`chat-list ${isEmpty ? "empty" : ""}`}>
					{filteredRooms.map((room) => (
						<ListItem
							key={room.id}
							disablePadding
							className={`chat-list-item ${
								room.id === selectedChatId ? "selected" : ""
							}`}>
							<ListItemButton
								selected={room.id === selectedChatId}
								onClick={() => {
									if (room.id !== selectedChatId) {
										onChatSelect(room.id);
									}
								}}>
								<ListItemAvatar>
									<Avatar
										src={`https://i.pravatar.cc/300?u=${room.id}`}
										alt={`Chat room ${room.id}`}
									/>
								</ListItemAvatar>
								<ListItemText
									primary={`Room ${room.id}`}
									secondary={room.last_message?.content || "No messages yet"}
								/>
							</ListItemButton>
							<ListItemSecondaryAction>
								<Typography variant="body2" color="textSecondary">
									{room.last_message?.timestamp
										? new Date(room.last_message.timestamp).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit"
											})
										: "N/A"}
								</Typography>
								<IconButton edge="end" onClick={(e) => handlePopoverOpen(e, room.id)}>
									<MoreVert />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			)}

			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={handlePopoverClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center"
				}}>
				<Button
					onClick={() => {
						if (popoverChatId) {
							onLeaveRoom(popoverChatId);
						}
						handlePopoverClose();
					}}>
					Leave Room
				</Button>
			</Popover>
		</>
	);
};

export default ChatList;
