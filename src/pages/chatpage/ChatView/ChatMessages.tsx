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

	// Vault state
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
			className="chat-messages max-h-screen overflow-auto p-4">
			{messages.map((msg) => (
				<div key={msg.id} className="message-container my-3">
					{/* Chat bubble */}
					<div
						className={`chat-bubble ${
							msg.sender_id === myID
								? "ml-auto bg-[#4b8fea] text-white"
								: "mr-auto bg-gray-200 text-black"
						} w-fit max-w-xs break-words rounded-2xl p-3`}>
						<p>{msg.content}</p>
					</div>
					{/* Message part (outside the bubble) */}
					<span
						className={`mt-1 block text-xs text-gray-500 ${
							msg.sender_id === myID ? "text-right" : "text-left"
						}`}>
						{/* Replace with `uuidv72Date` function when necessary */}
						msg
					</span>
				</div>
			))}
			{/* Dummy div to ensure scroll to bottom */}
			<div ref={messagesEndRef} />
		</div>
	);
};

export default ChatMessages;
