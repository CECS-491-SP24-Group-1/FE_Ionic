// src/pages/ChatsPage.tsx

import React, { useEffect, useState } from "react";
import {
	IonContent,
	IonPage,
	IonFooter,
	IonInput,
	IonButton,
	IonIcon,
	IonModal,
	IonToolbar
} from "@ionic/react";
import { send, attach, mic, camera } from "ionicons/icons";
import logo from "@assets/images/glock_primary.svg";
import ChatList from "../components/Chats/ChatList/ChatList";
import ChatMessages from "../components/Chats/ChatMessages";
import ChatHeader from "../components/Chats/ChatHeader";
import ChatMenu from "../components/Chats/Menu/ChatMenu";
import Camera from "@/pages/Camera";
import useVaultStore from "@/stores/vault_store";
import { useRoomStore } from "@/stores/room_store";
import { LastMessage } from "../../types/chat";
import { newChat } from "@/util/chat";
import { useRoomList } from "@/hooks/useRoomList"; // Import the custom hook
import "./Chats.scss";

const ChatsPage: React.FC = () => {
	const { myID, vault, evault } = useVaultStore((state) => ({
		myID: state.myID,
		vault: state.vault as Exclude<typeof state.vault, null | undefined>, // Type is not null
		evault: state.evault as Exclude<typeof state.evault, null | undefined> // Type is not null
	}));

	const { clearRoomMessages, rooms } = useRoomStore((state) => ({
		clearRoomMessages: state.clearRoomMessages,
		rooms: state.rooms
	}));

	const { isLoading, error } = useRoomList(); // Use the custom hook

	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [inputMessage, setInputMessage] = useState<string>("");
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [showCamera, setShowCamera] = useState(false);
	const api = import.meta.env.VITE_API_URL;

	// WebSocket setup
	useEffect(() => {
		if (!selectedChatId) return;

		const socket = new WebSocket(`${api}/chat/room/${selectedChatId}`);

		socket.onopen = () => {
			console.log("WebSocket connection established");
		};

		socket.onmessage = (event) => {
			console.log("Message from server:", event.data);
			const data = JSON.parse(event.data);

			// Add the incoming message to the Zustand store
			useRoomStore.getState().addMessageToRoom(selectedChatId, data.id, data);
		};

		socket.onclose = () => {
			console.log("WebSocket connection closed");
		};

		socket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		setWs(socket);

		// Clean up the WebSocket when the component unmounts or selectedChatId changes
		return () => {
			socket.close();
		};
	}, [selectedChatId, api]);

	// Function to handle chat selection
	const handleChatSelect = (chatId: string) => {
		// If there's a currently selected chat, clear its messages
		if (selectedChatId) {
			clearRoomMessages(selectedChatId); // Clear the previous chat's messages when switching
		}

		// Switch to the new chat room
		setSelectedChatId(chatId);
	};

	const handleSendMessage = (message: string) => {
		if (!message.trim() || !selectedChatId) return; // Check for empty message and selected chat

		const chat = newChat(message, myID, selectedChatId); // Create a chat message
		ws?.send(JSON.stringify(chat)); // Send the message over WebSocket

		// Add the message to the Zustand store using the correct Message interface
		useRoomStore.getState().addMessageToRoom(selectedChatId, chat.id, {
			id: chat.id, // Unique message ID
			type: "U_MSG", // Specify the message type, e.g., user message
			sender_id: myID, // Sender's ID (the current user)
			recipient_id: selectedChatId, // Chat room ID or recipient ID
			content: message // The actual text message
		});

		setInputMessage(""); // Clear the input field after sending the message
	};

	const handleSendImage = (imageData: string) => {
		if (selectedChatId) {
			const chat = newChat(imageData, myID, selectedChatId); // Create a chat message for the image
			ws?.send(JSON.stringify(chat)); // Send the image message over WebSocket

			// Add the image message to the Zustand store using the correct Message interface
			useRoomStore.getState().addMessageToRoom(selectedChatId, chat.id, {
				id: chat.id, // Unique message ID
				type: "U_MSG", // Specify the message type (you could use a specific type for images)
				sender_id: myID, // Sender's ID (the current user)
				recipient_id: selectedChatId, // Chat room ID or recipient ID
				content: "[Image]" // Placeholder content for the image (you can use imageData here if needed)
			});
		}
	};

	// Function to handle key down for the input
	const handleKeyDown = (event: React.KeyboardEvent) => {
		const inputElement = event.target as HTMLIonInputElement;
		const message = inputElement.value?.toString().trim();

		if (event.key === "Enter" && message) {
			event.preventDefault();
			handleSendMessage(message);
			setInputMessage("");
		}
	};

	return (
		<IonPage>
			{isLoading ? (
				<div>Loading chats...</div>
			) : error ? (
				<div>Error loading chats.</div>
			) : (
				<IonContent id="main-content">
					<div className="chat-container">
						<div className="chat-list">
							<ChatList
								rooms={rooms}
								selectedChatId={selectedChatId} // Pass selectedChatId to ChatList
								onChatSelect={handleChatSelect}
							/>{" "}
						</div>

						<div className="chat-view">
							{selectedChatId !== null ? (
								<>
									<div className="chat-header">
										<ChatHeader selectedChatId={selectedChatId} />
									</div>

									<div className="chat-messages">
										<ChatMessages
											messages={Object.values(rooms[selectedChatId]?.messages || {})}
										/>
									</div>

									<div className="chat-input">
										<IonFooter className="chat-input">
											<IonToolbar>
												<IonInput
													value={inputMessage}
													placeholder="Write a message..."
													onIonChange={(e: CustomEvent) =>
														setInputMessage(e.detail.value!)
													}
													onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent)}
												/>
												<IonButton
													onClick={() => handleSendMessage(inputMessage)}
													slot="end"
													fill="clear">
													<IonIcon icon={send} />
												</IonButton>
												<IonButton slot="end" fill="clear">
													<IonIcon icon={mic} />
												</IonButton>
												<IonButton
													slot="end"
													fill="clear"
													onClick={() => setShowCamera(true)}>
													<IonIcon icon={camera} />
												</IonButton>
												<IonButton slot="end" fill="clear">
													<IonIcon icon={attach} />
												</IonButton>
											</IonToolbar>
										</IonFooter>
									</div>
								</>
							) : (
								<div className="no-chat-selected">
									<div className="empty-chat-container">
										<img src={logo} className="empty-chat-image" />
										<h2>Wraith Web</h2>
										<p>Please select a chat or create a new one to start messaging.</p>
										<p>
											You can create and organize your conversations here. Stay connected!
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<ChatMenu selectedChatId={selectedChatId} />

					{/* Camera Modal */}
					<IonModal isOpen={showCamera} onDidDismiss={() => setShowCamera(false)}>
						<Camera
							onCapture={(imageData: string) => {
								handleSendImage(imageData);
								setShowCamera(false);
							}}
						/>
					</IonModal>
				</IonContent>
			)}
		</IonPage>
	);
};

export default ChatsPage;
