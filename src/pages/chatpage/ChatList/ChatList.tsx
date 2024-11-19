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

			<IonList className={`${isEmpty ? "empty" : ""}`}>
				{isEmpty ? (
					<div className="empty-container text-center p-4">
						<div className="empty-chat-message">
							<h2 className="text-textPrimary dark:text-textPrimary-light text-lg font-semibold">
								No chats found
							</h2>
						</div>
						<img
							src={emptyFolderImage}
							className="empty-image mx-auto mt-4"
							alt="Empty folder"
						/>
					</div>
				) : (
					filteredRooms.map((room) => (
						<IonItem
							button
							key={room.id}
							onClick={() => room.id !== selectedChatId && onChatSelect(room.id)}>
							<div
								className={`w-full ${
									room.id === selectedChatId
										? "bg-secondary dark:bg-secondary-light"
										: "bg-transparent"
								} text-textPrimary dark:text-textPrimary-light rounded-2xl p-3`}>
								<div className="flex items-center justify-between">
									{/* Left Section: Avatar and Text */}
									<div className="flex items-center">
										<IonAvatar
											slot="start"
											className="mr-3 w-12 h-12 flex items-center justify-center">
											<img
												src={`https://i.pravatar.cc/300?u=${room.id}`}
												alt={`Chat room ${room.id}`}
												className="rounded-full"
											/>
										</IonAvatar>
										<IonLabel className="chat-list-label max-w-44 text-sm truncate pr-2">
											<h2 className="chat-list-name font-medium text-textPrimary dark:text-textPrimary-light">
												Room {room.id}
											</h2>
											<p className="chat-list-message text-textSecondary dark:text-textSecondary-light">
												{room.last_message?.content || "No messages yet"}
											</p>
										</IonLabel>
									</div>
									{/* Right Section: Badge and Button */}
									<div className="flex items-center space-x-3">
										<IonBadge
											color="success"
											className="chat-list-badge bg-accent text-white text-sm dark:bg-accent-light">
											{room.last_message?.timestamp
												? new Date(room.last_message.timestamp).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit"
													})
												: "N/A"}
										</IonBadge>
										<IonButton
											fill="clear"
											onClick={(e) =>
												setPopoverState({
													open: true,
													event: e.nativeEvent,
													chatId: room.id
												})
											}
											className="text-textSecondary dark:text-textSecondary-light">
											<IonIcon icon={ellipsisHorizontal} />
										</IonButton>
									</div>
								</div>
							</div>
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
