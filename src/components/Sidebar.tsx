import React, { useState } from "react";
import {
	FaHome,
	FaComments,
	FaCamera,
	FaBars,
	FaCog,
	FaInfoCircle,
	FaUserFriends
} from "react-icons/fa";
import { Link, useHistory, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
	const [isExpanded, setIsExpanded] = useState(true);
	const history = useHistory();
	const location = useLocation();

	const toggleSidebar = () => {
		setIsExpanded(!isExpanded);
	};

	const navigate = (path: string) => {
		history.push(path);
	};

	const buttonClasses = "flex items-center space-x-3 text-lg pl-2 hover:text-blue-400";

	return (
		<div
			className={`h-screen ${isExpanded ? "w-64" : "w-20"} bg-[#1a1a1a] p-6 hidden md:flex flex-col transition-width duration-300`}>
			<button onClick={toggleSidebar} className="mb-6 text-gray-300 hover:text-white">
				<FaBars className="text-2xl" />
			</button>

			<div className="flex items-center mb-6">
				<div
					className={`${
						isExpanded ? "w-12 h-12" : "w-8 h-8"
					} rounded-full flex items-center justify-center text-xl font-semibold text-white`}
					style={{ backgroundColor: "#444444" }}>
					<span>DP</span>
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
					className={`${buttonClasses} ${
						location.pathname === "/home"
							? "text-blue-400 font-semibold"
							: "text-gray-300"
					} ${!isExpanded && "justify-center"}`}>
					<FaHome className="text-xl" />
					{isExpanded && <span>Home</span>}
				</button>
				<button
					onClick={() => navigate("/chat")}
					className={`${buttonClasses} ${
						location.pathname === "/chat"
							? "text-blue-400 font-semibold"
							: "text-gray-300"
					} ${!isExpanded && "justify-center"}`}>
					<FaComments className="text-xl" />
					{isExpanded && <span>Chat</span>}
				</button>
				<button
					onClick={() => navigate("/camera")}
					className={`${buttonClasses} ${
						location.pathname === "/camera"
							? "text-blue-400 font-semibold"
							: "text-gray-300"
					} ${!isExpanded && "justify-center"}`}>
					<FaCamera className="text-xl" />
					{isExpanded && <span>Camera</span>}
				</button>
				<button
					onClick={() => navigate("/connections")}
					className={`${buttonClasses} ${
						location.pathname === "/connections"
							? "text-blue-400 font-semibold"
							: "text-gray-300"
					} ${!isExpanded && "justify-center"}`}>
					<FaUserFriends className="text-xl" />
					{isExpanded && <span>Connections</span>}
				</button>
				<button
					onClick={() => navigate("/settings")}
					className={`${buttonClasses} ${
						location.pathname === "/settings"
							? "text-blue-400 font-semibold"
							: "text-gray-300"
					} ${!isExpanded && "justify-center"}`}>
					<FaCog className="text-xl" />
					{isExpanded && <span>Settings</span>}
				</button>
				<button
					onClick={() => navigate("/about")}
					className={`${buttonClasses} ${
						location.pathname === "/about"
							? "text-blue-400 font-semibold"
							: "text-gray-300"
					} ${!isExpanded && "justify-center"}`}>
					<FaInfoCircle className="text-xl" />
					{isExpanded && <span>About</span>}
				</button>
			</nav>
		</div>
	);
};

export default Sidebar;
