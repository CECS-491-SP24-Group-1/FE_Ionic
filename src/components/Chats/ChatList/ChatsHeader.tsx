import React, { useState } from "react";
import { IonLabel, IonIcon } from "@ionic/react";
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

			{/* Conditionally render the CreateChatRoom component */}
			{showModal && <CreateChatRoom onRoomCreated={handleCloseModal} />}
		</div>
	);
};

export default ChatsHeader;
