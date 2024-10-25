import React, { useState } from "react";
import taxios from "../../util/token_refresh_hook";
import useVaultStore from "../../stores/vault_store";
import { useHistory } from "react-router-dom";
import { useRoomStore } from "../../stores/room_store";
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
	const history = useHistory();
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
		<div style={styles.modalOverlay}>
			<div style={styles.modalContent}>
				<FaTimes style={styles.closeIcon} onClick={onRoomCreated} />
				<h2 style={styles.header}>Create New Chat Room</h2>
				{error && <p style={styles.errorText}>{error}</p>}
				{success && <p style={styles.successText}>{success}</p>}
				<form onSubmit={handleSubmit} style={styles.form}>
					<label htmlFor="participants" style={styles.label}>
						Participants (comma-separated UUIDs):
					</label>
					<input
						id="participants"
						type="text"
						value={participants}
						onChange={(e) => setParticipants(e.target.value)}
						required
						style={styles.input}
					/>

					<label htmlFor="roomName" style={styles.label}>
						Chat Room Name:
					</label>
					<input
						id="roomName"
						type="text"
						value={roomName}
						onChange={(e) => setRoomName(e.target.value)}
						required
						style={styles.input}
					/>

					<button type="submit" style={styles.button}>
						Create Chat Room
					</button>
				</form>
			</div>
		</div>
	);
};

const styles = {
	modalOverlay: {
		position: "fixed" as "fixed",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1000
	},

	modalContent: {
		backgroundColor: "#fff",
		padding: "2rem",
		borderRadius: "8px",
		width: "90%",
		maxWidth: "500px",
		boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)", // Subtle shadow
		position: "relative" as "relative",
		textAlign: "center" as "center",
		border: "none"
	},
	header: {
		fontSize: "1.5rem",
		marginBottom: "1rem",
		color: "#333"
	},
	form: {
		display: "flex",
		flexDirection: "column" as "column",
		gap: "1rem"
	},
	label: {
		fontSize: "0.9rem",
		color: "#555",
		marginBottom: "0.3rem",
		textAlign: "left" as "left"
	},
	input: {
		padding: "0.8rem",
		fontSize: "1rem",
		borderRadius: "4px",
		border: "1px solid #ccc",
		width: "100%",
		boxSizing: "border-box" as "border-box",
		backgroundColor: "#fff",
		color: "#333"
	},
	button: {
		padding: "0.8rem",
		fontSize: "1rem",
		borderRadius: "4px",
		border: "none",
		backgroundColor: "#4CAF50",
		color: "#fff",
		cursor: "pointer",
		transition: "background-color 0.3s ease"
	},
	errorText: {
		color: "red",
		marginBottom: "1rem",
		fontSize: "0.9rem"
	},
	successText: {
		color: "green",
		marginBottom: "1rem",
		fontSize: "0.9rem"
	},
	closeIcon: {
		position: "absolute" as "absolute",
		top: "15px",
		right: "15px",
		fontSize: "1.5rem",
		cursor: "pointer",
		color: "#333"
	}
};

export default CreateChatRoom;
