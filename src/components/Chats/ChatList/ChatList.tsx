import React from "react";
import { IonList, IonItem, IonAvatar, IonLabel, IonBadge } from "@ionic/react";
import ChatsHeader from "./ChatsHeader"; // Adjust the import to make sure it points to the correct file
import emptyFolderImage from "@assets/images/empty_folder.svg";
import { RoomCS } from "@ptypes/roomcs";

interface ChatListProps {
	onChatSelect: (chatId: string) => void;
	selectedChatId: string | null; // Added to know which chat is currently selected
	rooms: Record<string, RoomCS>; // Pass the fetched rooms as a prop
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect, selectedChatId, rooms }) => {
	const isEmpty = Object.keys(rooms).length === 0;

	return (
		<>
			<ChatsHeader />
			<IonList className={`chat-list ${isEmpty ? "empty" : ""}`}>
				{isEmpty ? (
					<div className="empty-container">
						<div className="empty-chat-message">
							<h2>You got no messages right now</h2>
							<p>Create a new chat to view them!</p>
						</div>
						<img src={emptyFolderImage} className="empty-image" alt="Empty folder" />
					</div>
				) : (
					Object.values(rooms).map((room) => (
						<IonItem
							button
							key={room.id}
							onClick={() => {
								// Prevent clicking on the already selected chat
								if (room.id !== selectedChatId) {
									onChatSelect(room.id);
								}
							}}
							className={`chat-list-item ${room.id === selectedChatId ? "selected" : ""}`}>
							{" "}
							{/* Add 'selected' class */}
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
									? new Date(room.last_message.timestamp).toLocaleTimeString()
									: "N/A"}
							</IonBadge>
						</IonItem>
					))
				)}
			</IonList>
		</>
	);
};

export default ChatList;
