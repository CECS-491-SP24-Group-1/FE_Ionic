// src/hooks/useRoomList.ts
import useSWR from "swr";
import taxios from "@/util/token_refresh_hook";
import { Room } from "../../types/room";
import { RoomCS } from "../../types/roomcs";
import { useRoomStore } from "@/stores/room_store";

const api = import.meta.env.VITE_API_URL;

const fetcher = async (url: string) => {
	const response = await taxios.get(url);
	const roomsArray: Room[] = (response.data.payloads as Room[]) || [];

	// Transform Room data into RoomCS
	const roomsObject = roomsArray.reduce<Record<string, RoomCS>>((acc, room) => {
		acc[room.id] = {
			...room,
			messages: {}, // Initialize messages as an empty object
			last_message: {} as RoomCS["last_message"] // Initialize an empty last_message
		};
		return acc;
	}, {});

	return roomsObject; // Return rooms as an object
};

export const useRoomList = () => {
	const addRooms = useRoomStore((state) => state.addRooms); // Get addRooms from Zustand

	const { data, error, isLoading } = useSWR(`${api}/chat/room/list`, fetcher, {
		revalidateOnFocus: false,
		onSuccess: (data) => {
			addRooms(Object.values(data)); // Update Zustand store with the fetched rooms
		}
	});

	return {
		rooms: data,
		isLoading,
		error
	};
};
