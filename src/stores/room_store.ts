// src/store/useRoomStore.ts
import { createWithEqualityFn as create } from "zustand/traditional";
import { RoomCS } from "../../types/roomcs";
import { Message, LastMessage } from "../../types/chat";

// Define Zustand store for RoomCS
interface RoomStore {
	rooms: Record<string, RoomCS>; // A map of chat rooms (UUID as keys)
	addRoom: (room: RoomCS) => void; // Action to add a new room
	addMessageToRoom: (roomId: string, messageId: string, message: Message) => void; // Action to add a message to a room
	updateLastMessage: (roomId: string, lastMessage: LastMessage) => void; // Action to update the last message of a room
}

export const useRoomStore = create<RoomStore>((set) => ({
	rooms: {}, // Initialize rooms as an empty map

	// Action to add a new room
	addRoom: (newRoom: RoomCS) =>
		set((state) => ({
			rooms: {
				...state.rooms,
				[newRoom.id]: newRoom // Use the room UUID as the key
			}
		})),

	// Action to add a message to a specific room
	addMessageToRoom: (roomId: string, messageId: string, message: Message) =>
		set((state) => {
			const room = state.rooms[roomId];
			if (room) {
				room.messages[messageId] = message;
				return {
					rooms: {
						...state.rooms,
						[roomId]: { ...room } // Update the room with the new message
					}
				};
			}
			return state;
		}),

	// Action to update the last message in a room
	updateLastMessage: (roomId: string, lastMessage: LastMessage) =>
		set((state) => {
			const room = state.rooms[roomId];
			if (room) {
				return {
					rooms: {
						...state.rooms,
						[roomId]: { ...room, last_message: lastMessage } // Update the last message
					}
				};
			}
			return state;
		})
}));
