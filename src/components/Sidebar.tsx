import React from "react";
import {
	FaHome,
	FaComments,
	FaCamera,
	FaBars,
	FaCog,
	FaInfoCircle,
	FaUserFriends
} from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";

interface SidebarProps {
	isExpanded: boolean;
	toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
	const history = useHistory();

	const navigate = (path: string) => {
		history.push(path);
	};

	// Define reusable class constant for the buttons
	const buttonClasses =
		"flex items-center space-x-3 text-lg pl- text-gray-300 hover:text-blue-400";

	return (
		<div
			className={`hidden sm:flex h-screen ${
				isExpanded ? "w-64" : "w-20"
			} bg-[#1a1a1a] p-6 flex-col flex-shrink-0 transition-width duration-300`}>
			{/* Toggle Button */}
			<button onClick={toggleSidebar} className="mb-6 text-gray-300 hover:text-white">
				<FaBars className="text-2xl" />
			</button>
			{/* Profile Section */}
			<div className="flex items-center mb-6">
				<div
					className={`${
						isExpanded ? "w-12 h-12" : "w-8 h-8"
					} rounded-full flex items-center justify-center text-lg font-semibold text-white`}
					style={{ backgroundColor: "#444444" }}>
					{/* Placeholder for profile image */}
					<span style={{ backgroundColor: "transparent" }}>DP</span>
				</div>
				{isExpanded && (
					<div className="ml-4">
						<p className="font-semibold text-gray-200">David</p>
						<Link to="#" className="text-sm text-blue-400 hover:underline">
							View profile
						</Link>
					</div>
				)}
			</div>

			<nav className="flex flex-col space-y-4">
				<button
					onClick={() => navigate("/home")}
					className={`${buttonClasses} ${!isExpanded && "justify-start"}`}>
					<FaHome className="text-xl" />
					{isExpanded && <span>Home</span>}
				</button>
				<button
					onClick={() => navigate("/chat")}
					className={`${buttonClasses} ${!isExpanded && "justify-start"}`}>
					<FaComments className="text-xl" />
					{isExpanded && <span>Chat</span>}
				</button>
				<button
					onClick={() => navigate("/camera")}
					className={`${buttonClasses} ${!isExpanded && "justify-start"}`}>
					<FaCamera className="text-xl" />
					{isExpanded && <span>Camera</span>}
				</button>
				<button
					onClick={() => navigate("/connections")}
					className={`${buttonClasses} ${!isExpanded && "justify-start"}`}>
					<FaUserFriends className="text-xl" />
					{isExpanded && <span>Connections</span>}
				</button>
				<button
					onClick={() => navigate("/settings")}
					className={`${buttonClasses} ${!isExpanded && "justify-start"}`}>
					<FaCog className="text-xl" />
					{isExpanded && <span>Settings</span>}
				</button>
				<button
					onClick={() => navigate("/about")}
					className={`${buttonClasses} ${!isExpanded && "justify-start"}`}>
					<FaInfoCircle className="text-xl" />
					{isExpanded && <span>About</span>}
				</button>
			</nav>
		</div>
	);
};

export default Sidebar;
