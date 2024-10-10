// src/data/ChatMessagesData.tsx

import React from "react";

// Define the interface for a single message
export interface Message {
	to: string;
	from: string;
	text: string;
	time: string;
}

// Define the chat message data with chatId as keys
export const chatMessagesData: { [key: number]: Message[] } = {
	1: [
		{ to: "Mariana", from: "Me", text: "Hey, Mariana", time: "10:45 AM" },
		{ to: "Me", from: "Mariana", text: "Hi! How are you?", time: "10:46 AM" },
		{ to: "Mariana", from: "Me", text: "I’m good! What about you?", time: "10:47 AM" },
		{
			to: "Me",
			from: "Mariana",
			text: "Doing well, just busy with work.",
			time: "10:48 AM"
		}
	],
	2: [
		{ to: "Me", from: "Claudia", text: "Can we meet up tomorrow?", time: "10:30 AM" },
		{ to: "Claudia", from: "Me", text: "Sure! Let’s meet around noon.", time: "10:32 AM" }
	],
	3: [
		{
			to: "Team",
			from: "Me",
			text: "Don’t forget about the project meeting at 3 PM.",
			time: "08:45 AM"
		},
		{ to: "Me", from: "Team", text: "Got it. See you there!", time: "08:50 AM" }
	]
};

// Exporting a React component (for testing purpose, could be removed if not needed)
const ChatMessagesData: React.FC = () => {
	return (
		<div>
			{Object.entries(chatMessagesData).map(([chatId, messages]) => (
				<div key={chatId}>
					<h3>Chat ID: {chatId}</h3>
					{messages.map((message, index) => (
						<div key={index}>
							<strong>{message.from}:</strong> {message.text} <em>{message.time}</em>
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default ChatMessagesData;
