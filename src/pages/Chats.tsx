import React, { KeyboardEventHandler, useCallback, useEffect, useState } from "react";
import {
	IonContent,
	IonHeader,
	IonPage,
	IonToolbar,
	IonTitle,
	IonFooter,
	IonInput,
	IonButton,
	IonIcon
} from "@ionic/react";
import { send, attach, mic } from "ionicons/icons";
import ChatList from "../components/Chats/ChatList/ChatList";
import ChatMessages from "../components/Chats/ChatMessages";
import ChatHeader from "../components/Chats/ChatHeader";
import ChatMenu from "../components/Chats/Menu/ChatMenu";
import "./Chats.scss";
import useVaultStore from "@/stores/vault_store";
import { newChat } from "@/util/chat";
import taxios from "@/util/token_refresh_hook";
import { swallowError } from "@/util/http_util";
import { HttpResponse } from "@ptypes/http_response";

const Chats: React.FC = () => {
	const { myID } = useVaultStore((state) => ({
		myID: state.myID
	}));

	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [inputMessage, setInputMessage] = useState("");
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [messages, setMessages] = useState<{
		[key: string]: { to: string; from: string; text: string; time: string }[];
	}>({}); // Object to hold messages by chatId
	const api = import.meta.env.VITE_API_URL;

	//TODO: integrate this eventually. This is only a test
	const getRoomList = useCallback(async () => {
		try {
			//Issue the request and get the response
			const response = await taxios.get(`${api}/chat/room/list`);
			const rdata: HttpResponse<any> = response.data;
			const payload = rdata!.payloads;

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
		const socket = new WebSocket(`${api}/chat/room/0192ad23-2978-7916-a89d-bee209d84b49`);

		socket.onopen = () => {
			console.log("WebSocket connection established");
		};

		socket.onmessage = (event) => {
			console.log("Message from server:", event.data);
			if (selectedChatId) {
				// TODO: change this to real data
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

	// Function to handle sending messages
	const handleSendMessage = (message: string) => {
		if (selectedChatId) {
			//Create the chat message
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

			setInputMessage(""); // Clear the input field after sending
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		const inputElement = event.target as HTMLIonInputElement;
		const message = inputElement.value?.toString().trim();

		if (event.key === "Enter" && message) {
			event.preventDefault(); // Prevent any unwanted default behavior
			handleSendMessage(message); // Trigger the send message logic directly
			setInputMessage(""); // Clear the input field after sending
		}
	};

	return (
		<IonPage>
			<IonContent id="main-content">
				<div className="chat-container">
					{/* Chat list (left sidebar) */}
					<div className="chat-list">
						<ChatList onChatSelect={handleChatSelect} />
					</div>

					{/* TODO: break this up into its own component */}
					{/* Chat view (right side) */}
					<div className="chat-view">
						{selectedChatId !== null ? (
							<>
								{/* Header stays fixed at the top */}
								<div className="chat-header">
									<ChatHeader selectedChatId={selectedChatId} />
								</div>

								{/* Scrollable messages section */}
								<div className="chat-messages">
									<ChatMessages messages={messages[selectedChatId] || []} />{" "}
									{/* Pass only messages for the selected chat */}
								</div>

								{/* Input stays fixed at the bottom */}
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

				{/* Chat Menu (right side menu) */}
				<ChatMenu selectedChatId={selectedChatId} />
			</IonContent>
		</IonPage>
	);
};

export default Chats;
