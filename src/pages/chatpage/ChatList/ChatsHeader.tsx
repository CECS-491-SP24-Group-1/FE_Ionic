import React, { useState } from "react";
import { IonLabel, IonIcon, IonModal, IonButton, IonInput } from "@ionic/react";
import { search, addCircle } from "ionicons/icons";
import CreateChatRoom from "./CreateChatRoom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@/App.scss";

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
		<div className="sticky top-0 z-10 rounded-t-2xl bg-transparent p-4 text-textPrimary dark:text-textPrimary-light">
			<div className="chats-title mb-4 flex items-center justify-between">
				<IonLabel className="text-lg font-semibold text-textPrimary dark:text-textPrimary-light">
					Chats
				</IonLabel>
				<div
					className="absolute right-4 top-4 flex cursor-pointer items-center justify-center text-[19px] text-textAccent transition-colors duration-300 dark:text-textAccent-light"
					onClick={handleOpenModal}>
					<IonIcon
						icon={addCircle}
						className="mr-2 text-2xl text-textPrimary dark:text-textPrimary-light"
					/>
				</div>
			</div>

			{/* Search bar */}
			<div className="chat-search-bar flex items-center rounded-lg bg-secondary px-3 py-2 dark:bg-secondary-light">
				<IonIcon
					icon={search}
					className="search-icon mr-2 text-textSecondary dark:text-textSecondary-light"
				/>
				<IonInput
					value={searchQuery}
					placeholder="Search Messenger"
					onIonChange={handleSearchChange}
					className="chat-search-input w-full bg-transparent text-textPrimary dark:text-textPrimary-light"
				/>
			</div>

			{/* Use IonModal to render CreateChatRoom */}

			<IonModal isOpen={showModal} onDidDismiss={handleCloseModal}>
				<CreateChatRoom onRoomCreated={handleCloseModal} />
			</IonModal>
		</div>
	);
};

export default ChatsHeader;
