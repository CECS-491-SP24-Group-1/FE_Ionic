import React from "react";
import { FaCamera } from "react-icons/fa";

interface InfoFieldProps {
	label: string;
	value: string;
	isEditable: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, isEditable }) => {
	return (
		<div className="flex justify-between items-center py-3 border-b border-borderPrimary dark:border-borderPrimary-light">
			<p className="text-textSecondary dark:text-textSecondary-light">{label}</p>
			<p className="text-textPrimary dark:text-textPrimary-light">{value}</p>
			{isEditable && (
				<a
					href="#"
					className="text-accent hover:underline text-sm dark:text-accent-light">
					Edit
				</a>
			)}
		</div>
	);
};

const Account: React.FC = () => {
	const infoFields = [
		{ label: "Name", value: "Thomas Shelby", isEditable: true },
		{ label: "Country", value: "USA", isEditable: true },
		{ label: "Timezone", value: "Europe/Rome", isEditable: true },
		{ label: "About", value: "Hey, it's me :)", isEditable: true }
	];

	return (
		<div className="flex flex-col space-y-6">
			{/* Profile Info Card */}
			<div className="flex items-center space-x-4">
				{/* Profile Image with Edit Icon Overlay */}
				<div className="relative w-16 h-16">
					<img
						src="https://via.placeholder.com/64" // Placeholder image URL
						alt="Profile"
						className="w-full h-full rounded-full object-cover"
					/>
					<div className="absolute bottom-0 right-0 bg-muted text-textPrimary p-1 rounded-full text-xs cursor-pointer dark:bg-muted-light dark:text-textPrimary-light">
						<FaCamera />
					</div>
				</div>

				{/* User Info */}
				<div>
					<p className="font-semibold text-textPrimary text-lg dark:text-textPrimary-light">
						Thomas Shelby
					</p>
					<a
						href="#"
						className="text-sm text-accent hover:underline dark:text-accent-light">
						View profile
					</a>
				</div>
			</div>

			{/* Personal Information List */}
			<div className="flex flex-col space-y-2">
				{infoFields.map((field) => (
					<InfoField
						key={field.label}
						label={field.label}
						value={field.value}
						isEditable={field.isEditable}
					/>
				))}
			</div>
		</div>
	);
};

export default Account;
