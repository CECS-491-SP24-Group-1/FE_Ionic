import React, { useEffect, useState } from "react";
import {
	Container,
	AppBar,
	Toolbar,
	Typography,
	TextField,
	IconButton,
	Dialog,
	CircularProgress
} from "@mui/material";
import { Send, Mic, CameraAlt, AttachFile } from "@mui/icons-material";
import logo from "@assets/images/glock_primary.svg";
import ChatList from "./ChatList/ChatList";
import ChatMessages from "./ChatMessages";
import taxios from "@/util/token_refresh_hook";
import ChatHeader from "./ChatHeader";
import ChatMenu from "./Menu/ChatMenu";
import Camera from "@/pages/Camera";
import useVaultStore from "@/stores/vault_store";
import { useRoomStore } from "@/stores/room_store";
import { useRoomList } from "@/hooks/useRoomList";
import { Message } from "@ptypes/chat";

const ChatsPage: React.FC = () => {
	const { myID } = useVaultStore((state) => ({
		myID: state.myID
	}));

	const { clearRoomMessages, rooms } = useRoomStore((state) => ({
		clearRoomMessages: state.clearRoomMessages,
		rooms: state.rooms
	}));

	const { isLoading, error } = useRoomList();

	const [membersOnline, setMembersOnline] = useState<number>(0);
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [inputMessage, setInputMessage] = useState<string>("");
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [showCamera, setShowCamera] = useState(false);
	const api = import.meta.env.VITE_API_URL;

	// WebSocket setup (same as original)
	useEffect(() => {
		if (!selectedChatId) return;
		const socket = new WebSocket(`${api}/chat/room/${selectedChatId}`);
		socket.onopen = () => console.log("WebSocket connection established");
		socket.onclose = () => console.log("WebSocket connection closed");
		socket.onerror = (error) => console.error("WebSocket error:", error);
		setWs(socket);
		return () => socket.close();
	}, [selectedChatId, api]);

	const handleChatSelect = (chatId: string) => {
		if (selectedChatId) clearRoomMessages(selectedChatId);
		setSelectedChatId(chatId);
	};

	const handleSendMessage = (message: string) => {
		if (!message.trim() || !selectedChatId) return;
		const chat = {
			id: `${Date.now()}`,
			type: "U_MSG",
			sender_id: myID,
			recipient_id: selectedChatId,
			content: message
		};
		ws?.send(JSON.stringify(chat));
		useRoomStore.getState().addMessageToRoom(selectedChatId, chat.id, chat);
		setInputMessage("");
	};

	return (
		<Container maxWidth="lg" className="py-4 h-screen flex flex-col">
			{isLoading ? (
				<CircularProgress />
			) : error ? (
				<Typography color="error">Error loading chats.</Typography>
			) : (
				<div className="flex h-full chat-container">
					{/* Chat List */}
					<div className="chat-list w-1/3 max-h-full bg-chat-sidebar border-r overflow-y-auto">
						<ChatList
							rooms={rooms}
							selectedChatId={selectedChatId}
							onChatSelect={handleChatSelect}
							onLeaveRoom={() => {}}
						/>
					</div>

					{/* Chat View */}
					<div className="chat-view flex-grow flex flex-col bg-chat-bg">
						{selectedChatId !== null ? (
							<>
								<div className="chat-header sticky top-0 bg-white z-10 p-4">
									<ChatHeader
										selectedChatId={selectedChatId}
										membersOnline={membersOnline}
										onExitChat={() => setSelectedChatId(null)}
									/>
								</div>

								{/* Chat Messages */}
								<div className="chat-messages flex-grow overflow-y-auto p-4">
									<ChatMessages
										messages={Object.values(rooms[selectedChatId]?.messages || {})}
									/>
								</div>

								{/* Input Area */}
								<Toolbar className="chat-input bg-white w-full sticky bottom-0 p-4">
									<TextField
										value={inputMessage}
										placeholder="Write a message..."
										onChange={(e) => setInputMessage(e.target.value)}
										fullWidth
										onKeyDown={(e) =>
											e.key === "Enter" && handleSendMessage(inputMessage)
										}
									/>
									<IconButton onClick={() => handleSendMessage(inputMessage)}>
										<Send />
									</IconButton>
									<IconButton onClick={() => setShowCamera(true)}>
										<CameraAlt />
									</IconButton>
									<IconButton>
										<Mic />
									</IconButton>
									<IconButton>
										<AttachFile />
									</IconButton>
								</Toolbar>
							</>
						) : (
							<div className="no-chat-selected flex flex-col justify-center items-center text-center bg-chat-bg text-gray-300 h-full">
								<img src={logo} alt="No Chat Selected" className="w-40 opacity-80 mb-4" />
								<Typography variant="h4" className="text-white">
									Wraith Web
								</Typography>
								<Typography className="max-w-md leading-relaxed">
									Select a chat or start a new conversation.
								</Typography>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Chat Menu */}
			<ChatMenu selectedChatId={selectedChatId} />

			{/* Camera Modal */}
			<Dialog open={showCamera} onClose={() => setShowCamera(false)} maxWidth="md">
				<Camera
					onCapture={(imageData) => {
						handleSendMessage(imageData);
						setShowCamera(false);
					}}
				/>
			</Dialog>
		</Container>
	);
};

export default ChatsPage;
