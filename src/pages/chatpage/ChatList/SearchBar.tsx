import React from "react";
import { InputBase } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const SearchBar: React.FC = () => {
	return (
		<div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-2">
			<SearchIcon className="text-gray-500 dark:text-gray-300 mr-2" />
			<InputBase
				placeholder="Search"
				className="flex-grow text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-300"
				inputProps={{ "aria-label": "search" }}
			/>
		</div>
	);
};

export default SearchBar;
