// import React, { useState } from "react";
// import { IonInput, IonButton, IonIcon, IonToolbar, IonFooter } from "@ionic/react";
// import { send, attach, mic } from "ionicons/icons";

// interface ChatInputProps {
// 	onSendMessage: (message: string) => void;
// }

// const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
// 	const [message, setMessage] = useState("");

// 	const handleSendMessage = () => {
// 		if (message.trim()) {
// 			onSendMessage(message);
// 			setMessage(""); // Clear the input field after sending
// 		}
// 	};

// 	return (
// 		<IonFooter className="sticky bottom-0 flex-shrink-0 bg-white dark:bg-gray-800">
// 			<IonToolbar className="flex items-center">
// 				<IonInput
// 					value={message}
// 					placeholder="Write a message..."
// 					onIonChange={(e: CustomEvent) => setMessage(e.detail.value!)}
// 					className="flex-grow ml-5 pr-2 text-left"
// 				/>
// 				<IonButton
// 					onClick={handleSendMessage}
// 					slot="end"
// 					fill="clear"
// 					className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">
// 					<IonIcon icon={send} />
// 				</IonButton>
// 				<IonButton
// 					slot="end"
// 					fill="clear"
// 					className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">
// 					<IonIcon icon={mic} />
// 				</IonButton>
// 				<IonButton
// 					slot="end"
// 					fill="clear"
// 					className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">
// 					<IonIcon icon={attach} />
// 				</IonButton>
// 			</IonToolbar>
// 		</IonFooter>
// 	);
// };

// export default ChatInput;
