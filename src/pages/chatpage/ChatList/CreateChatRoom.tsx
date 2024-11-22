import React, { useState } from "react";
import taxios from "../../../util/token_refresh_hook";
import useVaultStore from "../../../stores/vault_store";
import { IonModal } from "@ionic/react";
import { useRoomStore } from "../../../stores/room_store";
import { FaTimes } from "react-icons/fa";

interface CreateChatRoomProps {
	onRoomCreated?: () => void;
}

const CreateChatRoom: React.FC<CreateChatRoomProps> = ({ onRoomCreated }) => {
	const [roomName, setRoomName] = useState("");
	const [participants, setParticipants] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const addChatRoom = useVaultStore((state) => state.addChatRoom);
	const addRoom = useRoomStore((state) => state.addRoom);
	const api = import.meta.env.VITE_API_URL;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		const participantsArray = participants.split(",").map((p) => p.trim());

		try {
			const response = await taxios.post(`${api}/chat/room/create`, {
				participants: participantsArray
			});

			const newRoom = response.data.payloads[0];

			addRoom({
				id: newRoom.id,
				created_at: newRoom.created_at,
				updated_at: newRoom.updated_at,
				participants: newRoom.participants,
				messages: {},
				last_message: {
					content: "",
					sender: "",
					timestamp: new Date().toISOString()
				}
			});

			setSuccess("Chat room created successfully!");
			setRoomName("");
			setParticipants("");
		} catch (error) {
			setError("Failed to create chat room. Please try again.");
			console.error("Error creating chat room:", error);
		}
	};

	return (
		<IonModal isOpen={true} onDidDismiss={onRoomCreated}>
			<div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-100">
				<div className="relative w-11/12 max-w-lg rounded-lg bg-white p-6 text-center dark:bg-gray-800">
					<FaTimes
						onClick={onRoomCreated}
						className="absolute right-4 top-4 cursor-pointer text-xl text-gray-700 dark:text-gray-200"
					/>
					<h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
						Create New Chat Room
					</h2>
					{error && <p className="mb-4 text-sm text-red-500">{error}</p>}
					{success && <p className="mb-4 text-sm text-green-500">{success}</p>}
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="text-left">
							<label
								htmlFor="participants"
								className="block text-sm font-medium text-gray-700 dark:text-gray-200">
								Participants (comma-separated UUIDs):
							</label>
							<input
								id="participants"
								type="text"
								value={participants}
								onChange={(e) => setParticipants(e.target.value)}
								required
								className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-700 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 sm:text-sm"
							/>
						</div>
						<div className="text-left">
							<label
								htmlFor="roomName"
								className="block text-sm font-medium text-gray-700 dark:text-gray-200">
								Chat Room Name:
							</label>
							<input
								id="roomName"
								type="text"
								value={roomName}
								onChange={(e) => setRoomName(e.target.value)}
								required
								className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-700 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 sm:text-sm"
							/>
						</div>
						<button
							type="submit"
							className="w-full rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:ring-offset-gray-900">
							Create Chat Room
						</button>
					</form>
				</div>
			</div>
		</IonModal>
	);
};

export default CreateChatRoom;
