import React, { useEffect, useRef } from "react";
import { Message } from "@ptypes/chat";
import { uuidv72Date } from "@/util/uuid";
import useVaultStore from "@/stores/vault_store";

interface ChatMessagesProps {
	messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
	// Reference to the messages container
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	// Reference to scroll to the end of the messages
	const messagesEndRef = useRef<HTMLDivElement>(null);

	//Vault state
	const { myID } = useVaultStore((state) => ({
		myID: state.myID
	}));

	// Scroll to the bottom of the messages container when the messages change,
	// but only if the content height exceeds the container height.
	useEffect(() => {
		if (messagesContainerRef.current && messagesEndRef.current) {
			const container = messagesContainerRef.current;
			const shouldScroll = container.scrollHeight > container.clientHeight;

			if (shouldScroll) {
				messagesEndRef.current.scrollIntoView();
			}
		}
	}, [messages]);

	return (
		<div
			ref={messagesContainerRef}
			className="chat-messages bg-primary dark:bg-primary-light p-4 overflow-y-auto h-full">
			{messages.map((msg) => (
				<div
					key={msg.id}
					className={`chat-bubble px-4 py-2 rounded-lg max-w-xs break-words mb-2 ${
						msg.sender_id === myID
							? "bg-accent text-white self-end from-me"
							: "bg-secondary-light text-textPrimary dark:bg-secondary dark:text-textPrimary-light self-start from-them"
					}`}>
					<p className="text-sm">{msg.content}</p>
					<span className="text-xs text-muted dark:text-muted-light">
						{uuidv72Date(msg.id).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit"
						})}
					</span>
				</div>
			))}
			{/* Dummy div to ensure scroll to bottom */}
			<div ref={messagesEndRef} />
		</div>
	);
};

export default ChatMessages;
