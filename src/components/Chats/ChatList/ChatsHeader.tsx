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
import { useRoomStore } from "@/stores/room_store"; // Import Zustand store hook

interface ChatHeaderProps {
	selectedChatId: string; // Use the chatId to get the correct chat data
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedChatId }) => {
	// Get the room data from Zustand
	const room = useRoomStore((state) => state.rooms[selectedChatId]);

	// Ensure the selected room exists
	if (!room) {
		return null; // Handle the case where the room is not found (optional)
	}

	const toggleMenu = async () => {
		await menuController.toggle();
	};

	return (
		<IonItem lines="none" className="user-chat-bar">
			<IonAvatar slot="start">
				<img src={`https://i.pravatar.cc/300?u=${room.id}`} alt={room.id} />{" "}
				{/* Using placeholder avatar */}
			</IonAvatar>
			<IonLabel>
				<h2>{room.id}</h2> {/* Display the room ID or name */}
				<p>Click here for contact information</p>
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
