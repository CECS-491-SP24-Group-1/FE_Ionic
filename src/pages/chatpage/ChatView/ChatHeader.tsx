// src/pages/ChatView/ChatHeader.tsx

import React, { useEffect, useState } from "react";
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
import { createAvatar } from "@dicebear/core";
import { thumbs } from "@dicebear/collection";

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
	const [avatarUrl, setAvatarUrl] = useState<string>("");

	useEffect(() => {
		const generateAvatar = async () => {
			if (selectedChatId) {
				const avatar = await createAvatar(thumbs, { seed: selectedChatId }).toDataUri();
				setAvatarUrl(avatar);
			}
		};

		generateAvatar();
	}, [selectedChatId]);

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
			className="flex items-center text-textPrimary dark:bg-primary-light dark:text-textPrimary-light">
			{/* Left Section: Back Button on Mobile */}
			<div className="flex flex-grow items-center">
				{/* Left Section */}
				<div className="flex items-center gap-4">
					{isMobileView && (
						<IonButton onClick={onExitChat} fill="clear" className="mr-2">
							<IonIcon icon={arrowBack} />
						</IonButton>
					)}
					<IonAvatar slot="start" className="h-12 w-12 flex-shrink-0 rounded-full">
						<img
							src={avatarUrl || "https://via.placeholder.com/48"}
							alt={`Avatar for chat ${selectedChatId}`}
						/>
					</IonAvatar>
					<IonLabel className="max-w-[200px] flex-grow overflow-hidden text-textPrimary dark:text-textPrimary-light md:max-w-none">
						<h2 className="max-w-full truncate text-lg font-semibold">
							{selectedChatId}
						</h2>
						<p className="text-sm text-textSecondary dark:text-textSecondary-light">
							Current members online: <strong>{membersOnline}</strong>
						</p>
					</IonLabel>
				</div>

				{/* Right Section: Action Buttons */}
				<div className="ml-auto">
					
					<IonButton
						onClick={openMenu}
						fill="clear"
						className="text-accent dark:text-accent-light">
						<IonIcon icon={informationCircle} />
					</IonButton>
					{/* Hide the exit button on mobile if the back button is present */}
					{!isMobileView && (
						<IonButton
							fill="clear"
							onClick={onExitChat}
							className="text-red-500 dark:text-red-400">
							<IonIcon icon={exitOutline} />
						</IonButton>
					)}
				</div>
			</div>
		</IonItem>
	);
};

export default ChatHeader;
