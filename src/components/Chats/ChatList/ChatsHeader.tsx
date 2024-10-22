import React, { useState } from "react";
import { IonLabel, IonIcon, IonModal, IonButton } from "@ionic/react";
import { addCircle } from "ionicons/icons";
import CreateChatRoom from "../CreateChatRoom";

const ChatsHeader: React.FC = () => {
	const [showModal, setShowModal] = useState(false); // State to control the modal visibility

	const handleOpenModal = () => {
		setShowModal(true); // Open the modal
	};

	const handleCloseModal = () => {
		setShowModal(false); // Close the modal
	};

	return (
		<div className="chats-header">
			<div className="chats-title">
				<IonLabel>Chats</IonLabel>
				<IonIcon
					icon={addCircle}
					size="large"
					className="new-chat-icon"
					onClick={handleOpenModal}
				/>
			</div>

			{/* Modal for creating a new chat room */}
			<IonModal isOpen={showModal} onDidDismiss={handleCloseModal}>
				<div className="modal-content">
					<h2>Create a New Chat Room</h2>
					{/* Render the CreateChatRoom component within the modal */}
					<CreateChatRoom onRoomCreated={handleCloseModal} />
					<IonButton onClick={handleCloseModal}>Close</IonButton>
				</div>
			</IonModal>
		</div>
	);
};

export default ChatsHeader;
