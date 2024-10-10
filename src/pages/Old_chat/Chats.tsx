import React, { useState } from "react";
import {
	IonContent,
	IonHeader,
	IonPage,
	IonToolbar,
	IonTitle,
	IonList,
	IonItem,
	IonLabel,
	IonAvatar,
	IonMenu,
	IonInput,
	IonButton,
	IonFooter,
	IonIcon,
	IonSearchbar,
	IonBadge,
	IonMenuToggle
} from "@ionic/react";

import { menuController } from "@ionic/core";

import {
	camera,
	mic,
	attach,
	chatbubbles,
	addCircle,
	call,
	videocam,
	informationCircle
} from "ionicons/icons";

import "./Chats.scss"; // Ensure this contains the necessary styles

const ChatPage: React.FC = () => {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([
		{ from: "Me", text: "Hey, Mariana", time: "10:45 AM" },
		{ from: "Me", text: "Sure, just give me a call!", time: "10:46 AM" }
	]);

	const handleSendMessage = () => {
		if (message.trim()) {
			setMessages([...messages, { from: "Me", text: message, time: "Now" }]);
			setMessage(""); // clear input
		}
	};
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = async () => {
		await menuController.toggle(); // This will toggle the menu (open if closed, and close if open)
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>Wraith</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent id="main-content">
				{" "}
				{/* Add ID here */}
				<div className="chat-container">
					{/* Sidebar */}
					<div className="chat-list">
						{/* Chats title and New Chat Icon */}
						<div className="chats-header">
							<div className="chats-title">
								<IonLabel>Chats</IonLabel>
								<IonIcon icon={addCircle} size="large" className="new-chat-icon" />
							</div>
							{/* Search Bar */}
							<IonSearchbar placeholder="Search" />
						</div>

						{/* List of chats */}
						<IonList>
							<IonItem>
								<IonAvatar slot="start">
									<img src="https://i.pravatar.cc/300?u=claudia" alt="Claudia" />
								</IonAvatar>
								<IonLabel>
									<h2>Claudia Alves</h2>
									<p>3 New Messages</p>
								</IonLabel>
								<IonBadge color="success" slot="end">
									3m ago
								</IonBadge>
							</IonItem>

							<IonItem>
								<IonAvatar slot="start">
									<img src="https://i.pravatar.cc/300?u=teamchat" alt="Team Chat" />
								</IonAvatar>
								<IonLabel>
									<h2>Team Chat</h2>
									<p>New Message</p>
								</IonLabel>
								<IonBadge color="success" slot="end">
									5m ago
								</IonBadge>
							</IonItem>
						</IonList>
					</div>

					{/* Chat view */}
					<div className="chat-view">
						<div className="chat-header">
							<IonItem lines="none" className="user-chat-bar">
								<IonAvatar slot="start">
									<img src="https://i.pravatar.cc/300?u=mariana" alt="Mariana" />
								</IonAvatar>
								<IonLabel>
									<h2>Mariana Napolitani</h2>
									<p>Click here for contact information</p>
								</IonLabel>

								<div className="chat-header-icons">
									<IonButton fill="clear">
										<IonIcon icon={call} className="icon-button" />
									</IonButton>
									<IonButton fill="clear">
										<IonIcon icon={videocam} className="icon-button" />
									</IonButton>
									<IonMenuToggle>
										<IonButton fill="clear" onClick={toggleMenu}>
											<IonIcon icon={informationCircle} className="icon-button" />
										</IonButton>
									</IonMenuToggle>
								</div>
							</IonItem>
						</div>

						<div className="chat-messages">
							{messages.map((msg, index) => (
								<div
									key={index}
									className={`chat-bubble ${msg.from === "Me" ? "from-me" : "from-them"}`}>
									<p>{msg.text}</p>
									<span>{msg.time}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</IonContent>

			{/* Input area (moved outside of chat-view) */}
			<IonFooter className="chat-input">
				<IonToolbar>
					<IonInput
						value={message}
						placeholder="Write your message here"
						onIonChange={(e: CustomEvent) => setMessage(e.detail.value!)}
					/>
					<IonButton onClick={handleSendMessage} slot="end" fill="clear">
						<IonIcon icon={camera} />
					</IonButton>
					<IonButton onClick={handleSendMessage} slot="end" fill="clear">
						<IonIcon icon={mic} />
					</IonButton>
					<IonButton onClick={handleSendMessage} slot="end" fill="clear">
						<IonIcon icon={attach} />
					</IonButton>
				</IonToolbar>
			</IonFooter>

			{/* Menu for the right side panel */}
			<IonMenu side="end" contentId="main-content">
				<IonHeader>
					<IonToolbar>
						<IonTitle>Chat Information</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonList>
						<IonItem>
							<IonAvatar slot="start">
								<img src="https://i.pravatar.cc/300" alt="User" />
							</IonAvatar>
							<IonLabel>
								<h2>Marina Napolitani</h2>
								<p>Active 3h ago</p>
							</IonLabel>
						</IonItem>
						<IonItem>
							<IonLabel>Profile</IonLabel>
						</IonItem>
						<IonItem>
							<IonLabel>Mute</IonLabel>
						</IonItem>
						<IonItem>
							<IonLabel>Search</IonLabel>
						</IonItem>
						<IonItem>
							<IonLabel>Customize Chat</IonLabel>
						</IonItem>
						<IonItem>
							<IonLabel>Media, Files, and Links</IonLabel>
						</IonItem>
						<IonItem>
							<IonLabel>Privacy & Support</IonLabel>
						</IonItem>
					</IonList>
				</IonContent>
			</IonMenu>
		</IonPage>
	);
};

export default ChatPage;
