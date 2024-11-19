// import React from "react";
// import { IonItem, IonAvatar, IonLabel, IonBadge } from "@ionic/react";

// interface ChatItemProps {
// 	avatarUrl: string;
// 	name: string;
// 	message: string;
// 	time: string;
// }

// const ChatItem: React.FC<ChatItemProps> = ({ avatarUrl, name, message, time }) => {
// 	return (
// 		<IonItem className="bg-backgroundHighlight dark:bg-backgroundHighlight-light text-textPrimary dark:text-textPrimary-light rounded-lg">
// 			<IonAvatar slot="start" className="rounded-full">
// 				<img src={avatarUrl} alt={name} />
// 			</IonAvatar>
// 			<IonLabel className="text-textPrimary dark:text-textPrimary-light">
// 				<h2 className="font-semibold text-base">{name}</h2>
// 				<p className="text-textSecondary dark:text-textSecondary-light text-sm">
// 					{message}
// 				</p>
// 			</IonLabel>
// 			<IonBadge
// 				color="success"
// 				slot="end"
// 				className="bg-accent dark:bg-accent-light text-white text-xs font-medium">
// 				{time}
// 			</IonBadge>
// 		</IonItem>
// 	);
// };

// export default ChatItem;
