import { Message } from "./chat";
import { Room } from "./room";

export interface RoomCS extends Room {
	messages: { [mid: string]: Message };
	last_message: LastMessage;
}
