import React, { useState, useMemo } from "react";
import { IonModal } from "@ionic/react";
import { FaTimes } from "react-icons/fa";
import { BeamVisualization } from "./BeamVisualization";

interface CreateChatRoomProps {
	onRoomCreated?: () => void;
}

const CreateChatRoom: React.FC<CreateChatRoomProps> = ({ onRoomCreated }) => {
	const [participants, setParticipants] = useState<string>(""); // Comma-separated UUIDs
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Memoize parsed participants to avoid unnecessary re-renders
	const parsedParticipants = useMemo(
		() =>
			participants
				.split(",")
				.map((p) => p.trim())
				.filter((p) => p.length > 0), // Filter out empty strings
		[participants]
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (parsedParticipants.length === 0) {
			setError("Please provide at least one participant.");
			return;
		}

		// Handle the chat room creation logic (e.g., API call)
		setSuccess("Chat room created successfully!");
	};

	return (
		<IonModal isOpen={true} onDidDismiss={onRoomCreated}>
			<div className="relative min-h-full min-w-full rounded-lg bg-white p-6 text-center dark:bg-gray-800">
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
					<button
						type="submit"
						className="w-full rounded-md bg-accent px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:ring-offset-gray-900">
						Create Chat Room
					</button>
				</form>

				<BeamVisualization uuidCount={parsedParticipants.length} />
			</div>
		</IonModal>
	);
};

export default CreateChatRoom;
