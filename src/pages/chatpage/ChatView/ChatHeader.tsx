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
import { call, videocam, informationCircle, exitOutline } from "ionicons/icons";
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
	const selectedChat = useRoomStore((state) => state.rooms[selectedChatId]);

	if (!selectedChat) {
		return null;
	}

	return (
		<IonItem
			lines="none"
			className="dark:bg-primary-light text-textPrimary dark:text-textPrimary-light">
			<IonAvatar slot="start" className="rounded-full">
				<img
					src={`https://i.pravatar.cc/300?u=${selectedChatId}`}
					alt={`Avatar for chat ${selectedChatId}`}
				/>
			</IonAvatar>
			<IonLabel className="text-textPrimary dark:text-textPrimary-light">
				<h2 className="font-semibold text-lg">{selectedChatId}</h2>
				<p className="text-textSecondary dark:text-textSecondary-light text-sm">
					Current members online: <strong>{membersOnline}</strong>
				</p>
			</IonLabel>
			<div className="chat-header-icons flex items-center">
				<IonButton
					fill="clear"
					onClick={onExitChat}
					className="text-red-500 dark:text-red-400">
					<IonIcon icon={exitOutline} />
				</IonButton>
				<IonButton fill="clear" className="text-accent dark:text-accent-light">
					<IonIcon icon={call} />
				</IonButton>
				<IonButton fill="clear" className="text-accent dark:text-accent-light">
					<IonIcon icon={videocam} />
				</IonButton>
				{/* Wrap the menu trigger button in IonMenuToggle */}
				<IonMenuToggle menu="end">
					<IonButton fill="clear" className="text-accent dark:text-accent-light">
						<IonIcon icon={informationCircle} />
					</IonButton>
				</IonMenuToggle>
			</div>
		</IonItem>
	);
};

export default ChatHeader;
