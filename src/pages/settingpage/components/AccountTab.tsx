import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";
import useVaultStore from "@/stores/vault_store";
import useSWR, { mutate } from "swr";
import { createAvatar } from "@dicebear/core";
import { thumbs } from "@dicebear/collection";

interface InfoFieldProps {
	label: string;
	value: string;
	isEditable: boolean;
	onSave?: (newValue: string) => void;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, isEditable, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [newValue, setNewValue] = useState(value);

	const handleSave = () => {
		if (onSave && newValue !== value) {
			onSave(newValue);
		}
		setIsEditing(false);
	};

	return (
		<div className="flex items-center justify-between border-b border-borderPrimary py-3 dark:border-borderPrimary-light">
			<p className="text-textSecondary dark:text-textSecondary-light">{label}</p>
			{isEditing ? (
				<div className="flex items-center">
					<input
						type="text"
						value={newValue}
						onChange={(e) => setNewValue(e.target.value)}
						className="rounded border px-2 py-1 bg-backgroundHighlight dark:bg-slate-300"
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
								setIsEditing(true);
							}}
							className="text-sm text-accent hover:underline dark:text-accent-light">
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
	const [avatarUrl, setAvatarUrl] = useState<string>("");

	useEffect(() => {
		if (user && !user.photo_url) {
			const generateAvatar = async () => {
				const avatar = await createAvatar(thumbs, {
					seed: user.display_name || "Default Avatar"
				}).toDataUri();
				setAvatarUrl(avatar);
			};
			generateAvatar();
		} else if (user?.photo_url) {
			setAvatarUrl(user.photo_url);
		}
	}, [user]);

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
					const updatedUser = { ...user, photo_url: reader.result as string };
					mutate(`${import.meta.env.VITE_API_URL}/user/${myID}`, updatedUser, false);
					await updateUser({ photo_url: reader.result });
					mutate(`${import.meta.env.VITE_API_URL}/user/${myID}`);
					setAvatarUrl(reader.result as string);
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
				<div className="relative h-16 w-16">
					<img
						src={avatarUrl || "https://via.placeholder.com/64"}
						alt="Profile"
						className="h-full w-full rounded-full object-cover"
					/>
					<label
						htmlFor="photo-upload"
						className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-muted p-1 text-xs text-textPrimary dark:bg-muted-light dark:text-textPrimary-light">
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
					<p className="text-lg font-semibold text-textPrimary dark:text-textPrimary-light">
						{user?.display_name || "Display Name"}
					</p>
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
