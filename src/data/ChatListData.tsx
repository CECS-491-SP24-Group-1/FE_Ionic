// src/data/ChatListData.tsx

import React from "react";

// Define the interface for a single chat list item
export interface ChatListItem {
	id: string;
	name: string;
	avatar: string;
	lastMessage: string;
	time: string;
}

// Export the chat list data
export const chatList: ChatListItem[] = [
	{
		id: "0192b5ba-4227-78db-96f7-8fe08f0fcaa9",
		name: "Mariana Napolitani",
		avatar: "https://i.pravatar.cc/300?u=mariana",
		lastMessage: "Hey, how’s it going?",
		time: "10:45 AM"
	},
	{
		id: "0192b5c9-5f17-7d72-9097-1e58410a70a2",
		name: "Claudia Alves",
		avatar: "https://i.pravatar.cc/300?u=claudia",
		lastMessage: "Let’s meet up tomorrow.",
		time: "11:15 AM"
	},
	{
		id: "0192b5c9-7a15-71d6-8804-0f95f4661686",
		name: "Team Chat",
		avatar: "https://i.pravatar.cc/300?u=teamchat",
		lastMessage: "Project meeting at 3 PM",
		time: "09:30 AM"
	}
];

// Exporting a React component (for testing purpose, could be removed if not needed)
const ChatListData: React.FC = () => {
	return (
		<div>
			{chatList.map((chat) => (
				<div key={chat.id}>
					<img src={chat.avatar} alt={chat.name} />
					<h3>{chat.name}</h3>
					<p>
						{chat.lastMessage} - {chat.time}
					</p>
				</div>
			))}
		</div>
	);
};

export default ChatListData;
