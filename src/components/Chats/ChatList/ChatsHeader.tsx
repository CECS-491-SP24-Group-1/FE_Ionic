import React, { useState } from "react";
import { IonLabel, IonIcon, IonModal, IonButton, IonInput } from "@ionic/react";
import { addCircle, search } from "ionicons/icons"; // Add search icon
import CreateChatRoom from "../CreateChatRoom";

interface ChatsHeaderProps {
	onSearch: (searchQuery: string) => void; // Pass the search query to parent component
}

const ChatsHeader: React.FC<ChatsHeaderProps> = ({ onSearch }) => {
	const [showModal, setShowModal] = useState(false); // State to control the modal visibility
	const [searchQuery, setSearchQuery] = useState(""); // State to handle search query

	const handleOpenModal = () => {
		setShowModal(true); // Open the modal
	};

	const handleCloseModal = () => {
		setShowModal(false); // Close the modal
	};

	// Handle search input change
	const handleSearchChange = (e: CustomEvent) => {
		const query = e.detail.value!;
		setSearchQuery(query);
		onSearch(query); // Pass search query to parent for filtering
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

			{/* Search bar */}
			<div className="chat-search-bar">
				<IonIcon icon={search} className="search-icon" />
				<IonInput
					value={searchQuery}
					placeholder="Search Messenger"
					onIonChange={handleSearchChange}
					className="chat-search-input"
				/>
			</div>

			{/* Modal for creating a new chat room */}
			<IonModal isOpen={showModal} onDidDismiss={handleCloseModal}>
				<div className="modal-content">
					<h2>Create a New Chat Room</h2>
					<CreateChatRoom onRoomCreated={handleCloseModal} />
					<IonButton onClick={handleCloseModal}>Close</IonButton>
				</div>
			</IonModal>
		</div>
	);
};

export default ChatsHeader;
