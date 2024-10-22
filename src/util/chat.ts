import { Message } from "@ptypes/chat";
import { uuidv7 } from "uuidv7";

/**
 * Constructs a new chat message.
 * @param content The content of the chat message to send
 * @param sid The sender's ID
 * @param rid The recipient's ID; set as the ID of the chat room if it's for everyone
 * @return The created chat message
 */
export function newChat(content: string, sid: string, rid: string): Message {
	return {
		id: uuidv7(),
		type: "U_MSG",
		sender_id: sid,
		recipient_id: rid,
		content: content
	};
}
