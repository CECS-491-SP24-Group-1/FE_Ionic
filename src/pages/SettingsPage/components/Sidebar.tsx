// Sidebar.tsx

import React, { useState } from "react";
import {
	FaBars,
	FaCog,
	FaEnvelope,
	FaBell,
	FaInfoCircle,
	FaFileContract,
	FaUserFriends,
	FaUsers
} from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";

const Sidebar: React.FC = () => {
	const [isExpanded, setIsExpanded] = useState(true);
	const history = useHistory();

	const toggleSidebar = () => {
		setIsExpanded(!isExpanded);
	};

	const navigate = (path: string) => {
		history.push(path);
	};

	return (
		<div
			className={`h-screen ${isExpanded ? "w-64" : "w-20"} bg-[#1e1e1e] p-6 flex flex-col transition-width duration-300`}>
			{/* Toggle Button */}
			<button onClick={toggleSidebar} className="mb-6 text-gray-300 hover:text-white">
				<FaBars className="text-2xl" />
			</button>

			{/* Profile Section (only shows when expanded) */}
			{isExpanded && (
				<div className="flex items-center space-x-4 mb-6">
					<div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xl font-semibold text-white">
						{/* Placeholder for profile image */}
						<span>DP</span>
					</div>
					<div>
						<p className="font-semibold text-gray-200">David</p>
						<Link to="#" className="text-sm text-blue-400 hover:underline">
							View profile
						</Link>
					</div>
				</div>
			)}

			{/* Navigation Links */}
			<nav className="flex flex-col space-y-4">
				<button
					onClick={() => navigate("/settings")}
					className={`flex items-center space-x-3 text-gray-300 hover:text-blue-400 ${!isExpanded && "justify-center"}`}>
					<FaCog className="text-lg" />
					{isExpanded && <span>Settings</span>}
				</button>
				<button
					onClick={() => navigate("#")}
					className={`flex items-center space-x-3 text-gray-300 hover:text-blue-400 ${!isExpanded && "justify-center"}`}>
					<FaEnvelope className="text-lg" />
					{isExpanded && <span>Messages</span>}
				</button>
				<button
					onClick={() => navigate("#")}
					className={`flex items-center space-x-3 text-gray-300 hover:text-blue-400 ${!isExpanded && "justify-center"}`}>
					<FaBell className="text-lg" />
					{isExpanded && <span>Notifications</span>}
				</button>
				<button
					onClick={() => navigate("#")}
					className={`flex items-center space-x-3 text-gray-300 hover:text-blue-400 ${!isExpanded && "justify-center"}`}>
					<FaUserFriends className="text-lg" />
					{isExpanded && <span>Connections</span>}
				</button>
				<button
					onClick={() => navigate("#")}
					className={`flex items-center space-x-3 text-gray-300 hover:text-blue-400 ${!isExpanded && "justify-center"}`}>
					<FaUsers className="text-lg" />
					{isExpanded && <span>Group Sessions</span>}
				</button>
				<button
					onClick={() => navigate("#")}
					className={`flex items-center space-x-3 text-gray-300 hover:text-blue-400 ${!isExpanded && "justify-center"}`}>
					<FaInfoCircle className="text-lg" />
					{isExpanded && <span>About</span>}
				</button>
				<button
					onClick={() => navigate("#")}
					className={`flex items-center space-x-3 text-gray-300 hover:text-blue-400 ${!isExpanded && "justify-center"}`}>
					<FaFileContract className="text-lg" />
					{isExpanded && <span>Terms & Conditions</span>}
				</button>
				<button
					onClick={() => navigate("#")}
					className={`flex items-center space-x-3 text-gray-300 hover:text-blue-400 ${!isExpanded && "justify-center"}`}>
					<FaFileContract className="text-lg" />
					{isExpanded && <span>Privacy Policy</span>}
				</button>
			</nav>
		</div>
	);
};

export default Sidebar;
