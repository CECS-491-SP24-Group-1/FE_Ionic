import React, { useState } from "react";
import { Dialog, IconButton, InputBase, Typography } from "@mui/material";
import { Search as SearchIcon, Edit as EditIcon } from "@mui/icons-material";
import CreateChatRoom from "../CreateChatRoom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

interface ChatsHeaderProps {
	onSearch: (searchQuery: string) => void;
}

const ChatsHeader: React.FC<ChatsHeaderProps> = ({ onSearch }) => {
	const [showModal, setShowModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const handleOpenModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setSearchQuery(query);
		onSearch(query);
	};

	return (
		<div className="flex flex-col p-4 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
			{/* Header Title and New Chat Icon */}
			<div className="flex justify-between items-center mb-4">
				<Typography variant="h6" className="text-white">
					Chats
				</Typography>
				<IconButton onClick={handleOpenModal} className="text-primary">
					<FontAwesomeIcon icon={faEdit} size="lg" />
				</IconButton>
			</div>

			{/* Search Bar */}
			<div className="flex items-center bg-gray-700 dark:bg-gray-800 rounded-full px-4 py-2">
				<SearchIcon className="text-gray-400 mr-2" />
				<InputBase
					value={searchQuery}
					onChange={handleSearchChange}
					placeholder="Search Messenger"
					className="flex-grow text-gray-300 placeholder-gray-400"
					inputProps={{ "aria-label": "search messenger" }}
				/>
			</div>

			{/* Modal for Create Chat Room */}
			<Dialog open={showModal} onClose={handleCloseModal}>
				<CreateChatRoom onRoomCreated={handleCloseModal} />
			</Dialog>
		</div>
	);
};

export default ChatsHeader;
