import useSWR from "swr";
import taxios from "@/util/token_refresh_hook";
import { HttpResponse } from "@ptypes/http_response";
import { Room } from "../../types/room"; // Import the Room type
import { RoomCS } from "../../types/roomcs"; // Import the RoomCS type

const api = import.meta.env.VITE_API_URL;

const fetcher = async (url: string) => {
	const response = await taxios.get(url);

	const roomsArray: Room[] = (response.data.payloads as Room[]) || [];

	// Transform Room data into RoomCS and convert it into an object with room IDs as keys
	const roomsObject = roomsArray.reduce<Record<string, RoomCS>>((acc, room) => {
		acc[room.id] = {
			...room,
			messages: {}, // Initialize messages as an empty object
			last_message: {} as RoomCS["last_message"] // Initialize an empty last_message
		};
		return acc;
	}, {});

	return roomsObject; // Return rooms as an object (Record<string, RoomCS>)
};

export const useRoomList = () => {
	const { data, error, isLoading } = useSWR(`${api}/chat/room/list`, fetcher, {
		revalidateOnFocus: false // Adjust revalidation based on your needs
	});

	return {
		rooms: data || {}, // Default to an empty object if data is undefined
		isLoading,
		error
	};
};
