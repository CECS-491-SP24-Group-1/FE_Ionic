import React, { useEffect, useRef, useState } from "react";
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
import { LastMessage, MembershipChange } from "../../types/chat";
import { newChat } from "@/util/chat";
import { useRoomList } from "@/hooks/useRoomList";
import "./Chats.scss";
import { Message } from "@ptypes/chat";

const ChatsPage: React.FC = () => {
	const { myID, vault, evault } = useVaultStore((state) => ({
		myID: state.myID,
		vault: state.vault as Exclude<typeof state.vault, null | undefined>,
		evault: state.evault as Exclude<typeof state.evault, null | undefined>
	}));

	const { clearRoomMessages, rooms } = useRoomStore((state) => ({
		clearRoomMessages: state.clearRoomMessages,
		rooms: state.rooms
	}));
	const [membersOnline, setMembersOnline] = useState<number>(0);
	const { isLoading, error } = useRoomList();
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [inputMessage, setInputMessage] = useState<string>("");
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [showCamera, setShowCamera] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const api = import.meta.env.VITE_API_URL;

	useEffect(() => {
		if (!selectedChatId || !api) return;

		const socket = new WebSocket(`${api}/chat/room/${selectedChatId}`);

		socket.onopen = () => {
			console.log("WebSocket connection established");
		};

		socket.onmessage = (event) => {
			console.log("Message from server:", event.data);
			const msg: Message = JSON.parse(event.data);

			switch (msg.type) {
				case "JOIN_EVENT":
				case "QUIT_EVENT": {
					const delta = JSON.parse(msg.content) as MembershipChange;
					setMembersOnline(delta.new);
					console.log(`membership change: old ${delta.old}, new ${delta.new}`);
					break;
				}
				default: {
					useRoomStore.getState().addMessageToRoom(selectedChatId, msg.id, msg);
					break;
				}
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
	}, [selectedChatId, api]);

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
			const chat = newChat(imageData, myID, selectedChatId);
			ws?.send(JSON.stringify(chat));

			useRoomStore.getState().addMessageToRoom(selectedChatId, chat.id, {
				id: chat.id,
				type: "U_MSG",
				sender_id: myID,
				recipient_id: selectedChatId,
				content: "[Image]"
			});
		}
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

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && selectedChatId) {
			const formData = new FormData();
			formData.append("file", file);

			try {
				const response = await fetch(`${api}/upload`, { method: "POST", body: formData });
				if (!response.ok) {
					console.error("Failed to upload file", response.statusText);
					return;
				}

				const { url } = await response.json();
				const chat = newChat(url, myID, selectedChatId);
				ws?.send(JSON.stringify(chat));

				useRoomStore.getState().addMessageToRoom(selectedChatId, chat.id, {
					id: chat.id,
					type: "FILE",
					sender_id: myID,
					recipient_id: selectedChatId,
					content: file.name,
					url: url
				});
			} catch (error) {
				console.error("Error uploading file:", error);
				console.log("File upload URL:", `${api}/upload`);
			}
		}
	};

	// Function to handle recording
	const handleAudioRecording = () => {
		if (isRecording) {
			// Stop recording
			mediaRecorderRef.current?.stop();
			setIsRecording(false);
		} else {
			// Start recording
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then((stream) => {
					const mediaRecorder = new MediaRecorder(stream);
					mediaRecorderRef.current = mediaRecorder;

					mediaRecorder.ondataavailable = (event) => {
						setAudioChunks((prev) => [...prev, event.data]);
					};

					mediaRecorder.onstop = () => {
						const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
						setAudioChunks([]);
						handleSendAudio(audioBlob);
					};

					mediaRecorder.start();
					setIsRecording(true);
				})
				.catch((error) => console.error("Error accessing microphone:", error));
		}
	};

	// Function to send audio file as a message
	const handleSendAudio = async (audioBlob: Blob) => {
		if (selectedChatId) {
			const formData = new FormData();
			formData.append("file", audioBlob, "recording.webm");

			try {
				const response = await fetch(`${api}/upload`, { method: "POST", body: formData });
				if (!response.ok) {
					console.error("Failed to upload audio file:", response.statusText);
					return;
				}

				const { url } = await response.json();
				const chat = newChat(url, myID, selectedChatId);
				ws?.send(JSON.stringify(chat));

				useRoomStore.getState().addMessageToRoom(selectedChatId, chat.id, {
					id: chat.id,
					type: "FILE",
					sender_id: myID,
					recipient_id: selectedChatId,
					content: "[Audio Message]",
					url: url
				});
			} catch (error) {
				console.error("Error uploading audio file:", error);
			}
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
										<ChatHeader
											selectedChatId={selectedChatId}
											membersOnline={membersOnline}
										/>
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
												<IonButton onClick={handleAudioRecording} slot="end" fill="clear">
													<IonIcon
														icon={mic}
														color={isRecording ? "danger" : undefined}
													/>
												</IonButton>
												<IonButton
													slot="end"
													fill="clear"
													onClick={() => setShowCamera(true)}>
													<IonIcon icon={camera} />
												</IonButton>
												<IonButton
													slot="end"
													fill="clear"
													onClick={() => fileInputRef.current?.click()}>
													<IonIcon icon={attach} />
												</IonButton>

												<input
													type="file"
													ref={fileInputRef}
													style={{ display: "none" }}
													onChange={handleFileChange}
												/>
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
