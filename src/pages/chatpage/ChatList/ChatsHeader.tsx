import React, { useState } from "react";
import { IonLabel, IonIcon, IonModal, IonButton, IonInput } from "@ionic/react";
import { search } from "ionicons/icons";
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
		<div className="chats-header bg-borderPrimary dark:bg-primary-light sticky top-0 z-10 text-textPrimary dark:text-textPrimary-light p-4">
			<div className="chats-title flex justify-between items-center mb-4">
				<IonLabel className="text-lg font-semibold text-textPrimary dark:text-textPrimary-light">
					Chats
				</IonLabel>
				<div
					className="absolute top-2 right-2 flex items-center justify-center rounded-full text-[19px] p-[10px] shadow-[0px_2px_5px_rgba(0,0,0,0.2)] cursor-pointer transition-colors duration-300 text-textAccent dark:text-textAccent-light hover:bg-[#6a6a6b]"
					onClick={handleOpenModal}>
					<FontAwesomeIcon icon={faEdit} />
				</div>
			</div>

			{/* Search bar */}
			<div className="chat-search-bar flex items-center bg-secondary dark:bg-secondary-light rounded-lg px-3 py-2">
				<IonIcon
					icon={search}
					className="search-icon text-textSecondary dark:text-textSecondary-light mr-2"
				/>
				<IonInput
					value={searchQuery}
					placeholder="Search Messenger"
					onIonChange={handleSearchChange}
					className="chat-search-input bg-transparent text-textPrimary dark:text-textPrimary-light w-full"
				/>
			</div>

			{/* Use IonModal to render CreateChatRoom */}
			<IonModal isOpen={showModal} onDidDismiss={handleCloseModal} showBackdrop={true}>
				<CreateChatRoom onRoomCreated={handleCloseModal} />
			</IonModal>
		</div>
	);
};

export default ChatsHeader;
