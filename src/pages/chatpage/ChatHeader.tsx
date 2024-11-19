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
	onExitChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	selectedChatId,
	membersOnline,
	onExitChat
}) => {
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
		<IonItem
			lines="none"
			className="dark:bg-backgroundHighlight-light text-textPrimary dark:text-textPrimary-light">
			<IonAvatar slot="start" className="rounded-full">
				<img
					src={`https://i.pravatar.cc/300?u=${selectedChatId}`} // Temporary use id for avatar
					alt={`Avatar for chat ${selectedChatId}`}
				/>
			</IonAvatar>
			<IonLabel className="text-textPrimary dark:text-textPrimary-light">
				<h2 className="font-semibold text-lg">{selectedChatId}</h2>{" "}
				{/* Temporary display selectedChatId as the title */}
				<p className="text-textSecondary dark:text-textSecondary-light text-sm">
					Current members online: <strong>{membersOnline}</strong>
				</p>
			</IonLabel>
			<div className="chat-header-icons flex items-center space-x-2">
				<IonButton
					fill="clear"
					onClick={onExitChat}
					className="text-red-600 dark:text-red-400 text-sm">
					Exit Room
				</IonButton>
				<IonButton fill="clear" className="text-accent dark:text-accent-light">
					<IonIcon icon={call} />
				</IonButton>
				<IonButton fill="clear" className="text-accent dark:text-accent-light">
					<IonIcon icon={videocam} />
				</IonButton>
				<IonMenuToggle>
					<IonButton
						fill="clear"
						onClick={toggleMenu}
						className="text-accent dark:text-accent-light">
						<IonIcon icon={informationCircle} />
					</IonButton>
				</IonMenuToggle>
			</div>
		</IonItem>
	);
};

export default ChatHeader;
