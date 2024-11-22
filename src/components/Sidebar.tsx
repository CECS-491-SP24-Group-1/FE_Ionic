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

	const menuItems = [
		{ label: "Home", icon: FaHome, path: "/home" },
		{ label: "Chat", icon: FaComments, path: "/chat" },
		{ label: "Camera", icon: FaCamera, path: "/camera" },
		{ label: "Connections", icon: FaUserFriends, path: "/connections" },
		{ label: "Settings", icon: FaCog, path: "/settings" },
		{ label: "About", icon: FaInfoCircle, path: "/about" }
	];

	const navigate = (path: string) => {
		history.push(path);
	};

	const buttonClasses = "flex items-center space-x-3 text-lg pl-2";

	const MenuButtons = ({ isExpanded }: { isExpanded: boolean }) => (
		<>
			{menuItems.map((item) => (
				<button
					key={item.label}
					onClick={() => navigate(item.path)}
					className={`${buttonClasses} ${!isExpanded && "justify-start"}`}>
					<item.icon className="text-xl text-textPrimary hover:text-blue-400 dark:text-textPrimary-light" />
					{isExpanded && (
						<span className="text-textPrimary hover:text-blue-400 dark:text-textPrimary-light">
							{item.label}
						</span>
					)}
				</button>
			))}
		</>
	);

	return (
		<div
			className={`hidden h-screen sm:flex ${
				isExpanded ? "w-64" : "w-20"
			} transition-width flex-shrink-0 flex-col bg-borderPrimary p-6 duration-300 dark:bg-borderPrimary-light`}>
			{/* Toggle Button */}
			<button
				onClick={toggleSidebar}
				className="mb-6 text-textPrimary hover:text-blue-400 dark:text-textPrimary-light">
				<FaBars className="text-2xl" />
			</button>
			{/* Profile Section */}
			<div className="mb-6 flex items-center">
				<div
					className={`${
						isExpanded ? "h-12 w-12" : "h-8 w-8"
					} flex items-center justify-center rounded-full text-lg font-semibold text-white`}
					style={{ backgroundColor: "#444444" }}>
					{/* Placeholder for profile image */}
					<span style={{ backgroundColor: "transparent" }}>DP</span>
				</div>
				{isExpanded && (
					<div className="ml-4">
						<p className="font-semibold text-textPrimary dark:text-textPrimary-light">
							David
						</p>
						<Link
							to="#"
							className="text-sm text-blue-400 hover:underline dark:text-blue-800">
							View profile
						</Link>
					</div>
				)}
			</div>

			<nav className="flex flex-col space-y-4">
				<MenuButtons isExpanded={isExpanded} />
			</nav>
		</div>
	);
};

export default Sidebar;
