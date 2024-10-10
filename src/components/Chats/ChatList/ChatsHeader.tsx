import React from "react";
import { IonLabel, IonIcon } from "@ionic/react";
import { addCircle } from "ionicons/icons";

const ChatsHeader: React.FC = () => {
	return (
		<div className="chats-header">
			<div className="chats-title">
				<IonLabel>Chats</IonLabel>
				<IonIcon icon={addCircle} size="large" className="new-chat-icon" />
			</div>
		</div>
	);
};

export default ChatsHeader;
