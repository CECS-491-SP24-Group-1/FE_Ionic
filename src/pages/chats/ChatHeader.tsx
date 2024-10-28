import React from "react";
import { menuController } from "@ionic/core";
import {
	IonItem,
	IonAvatar,
	IonLabel,
	IonButton,
	IonIcon,
	IonMenuToggle
} from "@ionic/react";
import { call, videocam, informationCircle } from "ionicons/icons";
import { useRoomStore } from "@/stores/room_store";

interface ChatHeaderProps {
	selectedChatId: string;
	membersOnline: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedChatId, membersOnline }) => {
	// Retrieve the selected chat from Zustand
	const selectedChat = useRoomStore((state) => state.rooms[selectedChatId]);

	// Ensure the selected chat exists
	if (!selectedChat) {
		return null;
	}

	const toggleMenu = async () => {
		await menuController.toggle();
	};

	return (
		<IonItem lines="none" className="user-chat-bar">
			<IonAvatar slot="start">
				<img
					src={`https://i.pravatar.cc/300?u=${selectedChatId}`} // Temporary use id for avatar
					alt={`Avatar for chat ${selectedChatId}`}
				/>
			</IonAvatar>
			<IonLabel>
				<h2>{selectedChatId}</h2> {/* temporary display selectedChatId as the title */}
				<p>Current members online: <strong>{membersOnline}</strong></p>
			</IonLabel>
			<div className="chat-header-icons">
				<IonButton fill="clear">
					<IonIcon icon={call} />
				</IonButton>
				<IonButton fill="clear">
					<IonIcon icon={videocam} />
				</IonButton>
				<IonMenuToggle>
					<IonButton fill="clear" onClick={toggleMenu}>
						<IonIcon icon={informationCircle} />
					</IonButton>
				</IonMenuToggle>
			</div>
		</IonItem>
	);
};

export default ChatHeader;
