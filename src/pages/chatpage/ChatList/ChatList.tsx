import React, { useState } from "react";
import {
	IonList,
	IonItem,
	IonAvatar,
	IonLabel,
	IonBadge,
	IonButton,
	IonIcon,
	IonPopover
} from "@ionic/react";
import { ellipsisHorizontal } from "ionicons/icons";
import ChatsHeader from "./ChatsHeader";
import emptyFolderImage from "@assets/images/empty_folder.svg";
import { RoomCS } from "@ptypes/roomcs";

interface ChatListProps {
	onChatSelect: (chatId: string) => void;
	selectedChatId: string | null;
	rooms: Record<string, RoomCS>;
	onLeaveRoom: (chatId: string) => void; // Add a new prop for handling leave room action
}

const ChatList: React.FC<ChatListProps> = ({
	onChatSelect,
	selectedChatId,
	rooms,
	onLeaveRoom
}) => {
	const [searchQuery, setSearchQuery] = useState(""); // State for search query
	const [popoverState, setPopoverState] = useState<{
		open: boolean;
		event: Event | undefined;
		chatId: string | null;
	}>({
		open: false,
		event: undefined,
		chatId: null
	});

	// Filter rooms based on search query
	const filteredRooms = Object.values(rooms).filter((room) =>
		room.id.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const isEmpty = filteredRooms.length === 0;

	return (
		<>
			{/* Pass search handler to ChatsHeader */}
			<ChatsHeader onSearch={(query) => setSearchQuery(query)} />

			<IonList className={`chat-list ${isEmpty ? "empty" : ""}`}>
				{isEmpty ? (
					<div className="empty-container">
						<div className="empty-chat-message">
							<h2>No chats found</h2>
						</div>
						<img src={emptyFolderImage} className="empty-image" alt="Empty folder" />
					</div>
				) : (
					filteredRooms.map((room) => (
						<IonItem
							button
							key={room.id}
							onClick={() => {
								if (room.id !== selectedChatId) {
									onChatSelect(room.id);
								}
							}}
							className={`chat-list-item ${room.id === selectedChatId ? "selected" : ""}`}>
							<IonAvatar slot="start" className="chat-list-avatar">
								<img
									src={`https://i.pravatar.cc/300?u=${room.id}`}
									alt={`Chat room ${room.id}`}
								/>
							</IonAvatar>
							<IonLabel className="chat-list-label">
								<h2 className="chat-list-name">Room {room.id}</h2>
								<p className="chat-list-message">
									{room.last_message?.content || "No messages yet"}
								</p>
							</IonLabel>
							<IonBadge color="success" slot="end" className="chat-list-badge">
								{room.last_message?.timestamp
									? new Date(room.last_message.timestamp).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										})
									: "N/A"}
							</IonBadge>
							<IonButton
								fill="clear"
								slot="end"
								onClick={(e) =>
									setPopoverState({ open: true, event: e.nativeEvent, chatId: room.id })
								}>
								<IonIcon icon={ellipsisHorizontal} />
							</IonButton>
						</IonItem>
					))
				)}
			</IonList>

			<IonPopover
				isOpen={popoverState.open}
				event={popoverState.event}
				onDidDismiss={() =>
					setPopoverState({ open: false, event: undefined, chatId: null })
				}>
				<IonItem
					button
					onClick={() => {
						if (popoverState.chatId) {
							onLeaveRoom(popoverState.chatId);
						}
						setPopoverState({ open: false, event: undefined, chatId: null });
					}}>
					Leave Room
				</IonItem>
			</IonPopover>
		</>
	);
};

export default ChatList;
