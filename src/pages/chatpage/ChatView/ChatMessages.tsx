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
			className="chat-messages overflow-auto max-h-screen p-4">
			{messages.map((msg) => (
				<div
					key={msg.id}
					className={`chat-bubble ${
						msg.sender_id === myID
							? "bg-[#4b8fea] text-white ml-auto rounded-l-2xl rounded-tr-2xl"
							: "bg-gray-200 text-black mr-auto rounded-r-2xl rounded-tl-2xl"
					} w-fit max-w-xs p-3 my-3 break-words`}>
					<p>{msg.content}</p>
					<span className="block text-xs text-right mt-1">
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
