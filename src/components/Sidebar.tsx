import React, { useEffect, useState } from "react";
import {
	FaHome,
	FaComments,
	FaCamera,
	FaBars,
	FaCog,
	FaInfoCircle,
	FaUserFriends
} from "react-icons/fa";
import taxios from "../util/token_refresh_hook";
import { Link, useHistory } from "react-router-dom";
import { UInfo } from "@ptypes/response_types";

interface SidebarProps {
	isExpanded: boolean;
	toggleSidebar: () => void;
}



const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
	const history = useHistory();

	const [currentUser, setCurrentUser] = useState<UInfo | null>();

	const menuItems = [
		{ label: "Home", icon: FaHome, path: "/home" },
		{ label: "Chat", icon: FaComments, path: "/chat" },
		{ label: "Camera", icon: FaCamera, path: "/camera" },
		{ label: "Users", icon: FaUserFriends, path: "/friends" },
		{ label: "Settings", icon: FaCog, path: "/settings" },
		{ label: "About", icon: FaInfoCircle, path: "/about" }
	];

	const navigate = (path: string) => {
		history.push(path);
	};

	const buttonClasses =
		"group flex items-center space-x-3 text-lg pl-2 transition-transform duration-300";

	const MenuButtons = ({ isExpanded }: { isExpanded: boolean }) => (
		<>
			{menuItems.map((item) => (
				<button
					key={item.label}
					onClick={() => navigate(item.path)}
					className={`${buttonClasses} ${
						!isExpanded ? "justify-center" : ""
					} hover:text-blue-400`}>
					<div className="flex items-center space-x-2">
						<item.icon className="text-xl transition-transform duration-300 group-hover:scale-105 group-hover:text-blue-400 dark:text-textPrimary-light" />
						{isExpanded && (
							<span className="transition-opacity duration-300 group-hover:text-blue-400 dark:text-textPrimary-light">
								{item.label}
							</span>
						)}
					</div>
				</button>
			))}
		</>
	);

	// Function to generate initials from the display name
	const getInitials = (name: string) => {
		return name
			.split(/[\s\-_]+/) // Split by space, hyphen, or underscore
			.map((part) => part[0]) // Take the first character of each part
			.join("") // Join the characters
			.toUpperCase(); // Convert to uppercase
	};

	// Get the current user info
	useEffect(() => {
		const fetchUser = async () => {
			const response = await taxios.get(`${import.meta.env.VITE_API_URL}/user/me`)
			setCurrentUser(response.data.payloads[0])
		}

		fetchUser();
	}, [])

	return (
		<div
			className={`hidden h-screen sm:flex ${
				isExpanded ? "w-64" : "w-20"
			} flex-shrink-0 flex-col bg-borderPrimary p-6 transition-all duration-300 dark:bg-borderPrimary-light`}>
			{/* Toggle Button */}
			<button
				onClick={toggleSidebar}
				className="mb-6 text-textPrimary hover:text-blue-400 dark:text-textPrimary-light">
				<FaBars className="text-2xl" />
			</button>
			{/* Profile Section */}
			<div className="mb-6 flex items-center transition-all duration-300">
				<div
					className={`${
						isExpanded ? "h-12 w-12" : "h-8 w-8"
					} flex items-center justify-center rounded-full transition-all duration-300`}
					style={{
						backgroundImage: `url(https://fakeimg.pl/256x256/404040/c4c4c4?text=${
							currentUser ? getInitials(currentUser.display_name) : "DP"
						}&font_size=60)`, // Add font_size parameter to enlarge text
						backgroundSize: "cover",
						backgroundColor: "#444444"
					}}>
					{/* Placeholder for profile image */}
				</div>
				{isExpanded && currentUser &&(
					<div
						className="ml-4 transition-opacity duration-300"
						style={{
							opacity: isExpanded ? 1 : 0,
							transform: `translateX(${isExpanded ? "0" : "-10px"})`
						}}>
						<p className="font-semibold text-textPrimary dark:text-textPrimary-light">
							{currentUser.display_name}
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
