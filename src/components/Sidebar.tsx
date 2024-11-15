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

	const buttonClasses =
		"flex items-center space-x-3 text-lg pl-2 hover:text-accent dark:hover:text-accent-light bg-transparent";

	return (
		<div
			className={`h-screen ${
				isExpanded ? "w-64" : "w-20"
			} bg-primary dark:bg-primary-light p-6 hidden md:flex flex-col transition-width duration-300v`}>
			{/* Sidebar Toggle Button */}
			<button
				onClick={toggleSidebar}
				className="mb-6 pl-2 text-textPrimary dark:text-textPrimary-light hover:text-accent dark:hover:text-accent-light bg-transparent">
				<FaBars className="text-2xl" />
			</button>

			{/* Profile Section */}
			<div className="flex items-center mb-6">
				<div
					className={`${
						isExpanded ? "w-12 h-12" : "w-8 h-8"
					} rounded-full flex items-center justify-center text-xl font-semibold text-textPrimary dark:text-textPrimary-light bg-secondary dark:bg-secondary-light`}>
					<span>DP</span>
				</div>
				{isExpanded && (
					<div className="ml-4">
						<p className="font-semibold text-textPrimary dark:text-textPrimary-light">
							David
						</p>
						<Link
							to="#"
							className="text-sm text-accent dark:text-accent-light hover:underline">
							View profile
						</Link>
					</div>
				)}
			</div>

			{/* Navigation Links */}
			<nav className="flex flex-col space-y-4">
				<button
					onClick={() => navigate("/home")}
					className={`${buttonClasses} ${
						location.pathname === "/home"
							? "text-accent font-semibold dark:text-accent-light"
							: "text-textSecondary dark:text-textSecondary-light"
					} ${!isExpanded && "justify-center"}`}>
					<FaHome className="text-xl" />
					{isExpanded && <span>Home</span>}
				</button>
				<button
					onClick={() => navigate("/chat")}
					className={`${buttonClasses} ${
						location.pathname === "/chat"
							? "text-accent font-semibold dark:text-accent-light"
							: "text-textSecondary dark:text-textSecondary-light"
					} ${!isExpanded && "justify-center"}`}>
					<FaComments className="text-xl" />
					{isExpanded && <span>Chat</span>}
				</button>
				<button
					onClick={() => navigate("/camera")}
					className={`${buttonClasses} ${
						location.pathname === "/camera"
							? "text-accent font-semibold dark:text-accent-light"
							: "text-textSecondary dark:text-textSecondary-light"
					} ${!isExpanded && "justify-center"}`}>
					<FaCamera className="text-xl" />
					{isExpanded && <span>Camera</span>}
				</button>
				<button
					onClick={() => navigate("/connections")}
					className={`${buttonClasses} ${
						location.pathname === "/connections"
							? "text-accent font-semibold dark:text-accent-light"
							: "text-textSecondary dark:text-textSecondary-light"
					} ${!isExpanded && "justify-center"}`}>
					<FaUserFriends className="text-xl" />
					{isExpanded && <span>Connections</span>}
				</button>
				<button
					onClick={() => navigate("/settings")}
					className={`${buttonClasses} ${
						location.pathname === "/settings"
							? "text-accent font-semibold dark:text-accent-light"
							: "text-textSecondary dark:text-textSecondary-light"
					} ${!isExpanded && "justify-center"}`}>
					<FaCog className="text-xl" />
					{isExpanded && <span>Settings</span>}
				</button>
				<button
					onClick={() => navigate("/about")}
					className={`${buttonClasses} ${
						location.pathname === "/about"
							? "text-accent font-semibold dark:text-accent-light"
							: "text-textSecondary dark:text-textSecondary-light"
					} ${!isExpanded && "justify-center"}`}>
					<FaInfoCircle className="text-xl" />
					{isExpanded && <span>About</span>}
				</button>
			</nav>
		</div>
	);
};

export default Sidebar;
