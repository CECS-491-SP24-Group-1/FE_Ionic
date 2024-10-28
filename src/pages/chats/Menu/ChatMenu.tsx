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
	IonIcon,
	IonButtons,
	IonMenuToggle
} from "@ionic/react";
import { close } from "ionicons/icons";
import { chatList } from "../../../data/ChatListData";

interface ChatMenuProps {
	selectedChatId: string | null;
}

const ChatMenu: React.FC<ChatMenuProps> = ({ selectedChatId }) => {
	if (selectedChatId === null) return null;

	const selectedChat = chatList.find((chat) => chat.id === selectedChatId);
	if (!selectedChat) return null;

	return (
		<IonMenu side="end" contentId="main-content">
			<IonHeader>
				<IonToolbar>
					<IonTitle>Chat Information</IonTitle>
					<IonMenuToggle>
						<IonButton>Click to close</IonButton>
					</IonMenuToggle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
					<IonItem>
						<IonAvatar slot="start">
							<img src={selectedChat.avatar} alt={selectedChat.name} />
						</IonAvatar>
						<IonLabel>
							<h2>{selectedChat.name}</h2>
							<p>Last message at {selectedChat.time}</p>
						</IonLabel>
					</IonItem>
					{/* Menu options */}
					<IonItem button>
						<IonLabel>Profile</IonLabel>
					</IonItem>
					<IonItem button>
						<IonLabel>Mute Notifications</IonLabel>
					</IonItem>
					<IonItem button>
						<IonLabel>Search in Chat</IonLabel>
					</IonItem>
					<IonItem button>
						<IonLabel>Media, Links, and Docs</IonLabel>
					</IonItem>
					<IonItem button>
						<IonLabel>Privacy & Support</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
		</IonMenu>
	);
};

export default ChatMenu;
