import React, { useCallback, useEffect, useState } from "react";
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
import ChatList from "../components/Chats/ChatList/ChatList";
import ChatMessages from "../components/Chats/ChatMessages";
import ChatHeader from "../components/Chats/ChatHeader";
import ChatMenu from "../components/Chats/Menu/ChatMenu";
import Camera from "@/pages/Camera"; // Import your Camera component
import useVaultStore from "@/stores/vault_store";
import { newChat } from "@/util/chat";
import taxios from "@/util/token_refresh_hook";
import { swallowError } from "@/util/http_util";
import { HttpResponse } from "@ptypes/http_response";
import { Room } from "@ptypes/room";
import "./Chats.scss";

const Chats: React.FC = () => {
	const { myID } = useVaultStore((state) => ({
		myID: state.myID
	}));

	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [inputMessage, setInputMessage] = useState("");
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [messages, setMessages] = useState<{
		[key: string]: { to: string; from: string; text: string; time: string }[];
	}>({});
	const [showCamera, setShowCamera] = useState(false); // State to control the camera modal
	const api = import.meta.env.VITE_API_URL;

	// Function to get room list
	const getRoomList = useCallback(async () => {
		try {
			const response = await taxios.get(`${api}/chat/room/list`);
			const rdata: HttpResponse<Room> = response.data;
			const payload = rdata.payloads!;
			console.log("Rooms list:", payload);
		} catch (error: any) {
			const rtext = swallowError(error);
			console.error("Error getting rooms list:", rtext);
		}
	}, []);

	useEffect(() => {
		getRoomList();
	}, [getRoomList]);

	useEffect(() => {
		if (ws) ws.close();

		// /api/chat/room/{roomID} - use this route with a real roomID once the socket path is updated
		const socket = new WebSocket(`${api}/chat/room/0192b623-fb80-7af2-8661-72541262c42d`);

		socket.onopen = () => {
			console.log("WebSocket connection established");
		};

		socket.onmessage = (event) => {
			console.log("Message from server:", event.data);
			if (selectedChatId) {
				setMessages((prevMessages) => ({
					...prevMessages,
					[selectedChatId]: [
						...(prevMessages[selectedChatId] || []),
						{
							to: "Me",
							from: "WebSocket",
							text: event.data,
							time: "Now"
						}
					]
				}));
			}
		};

		socket.onclose = () => {
			console.log("WebSocket connection closed");
		};

		socket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		setWs(socket);
	}, [selectedChatId]);

	// Function to handle chat selection
	const handleChatSelect = (chatId: string) => {
		setSelectedChatId(chatId);
	};

	// Function to handle sending text messages
	const handleSendMessage = (message: string) => {
		if (selectedChatId) {
			const chat = newChat(message, myID, selectedChatId);
			ws?.send(JSON.stringify(chat));

			setMessages((prevMessages) => ({
				...prevMessages,
				[selectedChatId]: [
					...(prevMessages[selectedChatId] || []),
					{
						to: "Server",
						from: "Me",
						text: message,
						time: "Now"
					}
				]
			}));

			setInputMessage("");
		}
	};

	// Function to handle sending image messages
	const handleSendImage = (imageData: string) => {
		if (selectedChatId) {
			const chat = newChat(imageData, myID, selectedChatId);

			ws?.send(JSON.stringify(chat));

			setMessages((prevMessages) => ({
				...prevMessages,
				[selectedChatId]: [
					...(prevMessages[selectedChatId] || []),
					{
						to: "Server",
						from: "Me",
						text: "[Image]",
						time: "Now"
					}
				]
			}));
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
			<IonContent id="main-content">
				<div className="chat-container">
					<div className="chat-list">
						<ChatList onChatSelect={handleChatSelect} />
					</div>

					<div className="chat-view">
						{selectedChatId !== null ? (
							<>
								<div className="chat-header">
									<ChatHeader selectedChatId={selectedChatId} />
								</div>

								<div className="chat-messages">
									<ChatMessages messages={messages[selectedChatId] || []} />
								</div>

								<div className="chat-input">
									<IonFooter className="chat-input">
										<IonToolbar>
											<IonInput
												value={inputMessage}
												placeholder="Write a message..."
												onIonChange={(e: CustomEvent) => setInputMessage(e.detail.value!)}
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
								<p>Please select a chat to view messages.</p>
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
		</IonPage>
	);
};

export default Chats;
