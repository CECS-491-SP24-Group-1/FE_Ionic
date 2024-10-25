import React, { useState } from "react";
import { IonLabel, IonIcon, IonModal, IonButton, IonInput } from "@ionic/react";
import { createOutline, search } from "ionicons/icons"; // Add search icon
import CreateChatRoom from "../CreateChatRoom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

interface ChatsHeaderProps {
	onSearch: (searchQuery: string) => void;
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
				<div className="new-chat-icon-container">
					<div className="new-chat-icon" onClick={handleOpenModal}>
						<FontAwesomeIcon icon={faEdit} />
					</div>
				</div>
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
			{/* Conditionally render the CreateChatRoom component */}
			{showModal && <CreateChatRoom onRoomCreated={handleCloseModal} />}
		</div>
	);
};

export default ChatsHeader;
