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
import ChatList from "./chats/ChatList/ChatList";
import ChatMessages from "./chats/ChatMessages";
import ChatHeader from "./chats/ChatHeader";
import ChatMenu from "./chats/Menu/ChatMenu";
import Camera from "@/pages/Camera";
import useVaultStore from "@/stores/vault_store";
import { useRoomStore } from "@/stores/room_store";
import { LastMessage } from "../../types/chat";
import { newChat } from "@/util/chat";
import { useRoomList } from "@/hooks/useRoomList";
import "./Chats.scss";

const ChatsPage: React.FC = () => {
	const { myID, vault, evault } = useVaultStore((state) => ({
		myID: state.myID,
		vault: state.vault as Exclude<typeof state.vault, null | undefined>,
		evault: state.evault as Exclude<typeof state.evault, null | undefined>
	}));

	const { clearRoomMessages, rooms, updateTypingStatus } = useRoomStore((state) => ({
		clearRoomMessages: state.clearRoomMessages,
		rooms: state.rooms,
		updateTypingStatus: state.updateTypingStatus // Zustand action to update typing status
	}));

	const { isLoading, error } = useRoomList();

	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [inputMessage, setInputMessage] = useState<string>("");
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [showCamera, setShowCamera] = useState(false);
	const [isTyping, setIsTyping] = useState(false); // Track typing state
	const api = import.meta.env.VITE_API_URL;

	let typingTimeout: ReturnType<typeof setTimeout>;

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

			if (data.type === "typing" && data.chatId === selectedChatId) {
				// Update typing status in Zustand store
				updateTypingStatus(data.userId, data.isTyping);
			} else {
				// Handle regular message data
				useRoomStore.getState().addMessageToRoom(selectedChatId, data.id, data);
			}
		};

		socket.onclose = () => {
			console.log("WebSocket connection closed");
		};

		socket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		setWs(socket);

		return () => {
			socket.close();
		};
	}, [selectedChatId, api, updateTypingStatus]);

	// Function to handle chat selection
	const handleChatSelect = (chatId: string) => {
		if (selectedChatId) {
			clearRoomMessages(selectedChatId);
		}
		setSelectedChatId(chatId);
	};

	const handleSendMessage = (message: string) => {
		if (!message.trim() || !selectedChatId) return;

		const chat = newChat(message, myID, selectedChatId);
		ws?.send(JSON.stringify(chat));

		useRoomStore.getState().addMessageToRoom(selectedChatId, chat.id, {
			id: chat.id,
			type: "U_MSG",
			sender_id: myID,
			recipient_id: selectedChatId,
			content: message
		});

		setInputMessage("");
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

	// Function to send typing status
	const sendTypingStatus = (status: boolean) => {
		if (ws && selectedChatId) {
			ws.send(JSON.stringify({
				type: "typing",
				isTyping: status,
				chatId: selectedChatId,
				userId: myID
			}));
		}
	};

	// Handle typing input
	const handleTyping = () => {
		if (!isTyping) {
			setIsTyping(true);
			sendTypingStatus(true);
		}

		clearTimeout(typingTimeout);

		typingTimeout = setTimeout(() => {
			setIsTyping(false);
			sendTypingStatus(false);
		}, 2000);
	};

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
								selectedChatId={selectedChatId}
								onChatSelect={handleChatSelect}
							/>
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
										{rooms[selectedChatId]?.typingUser && (
											<div className="typing-notification">
												{rooms[selectedChatId].typingUser} is typing...
											</div>
										)}
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
													onIonInput={handleTyping} // Detect typing
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
										<p>Stay connected!</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<ChatMenu selectedChatId={selectedChatId} />

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
