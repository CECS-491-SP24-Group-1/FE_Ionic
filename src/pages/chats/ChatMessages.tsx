import React, { useEffect, useRef } from "react";
import { Message } from "@ptypes/chat";
import { uuidv72Date } from "@/util/uuid";
import useVaultStore from "@/stores/vault_store";

interface ChatMessagesProps {
	messages: Message[]; // Update to use the Message type
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
		<div ref={messagesContainerRef} className="chat-messages">
			{messages.map((msg) => (
				<div
					key={msg.id}
					className={`chat-bubble ${msg.sender_id === myID ? "from-me" : "from-them"}`}>
					<p>{msg.content}</p>
					<span>{uuidv72Date(msg.id).toLocaleTimeString()}</span>
				</div>
			))}
			{/* Dummy div to ensure scroll to bottom */}
			<div ref={messagesEndRef} />
		</div>
	);
};

export default ChatMessages;
