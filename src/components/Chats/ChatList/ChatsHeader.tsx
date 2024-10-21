import React, { useState } from "react";
import {
	IonLabel,
	IonIcon,
	IonModal,
	IonButton,
	IonInput,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	InputCustomEvent
} from "@ionic/react";
import { addCircle } from "ionicons/icons";
import taxios from "@/util/token_refresh_hook";

const ChatsHeader: React.FC = () => {
	const [showModal, setShowModal] = useState(false);
	const [participants, setParticipants] = useState(""); // String to hold comma-separated UUIDs
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const api = import.meta.env.VITE_API_URL;

	// Handle the chat room creation
	const handleCreateChatRoom = async () => {
		setError("");
		setSuccess("");

		// Convert the participants string into an array of UUIDs (trimming whitespace)
		const participantsArray = participants.split(",").map((p) => p.trim());

		try {
			// Make the API request to create the chat room
			const response = await taxios.post(`${api}/chat/room/create`, {
				participants: participantsArray
			});

			// Handle successful response
			setSuccess("Chat room created successfully!");
			setParticipants(""); // Clear the input fields after success
			setShowModal(false); // Close the modal
		} catch (err) {
			// Handle error response
			setError("Failed to create chat room. Please try again.");
			console.error("Error creating chat room:", err);
		}
	};

	return (
		<div className="chats-header">
			<div className="chats-title">
				<IonLabel>Chats</IonLabel>
				<IonIcon
					icon={addCircle}
					size="large"
					className="new-chat-icon"
					onClick={() => setShowModal(true)} // Open modal on icon click
				/>
			</div>

			{/* Modal to create a new chat room */}
			<IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
				<IonHeader>
					<IonToolbar>
						<IonTitle>Create a New Chat Room</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<div className="modal-content">
						{/* Display error or success messages */}
						{error && <p style={{ color: "red" }}>{error}</p>}
						{success && <p style={{ color: "green" }}>{success}</p>}

						{/* Participants input */}
						<div>
							<IonLabel>Participants (comma-separated UUIDs):</IonLabel>
							<IonInput
								value={participants}
								placeholder="Enter participant UUIDs"
								onIonChange={(e: InputCustomEvent) => setParticipants(e.detail.value!)}
								required
							/>
						</div>

						{/* Submit button */}
						<IonButton expand="full" onClick={handleCreateChatRoom}>
							Create Chat Room
						</IonButton>

						{/* Cancel button */}
						<IonButton expand="full" color="light" onClick={() => setShowModal(false)}>
							Cancel
						</IonButton>
					</div>
				</IonContent>
			</IonModal>
		</div>
	);
};

export default ChatsHeader;
