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
			<button onClick={handleSave} className="ml-2 text-accent dark:text-accent-light">
			  Save
			</button>
		  </div>
		) : (
		  <p className="text-textPrimary dark:text-textPrimary-light">{value}</p>
		)}
		{isEditable && !isEditing && (
		  <a
			href="#"
			onClick={(e) => {
			  e.preventDefault();
			  setIsEditing(true); // Enable edit mode
			}}
			className="text-accent hover:underline text-sm dark:text-accent-light"
		  >
			Edit
		  </a>
		)}
	  </div>
	);
  };
  
const AccountTab: React.FC = () => {
	const myID = useVaultStore((state) => state.myID); // Get the user ID from VaultStore
	const { user, isLoading, error,updateUser } = useUser(myID); // Use the user ID in the useUser hook

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error loading user data.</p>;
	}

	const handleUpdateDisplayName = async (newDisplayName: string) => {
		try {
		  // Optimistically update user data locally
		  const updatedUser = { ...user, display_name: newDisplayName };

		  // Update local SWR cache immediately
		  mutate(`${import.meta.env.VITE_API_URL}/user/${myID}`, updatedUser, false);
	  
		  // Update the server and trigger cache revalidation
		  await updateUser({ display_name: newDisplayName });
	  
		  // Revalidate SWR cache after the update
		  mutate(`${import.meta.env.VITE_API_URL}/user/${myID}`);
		} catch (err) {
		  console.error("Failed to update display name:", err);
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
		  onSave: handleUpdateDisplayName,
		},
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
						{user?.display_name || "Display Name"}
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
						onSave={field.onSave} // Pass the save handler
					/>
				))}
			</div>
		</div>
	);
};

export default AccountTab;
