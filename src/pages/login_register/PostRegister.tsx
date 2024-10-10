import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
	IonInput,
	IonButton,
	IonItem,
	IonLabel,
	IonText,
	IonProgressBar
} from "@ionic/react";
import axios from "axios";
import { IonRouterLink } from "@ionic/react";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js"; // Import crypto-js for encryption
import { passwordStrength } from "check-password-strength"; // Correct import

import LRContainer from "./LRContainer";
import { prettyError } from "../../util/http_util";

import "./LoginRegister.scss";

interface PostRegisterProps {
	vault: typeof Vault;
}

/** Holds the types of security that the vault is to be encrypted with. */
enum VaultSecurityTypes {
	PASSPHRASE
}

const PostRegister: React.FC<PostRegisterProps> = ({ vault }) => {
	//State stuff
	const history = useHistory();
	const [secType, setSecType] = useState<VaultSecurityTypes>(
		VaultSecurityTypes.PASSPHRASE
	);
	const [passphrase, setPassphrase] = useState("");
	const [password, setPassword] = useState(""); // State for password
	const [passwordStrengthLevel, setPasswordStrengthLevel] = useState(""); // State for password strength
	const [encryptedPassword, setEncryptedPassword] = useState(""); // State for encrypted password

	//Handles form submissions
	const handleSubmit = async (e: React.FormEvent) => {
		//Prevent the default form submission behavior
		e.preventDefault();

		// Take the user back to the login page
		history.push("/login");
		window.location.reload(); // Remove this when Zustand is implemented
	};

	//Encrypts the password
	const handleEncryptPassword = () => {
		if (password) {
			const encrypted = CryptoJS.AES.encrypt(password, "secret-key").toString();
			setEncryptedPassword(encrypted);
			toast.success("Password encrypted successfully!");
		} else {
			toast.error("Please enter a password to encrypt");
		}
	};

	// Handle password input change and update strength using `passwordStrength`
	const handlePasswordChange = (e: CustomEvent) => {
		const newPassword = e.detail.value!;
		setPassword(newPassword);
		const result = passwordStrength(newPassword); // Call passwordStrength function with password input
		setPasswordStrengthLevel(result.value); // result.value gives 'Too Weak', 'Weak', 'Medium', or 'Strong'
	};

	// Generate password strength color based on value
	const getPasswordStrengthColor = (strength: string) => {
		switch (strength) {
			case "Too Weak":
				return "danger";
			case "Weak":
				return "warning";
			case "Medium":
				return "tertiary";
			case "Strong":
				return "success";
			default:
				return "medium";
		}
	};

	//Holds the form content to render
	const formContent = (
		<>
			<IonItem>
				<IonLabel position="stacked">Choose a Password</IonLabel>
				<IonInput
					type="password"
					value={password}
					onIonInput={handlePasswordChange} // Use onIonInput for real-time update
					placeholder="Enter a password"
				/>
			</IonItem>

			{/* Password strength feedback */}
			<IonText color={getPasswordStrengthColor(passwordStrengthLevel)}>
				<p>Password strength: {passwordStrengthLevel}</p>
			</IonText>

			<IonButton
				shape="round"
				expand="full"
				onClick={handleEncryptPassword}
				className="encrypt-button">
				Encrypt Password
			</IonButton>

			{encryptedPassword && (
				<IonText color="primary">
					<p>Your encrypted password: {encryptedPassword}</p>
				</IonText>
			)}

			{/* Continue Button */}
			<IonButton shape="round" expand="full" type="submit" className="continue-button">
				Continue
			</IonButton>
		</>
	);

	//Render the fragment
	return (
		<LRContainer title="Account Created" content={formContent} onSubmit={handleSubmit} />
	);
};

export default PostRegister;
