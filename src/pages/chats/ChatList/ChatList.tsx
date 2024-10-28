import React, { useState } from "react";
import { IonList, IonItem, IonAvatar, IonLabel, IonBadge } from "@ionic/react";
import ChatsHeader from "./ChatsHeader";
import emptyFolderImage from "@assets/images/empty_folder.svg";
import { RoomCS } from "@ptypes/roomcs";

interface ChatListProps {
	onChatSelect: (chatId: string) => void;
	selectedChatId: string | null; // Added to know which chat is currently selected
	rooms: Record<string, RoomCS>; // Pass the fetched rooms as a prop
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect, selectedChatId, rooms }) => {
	const [searchQuery, setSearchQuery] = useState(""); // State to store the search query

	// Filter rooms based on search query
	const filteredRooms = Object.values(rooms).filter(
		(room) => room.id.toLowerCase().includes(searchQuery.toLowerCase()) // Adjust this to filter based on room name or other properties if necessary
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
								// Prevent clicking on the already selected chat
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
						</IonItem>
					))
				)}
			</IonList>
		</>
	);
};

export default ChatList;
