import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";
import useVaultStore from "@/stores/vault_store";
import useSWR, { mutate } from "swr";

interface InfoFieldProps {
	label: string;
	value: string;
	isEditable: boolean;
	onSave?: (newValue: string) => void; // Callback for saving edits
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, isEditable, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [newValue, setNewValue] = useState(value);

	const handleSave = () => {
		if (onSave && newValue !== value) {
			onSave(newValue); // Call the parent save function
		}
		setIsEditing(false); // Exit edit mode
	};

	return (
		<div className="flex justify-between items-center py-3 border-b border-borderPrimary dark:border-borderPrimary-light">
			<p className="text-textSecondary dark:text-textSecondary-light">{label}</p>
			{isEditing ? (
				<div className="flex items-center">
					<input
						type="text"
						value={newValue}
						onChange={(e) => setNewValue(e.target.value)}
						className="border rounded px-2 py-1"
					/>
					<button
						onClick={handleSave}
						className="ml-2 text-accent dark:text-accent-light">
						Save
					</button>
				</div>
			) : (
				<div className="flex items-center space-x-2">
					<p className="text-textPrimary dark:text-textPrimary-light">{value}</p>
					{isEditable && (
						<a
							href="#"
							onClick={(e) => {
								e.preventDefault();
								setIsEditing(true); // Enable edit mode
							}}
							className="text-accent hover:underline text-sm dark:text-accent-light">
							Edit
						</a>
					)}
				</div>
			)}
		</div>
	);
};

const AccountTab: React.FC = () => {
	const myID = useVaultStore((state) => state.myID);
	const { user, isLoading, error, updateUser } = useUser(myID);
	const [newPhoto, setNewPhoto] = useState<string>("");

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error loading user data.</p>;
	}

	const handleUpdateDisplayName = async (newDisplayName: string) => {
		try {
			const updatedUser = { ...user, display_name: newDisplayName };
			mutate(`${import.meta.env.VITE_API_URL}/user/${myID}`, updatedUser, false);
			await updateUser({ display_name: newDisplayName });
			mutate(`${import.meta.env.VITE_API_URL}/user/${myID}`);
		} catch (err) {
			console.error("Failed to update display name:", err);
		}
	};

	const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = async () => {
				try {
					// Update user photo
					const updatedUser = { ...user, photo_url: reader.result as string };
					mutate(`${import.meta.env.VITE_API_URL}/user/${myID}`, updatedUser, false);
					await updateUser({ photo_url: reader.result });
					mutate(`${import.meta.env.VITE_API_URL}/user/${myID}`);
				} catch (err) {
					console.error("Failed to update user photo:", err);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const infoFields = [
		{ label: "ID", value: user?.id || "", isEditable: false },
		{ label: "Public Key", value: user?.pubkey || "", isEditable: false },
		{ label: "Username", value: user?.username || "", isEditable: false },
		{
			label: "Display Name",
			value: user?.display_name || "",
			isEditable: true,
			onSave: handleUpdateDisplayName
		}
	];

	return (
		<div className="flex flex-col space-y-6">
			<div className="flex items-center space-x-4">
				<div className="relative w-16 h-16">
					<img
						src={user?.photo_url || "https://via.placeholder.com/64"}
						alt="Profile"
						className="w-full h-full rounded-full object-cover"
					/>
					<label
						htmlFor="photo-upload"
						className="absolute bottom-0 right-0 bg-muted text-textPrimary p-1 rounded-full text-xs cursor-pointer dark:bg-muted-light dark:text-textPrimary-light">
						<FaCamera />
					</label>
					<input
						type="file"
						id="photo-upload"
						accept="image/*"
						className="hidden"
						onChange={handlePhotoChange}
					/>
				</div>

				<div>
					<p className="font-semibold text-textPrimary text-lg dark:text-textPrimary-light">
						{user?.display_name || "Display Name"}
					</p>
					<a
						href="#"
						className="text-sm text-accent hover:underline dark:text-accent-light">
						View profile
					</a>
				</div>
			</div>

			<div className="flex flex-col space-y-2">
				{infoFields.map((field) => (
					<InfoField
						key={field.label}
						label={field.label}
						value={field.value}
						isEditable={field.isEditable}
						onSave={field.onSave}
					/>
				))}
			</div>
		</div>
	);
};

export default AccountTab;
