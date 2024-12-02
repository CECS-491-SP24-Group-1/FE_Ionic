import React, { useEffect, useState } from "react";
import {
	FaHome,
	FaComments,
	FaCamera,
	FaBars,
	FaCog,
	FaInfoCircle,
	FaUserFriends,
	FaSignOutAlt
} from "react-icons/fa";
import taxios from "../util/token_refresh_hook";
import { Link, useHistory } from "react-router-dom";
import { UInfo } from "@ptypes/response_types";
import { createAvatar } from "@dicebear/core";
import { thumbs } from "@dicebear/collection";

interface SidebarProps {
	isExpanded: boolean;
	toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
	const history = useHistory();

	const [currentUser, setCurrentUser] = useState<UInfo | null>();
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

	const handleLogout = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
				method: "POST",
				credentials: "include" // Send cookies along with the request
			});

			if (response.ok) {
				// Remove local storage/session data
				localStorage.removeItem("authToken");
				sessionStorage.removeItem("authToken");

				// Redirect to the login page
				history.push("/");

				console.log("User fully logged out");
			} else {
				console.error("Failed to log out:", await response.text());
			}
		} catch (error) {
			console.error("Logout error:", error);
		}
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
			{/* Logout Button */}
			<button
				onClick={handleLogout}
				className={`${buttonClasses} ${
					!isExpanded ? "justify-center" : ""
				} hover:text-red-400`}>
				<div className="flex items-center space-x-2">
					<FaSignOutAlt className="text-xl transition-transform duration-300 group-hover:scale-105 group-hover:text-red-400 dark:text-textPrimary-light" />
					{isExpanded && (
						<span className="transition-opacity duration-300 group-hover:text-red-400 dark:text-textPrimary-light">
							Logout
						</span>
					)}
				</div>
			</button>
		</>
	);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await taxios.get(`${import.meta.env.VITE_API_URL}/user/me`);
				const userData = response.data.payloads[0];
				setCurrentUser(userData);

				// Generate Dicebear avatar
				const avatar = await createAvatar(thumbs, {
					seed: userData.display_name
				}).toDataUri();
				setAvatarUrl(avatar);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUser();
	}, []);

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
					} flex items-center justify-center rounded-full bg-gray-400 transition-all duration-300`}>
					<img
						src={avatarUrl || "https://via.placeholder.com/150"}
						alt="User avatar"
						className="h-full w-full rounded-full object-cover"
					/>
				</div>
				{isExpanded && currentUser && (
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
							to="/settings"
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
