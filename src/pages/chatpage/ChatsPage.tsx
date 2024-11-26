// src/pages/ChatsPage.tsx

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
import ChatList from "./ChatList/ChatList";
import ChatMessages from "./ChatView/ChatMessages";
import taxios from "@/util/token_refresh_hook";
import ChatHeader from "./ChatView/ChatHeader";
import Camera from "@/pages/Camera";
import useVaultStore from "@/stores/vault_store";
import { useRoomStore } from "@/stores/room_store";
import { LastMessage, MembershipChange } from "types/chat";
import { motion } from "framer-motion";

import { newChat } from "@/util/chat";
import { Message } from "@ptypes/chat";

import { useWindowSize } from "@/hooks/useWindowSize";
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
	const [membersOnline, setMembersOnline] = useState<number>(0);

	const { isLoading, error } = useRoomList(); // Use the custom hook

	//Typing notif
	const [isTyping, setIsTyping] = useState(false);
	let typingTimeout: ReturnType<typeof setTimeout>;

	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [inputMessage, setInputMessage] = useState<string>("");
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [showCamera, setShowCamera] = useState(false);
	const api = import.meta.env.VITE_API_URL;

	const { width } = useWindowSize();
	const isMobile = width !== undefined && width < 640;

	const fadeInUp = {
		hidden: { opacity: 0, y: 20 },
		visible: (delay = 0) => ({
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				delay
			}
		})
	};

	const bounceAnimation = {
		animate: {
			y: [0, -10, 0]
		},
		transition: {
			duration: 1.5,
			repeat: Infinity,
			repeatType: "loop"
		}
	};

	// WebSocket setup
	useEffect(() => {
		if (!selectedChatId) return;

		const socket = new WebSocket(`${api}/chat/room/${selectedChatId}`);

		socket.onopen = () => {
			console.log("WebSocket connection established");
		};

		socket.onmessage = (event) => {
			//Get the message from the server and log the event
			console.log("Message from server:", event.data);
			const msg: Message = JSON.parse(event.data);

			//Switch over the message type
			switch (msg.type) {
				//User join/quit event
				case "JOIN_EVENT":
				case "QUIT_EVENT": {
					const delta = JSON.parse(msg.content) as MembershipChange;
					setMembersOnline(delta.new);
					console.log(`membership change: old ${delta.old}, new ${delta.new}`);
					break;
				}

				/*
				// Handle typing event
				case "UNKNOWN": {
					// Parse the content to get typing status and user ID
					const typingData = JSON.parse(msg.content);
					const { isTyping, userId } = typingData;

					// Update the typingUser in the Zustand store
					useRoomStore
						.getState()
						.updateTypingStatus(selectedChatId, isTyping ? userId : null);
					break;
				}
				*/

				//Default handler
				default: {
					//Add the incoming message to the Zustand store
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
	//TODO: handle typing events here
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

	//Function to send typing status
	const sendTypingStatus = (status: boolean) => {
		if (ws && selectedChatId) {
			ws.send(
				JSON.stringify({
					type: "typing",
					isTyping: status,
					chatId: selectedChatId,
					userId: myID
				})
			);
		}
	};

	//TODO: this could be done better
	// Handle input changes to detect typing
	/*
	const handleTyping = () => {
		if (!isTyping) {
			setIsTyping(true);
			sendTypingStatus(true); // Notify others the user started typing
		}

		// Clear the existing timeout
		clearTimeout(typingTimeout);

		// Set a new timeout to send 'stopped typing' after a delay
		typingTimeout = setTimeout(() => {
			setIsTyping(false);
			sendTypingStatus(false); // Notify others the user stopped typing
		}, 2000); // Stop typing notification after 2 seconds of inactivity
	};
	*/

	const handleExitChat = () => {
		setSelectedChatId(null); // Deselect the chat
	};

	const handleLeaveRoom = async (chatId: string) => {
		try {
			const response = await taxios.post(`${api}/chat/room/${chatId}/leave`);

			if (response.status !== 200) {
				// Log the error response for more context
				console.error(`Error leaving room: ${response.status} - ${response.data}`);
				throw new Error("Failed to leave the room");
			}

			// Remove the room from Zustand store after a successful API call
			useRoomStore.getState().removeRoom(chatId);

			// Update UI upon successful room leave
			setSelectedChatId(null);
			alert("Successfully left the room");
		} catch (error) {
			// Catch and log any errors that occurred during the fetch
			console.error("An error occurred while trying to leave the room:", error);
			alert("An error occurred while trying to leave the room");
		}
	};

	return (
		<IonPage id="chat-page">
			{isLoading ? (
				<div>Loading chats...</div>
			) : error ? (
				<div>Error loading chats.</div>
			) : (
				<IonContent id="chat-page">
					<div className="chat-container flex h-full gap-4 bg-secondary dark:bg-white">
						{/* Chat List */}
						{(!selectedChatId || !isMobile) && (
							<div className="chat-list-container max-h-100 m-0 min-w-full overflow-y-auto rounded-none bg-borderPrimary dark:bg-primary-light sm:mb-4 sm:ml-4 sm:mt-4 sm:min-w-[25rem] sm:rounded-b-2xl sm:rounded-t-2xl">
								<ChatList
									rooms={rooms}
									selectedChatId={selectedChatId}
									onChatSelect={handleChatSelect}
									onLeaveRoom={handleLeaveRoom}
								/>
							</div>
						)}

						{/* Chat View */}
						{selectedChatId && (
							<div className="chat-view-container flex w-full flex-col bg-borderPrimary p-4 dark:bg-primary-light sm:mb-4 sm:mr-4 sm:mt-4 sm:rounded-2xl">
								{/* Chat Header */}
								<div className="chat-header rounded-t-lg">
									<ChatHeader
										selectedChatId={selectedChatId}
										membersOnline={membersOnline}
										onExitChat={handleExitChat}
										isMobileView={isMobile}
									/>
								</div>

								{/* Chat Messages */}
								<div className="flex-grow overflow-y-auto bg-borderPrimary dark:bg-primary-light">
									<ChatMessages
										messages={Object.values(rooms[selectedChatId]?.messages || {})}
									/>
								</div>
								{/* Chat Input */}
								<div className="chat-input">
									<div className="rounded-b-lg dark:bg-primary-light">
										<div className="flex items-center gap-0">
											<IonInput
												value={inputMessage}
												placeholder="    Write a message..."
												onIonChange={(e: CustomEvent) => setInputMessage(e.detail.value!)}
												onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent)}
												className="mb-3 ml-4 flex-1 rounded-3xl bg-secondary pl-4 text-gray-200 dark:bg-secondary-light dark:text-gray-700"
											/>

											<IonButton
												onClick={() => handleSendMessage(inputMessage)}
												fill="clear"
												className="pb-3 text-blue-500 hover:text-blue-700">
												<IonIcon icon={send} />
											</IonButton>

											{/* Audio Recording */}
											<IonButton
												onClick={handleAudioRecording}
												slot="end"
												fill="clear"
												className="pb-3 text-blue-500 hover:text-blue-700">
												<IonIcon icon={mic} color={isRecording ? "danger" : undefined} />
											</IonButton>

											{/* Camera Button */}
											<IonButton
												fill="clear"
												onClick={() => setShowCamera(true)}
												className="pb-3 text-blue-500 hover:text-blue-700">
												<IonIcon icon={camera} />
											</IonButton>

											{/* File Attachment */}
											<IonButton
												slot="end"
												fill="clear"
												onClick={() => fileInputRef.current?.click()}
												className="pb-3 text-blue-500 hover:text-blue-700">
												<IonIcon icon={attach} />
											</IonButton>

											<input
												type="file"
												ref={fileInputRef}
												style={{ display: "none" }}
												onChange={handleFileChange}
											/>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* No Chat Selected Message (for larger screens) */}
						{!selectedChatId && !isMobile && (
							<div className="flex h-full flex-grow flex-col items-center justify-center rounded-2xl bg-transparent p-4 text-center dark:bg-primary-light">
								{/* Animated Logo */}
								<motion.img
									src={logo}
									className="empty-chat-image mx-auto h-44 w-44 dark:invert"
									alt="No chat selected"
									variants={bounceAnimation}
									animate="animate"
								/>

								{/* Animated Header */}
								<motion.h2
									className="text-6xl font-semibold text-gray-200 dark:text-gray-800"
									variants={fadeInUp}
									initial="hidden"
									animate="visible"
									custom={0.2} // Add delay for sequential animation
								>
									Wraith Web
								</motion.h2>

								{/* Animated Paragraphs */}
								<motion.p
									className="mt-2 text-gray-400 dark:text-gray-600"
									variants={fadeInUp}
									initial="hidden"
									animate="visible"
									custom={0.4} // Add delay for sequential animation
								>
									Please select a chat or create a new one to start messaging.
								</motion.p>
								<motion.p
									className="mt-1 text-gray-400 dark:text-gray-600"
									variants={fadeInUp}
									initial="hidden"
									animate="visible"
									custom={0.6} // Add delay for sequential animation
								>
									You can create and organize your conversations here. Stay connected!
								</motion.p>
							</div>
						)}
					</div>

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
