// src/store/useRoomStore.ts
import { createWithEqualityFn as create } from "zustand/traditional";
import { RoomCS } from "../../types/roomcs";
import { Message, LastMessage } from "../../types/chat";

// src/store/useRoomStore.ts
interface RoomStore {
	rooms: Record<string, RoomCS>;
	addRoom: (room: RoomCS) => void;
	addRooms: (rooms: RoomCS[]) => void; // New function to add multiple rooms
	addMessageToRoom: (roomId: string, messageId: string, message: Message) => void;
	updateLastMessage: (roomId: string, lastMessage: LastMessage) => void;
	clearRoomMessages: (roomId: string) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
	rooms: {},

	addRoom: (newRoom: RoomCS) =>
		set((state) => ({
			rooms: {
				...state.rooms,
				[newRoom.id]: newRoom
			}
		})),

	// New action to add multiple rooms at once
	addRooms: (rooms: RoomCS[]) =>
		set((state) => {
			const newRooms = rooms.reduce(
				(acc, room) => {
					acc[room.id] = room;
					return acc;
				},
				{} as Record<string, RoomCS>
			);

			return {
				rooms: {
					...state.rooms,
					...newRooms
				}
			};
		}),

	addMessageToRoom: (roomId: string, messageId: string, message: Message) =>
		set((state) => {
			const room = state.rooms[roomId];
			if (!room) {
				console.error(`Room with ID ${roomId} not found.`);
				return state;
			}

			const updatedRoom = {
				...room,
				messages: {
					...room.messages,
					[messageId]: message
				}
			};

			return {
				rooms: {
					...state.rooms,
					[roomId]: updatedRoom
				}
			};
		}),

	updateLastMessage: (roomId: string, lastMessage: LastMessage) =>
		set((state) => {
			const room = state.rooms[roomId];
			if (!room) {
				console.error(`Room with ID ${roomId} not found.`);
				return state;
			}

			const updatedRoom = {
				...room,
				last_message: lastMessage
			};

			return {
				rooms: {
					...state.rooms,
					[roomId]: updatedRoom
				}
			};
		}),

	clearRoomMessages: (roomId: string) =>
		set((state) => {
			const room = state.rooms[roomId];
			if (!room) {
				console.error(`Room with ID ${roomId} not found.`);
				return state;
			}

			// Clear the messages in the room, but keep the room in the store
			const updatedRoom = {
				...room,
				messages: {} // Clear the messages
			};

			return {
				rooms: {
					...state.rooms,
					[roomId]: updatedRoom
				}
			};
		})
}));
