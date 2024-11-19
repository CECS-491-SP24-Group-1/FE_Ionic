import React from "react";
import {
	IonMenu,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonList,
	IonItem,
	IonAvatar,
	IonLabel,
	IonButton,
	IonMenuToggle
} from "@ionic/react";

interface ChatMenuProps {
	selectedChatId: string | null;
}
const ChatMenu: React.FC<ChatMenuProps> = ({ selectedChatId }) => {
	if (!selectedChatId) return null;

	// Temporary mock data, replace with actual data source
	const chatList = [
		{
			id: "1",
			avatar: "https://i.pravatar.cc/300",
			name: "John Doe",
			time: "10:00 AM"
		}
	];

	const selectedChat = chatList.find((chat) => chat.id === selectedChatId);
	if (!selectedChat) return null;

	return (
		<IonMenu
			side="end"
			contentId="main-content"
			menuId="end" // Menu ID must match IonMenuToggle
			className="bg-white dark:bg-gray-800">
			<IonHeader className="border-b border-gray-200 dark:border-gray-700">
				<IonToolbar>
					<IonTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
						Chat Information
					</IonTitle>
					<IonMenuToggle>
						<IonButton fill="clear" className="text-gray-600 dark:text-gray-300">
							Close
						</IonButton>
					</IonMenuToggle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
					<IonItem className="flex items-center gap-4 py-4">
						<IonAvatar slot="start">
							<img
								src={selectedChat.avatar}
								alt={selectedChat.name}
								className="rounded-full"
							/>
						</IonAvatar>
						<IonLabel>
							<h2 className="font-semibold text-gray-800 dark:text-gray-100">
								{selectedChat.name}
							</h2>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Last message at {selectedChat.time}
							</p>
						</IonLabel>
					</IonItem>
					<IonItem button className="hover:bg-gray-100 dark:hover:bg-gray-700">
						<IonLabel>Profile</IonLabel>
					</IonItem>
					<IonItem button className="hover:bg-gray-100 dark:hover:bg-gray-700">
						<IonLabel>Mute Notifications</IonLabel>
					</IonItem>
					<IonItem button className="hover:bg-gray-100 dark:hover:bg-gray-700">
						<IonLabel>Search in Chat</IonLabel>
					</IonItem>
					<IonItem button className="hover:bg-gray-100 dark:hover:bg-gray-700">
						<IonLabel>Media, Links, and Docs</IonLabel>
					</IonItem>
					<IonItem button className="hover:bg-gray-100 dark:hover:bg-gray-700">
						<IonLabel>Privacy & Support</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
		</IonMenu>
	);
};

export default ChatMenu;
