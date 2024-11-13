// ProfileInfoCard.tsx

import React from "react";
import { FaCamera } from "react-icons/fa";

const ProfileInfoCard: React.FC = () => {
	return (
		<div className="flex items-center space-x-4 mb-6">
			{/* Profile Image with Edit Icon Overlay */}
			<div className="relative w-16 h-16">
				<img
					src="https://via.placeholder.com/64" // Placeholder image URL
					alt="Profile"
					className="w-full h-full rounded-full object-cover"
				/>
				<div className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full text-white text-xs cursor-pointer">
					<FaCamera />
				</div>
			</div>

			{/* User Info */}
			<div>
				<p className="font-semibold text-gray-800 text-lg">David</p>
				<a href="#" className="text-sm text-blue-600 hover:underline">
					View profile
				</a>
			</div>
		</div>
	);
};

export default ProfileInfoCard;
