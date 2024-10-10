import React from "react";
import { IonItem, IonAvatar, IonLabel, IonBadge } from "@ionic/react";

interface ChatItemProps {
	avatarUrl: string;
	name: string;
	message: string;
	time: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ avatarUrl, name, message, time }) => {
	return (
		<IonItem>
			<IonAvatar slot="start">
				<img src={avatarUrl} alt={name} />
			</IonAvatar>
			<IonLabel>
				<h2>{name}</h2>
				<p>{message}</p>
			</IonLabel>
			<IonBadge color="success" slot="end">
				{time}
			</IonBadge>
		</IonItem>
	);
};

export default ChatItem;
