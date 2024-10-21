/**
 * I took the chatInput fragment from here and moved it over to the
 * main Chats.tsx page. The separate file was not as easy for me to comprehend
 * when working on the echo websocketing. I left this file here in case we want
 * to go back to using it this way. -Michael K.
 */
import React, { useState } from "react";
import { IonInput, IonButton, IonIcon, IonToolbar, IonFooter } from "@ionic/react";
import { send, attach, mic } from "ionicons/icons";

interface ChatInputProps {
	onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
	const [message, setMessage] = useState("");

	const handleSendMessage = () => {
		if (message.trim()) {
			onSendMessage(message);
			setMessage(""); // Clear the input field after sending
		}
	};

	return (
		<IonFooter className="chat-input">
			<IonToolbar>
				<IonInput
					value={message}
					placeholder="Write a message..."
					onIonChange={(e: CustomEvent) => setMessage(e.detail.value!)}
				/>
				<IonButton onClick={handleSendMessage} slot="end" fill="clear">
					<IonIcon icon={send} />
				</IonButton>
				<IonButton slot="end" fill="clear">
					<IonIcon icon={mic} />
				</IonButton>
				<IonButton slot="end" fill="clear">
					<IonIcon icon={attach} />
				</IonButton>
			</IonToolbar>
		</IonFooter>
	);
};

export default ChatInput;
