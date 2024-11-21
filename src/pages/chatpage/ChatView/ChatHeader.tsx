// src/pages/ChatView/ChatHeader.tsx

import React from "react";
import { menuController } from "@ionic/core/components";
import { IonItem, IonAvatar, IonLabel, IonButton, IonIcon } from "@ionic/react";
import {
	call,
	videocam,
	informationCircle,
	exitOutline,
	arrowBack
} from "ionicons/icons";
import { useRoomStore } from "@/stores/room_store";

interface ChatHeaderProps {
	selectedChatId: string;
	membersOnline: number;
	onExitChat: () => void;
	isMobileView: boolean; // New prop to determine if it's a mobile view
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	selectedChatId,
	membersOnline,
	onExitChat,
	isMobileView
}) => {
	const selectedChat = useRoomStore((state) => state.rooms[selectedChatId]);

	if (!selectedChat) {
		return null;
	}

	async function openMenu() {
		try {
			await menuController.enable(true, "chat-menu");
			await menuController.open("chat-menu");
		} catch (error) {
			console.error("Failed to open menu:", error);
		}
	}

	return (
		<IonItem
			lines="none"
			className="dark:bg-primary-light text-textPrimary dark:text-textPrimary-light flex items-center">
			{/* Left Section: Back Button on Mobile */}
			<div className="flex gap-16">
				<div className="flex items-center gap-4">
					{isMobileView && (
						<IonButton onClick={onExitChat} fill="clear" className="mr-2">
							<IonIcon icon={arrowBack} />
						</IonButton>
					)}
					<IonAvatar slot="start" className="w-12 h-12 rounded-full">
						<img
							src={`https://i.pravatar.cc/300?u=${selectedChatId}`}
							alt={`Avatar for chat ${selectedChatId}`}
						/>
					</IonAvatar>
					<IonLabel className="text-textPrimary dark:text-textPrimary-light">
						<h2 className="font-semibold text-lg truncate">{selectedChatId}</h2>
						<p className="text-textSecondary dark:text-textSecondary-light text-sm">
							Current members online: <strong>{membersOnline}</strong>
						</p>
					</IonLabel>
				</div>

				{/* Right Section: Action Buttons */}
				<div className="chat-header-icons">
					{/* Hide the exit button on mobile if the back button is present */}
					{!isMobileView && (
						<IonButton
							fill="clear"
							onClick={onExitChat}
							className="text-red-500 dark:text-red-400">
							<IonIcon icon={exitOutline} />
						</IonButton>
					)}
					<IonButton fill="clear" className="text-accent dark:text-accent-light">
						<IonIcon icon={call} />
					</IonButton>
					<IonButton fill="clear" className="text-accent dark:text-accent-light">
						<IonIcon icon={videocam} />
					</IonButton>
					<IonButton
						onClick={openMenu}
						fill="clear"
						className="text-accent dark:text-accent-light">
						<IonIcon icon={informationCircle} />
					</IonButton>
				</div>
			</div>
		</IonItem>
	);
};

export default ChatHeader;
