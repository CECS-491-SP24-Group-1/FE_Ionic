import React, { useState } from "react";
import axios from "axios";

const CreateChatRoom = () => {
	const [roomName, setRoomName] = useState(""); // Room name is optional in your backend, but you can still keep it
	const [participants, setParticipants] = useState(""); // Comma-separated participant UUIDs
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		// Split participant string into an array of UUIDs (by comma)
		const participantArray = participants.split(",").map((p) => p.trim());

		try {
			// Make the API call to create the chat room with participants
			const response = await axios.post("/api/chat/room/create", {
				participants: participantArray
			});

			setSuccess("Chat room created successfully!");
			setRoomName(""); // Optionally clear the input field
			setParticipants(""); // Clear the participant input field
			console.log("Response:", response.data);

			// You can add logic here to update the UI, like showing the new chat room in a list
		} catch (err) {
			setError("Failed to create chat room. Please try again.");
			console.error("Error creating chat room:", err);
		}
	};

	return (
		<div>
			<h2>Create a New Chat Room</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
			{success && <p style={{ color: "green" }}>{success}</p>}

			<form onSubmit={handleSubmit}>
				<label htmlFor="chatRoomName">Chat Room Name (optional):</label>
				<input
					id="chatRoomName"
					type="text"
					value={roomName}
					onChange={(e) => setRoomName(e.target.value)}
				/>

				<label htmlFor="participants">Add Participants (comma-separated UUIDs):</label>
				<input
					id="participants"
					type="text"
					value={participants}
					onChange={(e) => setParticipants(e.target.value)}
					required
				/>

				<button type="submit">Create Chat Room</button>
			</form>
		</div>
	);
};

export default CreateChatRoom;
