import React, { useEffect, useState } from "react";
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle } from "@ionic/react";
import ChatList from "../components/Chats/ChatList/ChatList";
import ChatMessages from "../components/Chats/ChatMessages";
import ChatInput from "../components/Chats/ChatInput";
import ChatHeader from "../components/Chats/ChatHeader";
import ChatMenu from "../components/Chats/Menu/ChatMenu";
import { chatMessagesData } from "../data/ChatMessagesData";

import "./Chats.scss";
import useVaultStore from "@/stores/vault_store";

const Chats: React.FC = () => {
	const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
	//TODO: tmp
	const { dummy, setDummy, dummy2, setDummy2 } = useVaultStore((state) => ({
		dummy: state.dummy,
		setDummy: state.setDummy,
		dummy2: state.dummy2,
		setDummy2: state.setDummy2
	}));

	// Function to handle chat selection
	const handleChatSelect = (chatId: number) => {
		setSelectedChatId(chatId);
	};

	//TODO: tmp
	useEffect(() => {
		console.log("dummy val:", dummy);
		console.log("dummy val2:", dummy2);
	});

	// Function to handle sending messages
	const handleSendMessage = (message: string) => {
		if (selectedChatId !== null) {
			chatMessagesData[selectedChatId].push({
				to: "Mariana",
				from: "Me",
				text: message,
				time: "Now"
			});
		}
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>Chats</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent id="main-content">
				<div className="chat-container">
					{/* Chat list (left sidebar) */}
					<div className="chat-list">
						<ChatList onChatSelect={handleChatSelect} />
					</div>

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
									<ChatMessages messages={chatMessagesData[selectedChatId]} />
								</div>

								{/* Input stays fixed at the bottom */}
								<div className="chat-input">
									<ChatInput onSendMessage={handleSendMessage} />
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
