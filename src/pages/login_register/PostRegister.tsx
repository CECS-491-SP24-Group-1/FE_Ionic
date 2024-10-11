import { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonButton, IonIcon } from "@ionic/react";
import { IonRouterLink } from "@ionic/react";
import { toast } from "react-toastify";
import { passwordStrength } from "check-password-strength";
import { lockClosedOutline } from "ionicons/icons";

import LRContainer from "./components/LRContainer";

import "./LoginRegister.scss";
import PassStrength from "./components/PassStrength";
import PassInput from "./components/PassInput";

interface PostRegisterProps {
	vault: typeof Vault;
	togglePage: () => void;
}

/** Holds the types of security that the vault is to be encrypted with. */
enum VaultSecurityTypes {
	PASSPHRASE
}

const PostRegister: React.FC<PostRegisterProps> = ({ vault, togglePage }) => {
	//State stuff
	const history = useHistory();
	const [secType, setSecType] = useState<VaultSecurityTypes>(
		VaultSecurityTypes.PASSPHRASE
	);
	const [passphrase, setPassphrase] = useState(""); //State for passphrases
	const [passphraseStrength, setPassphraseStrength] = useState(-1); // State for password strength
	const [shouldWarnStrength, setShouldWarnStrength] = useState(false);
	const [evault, setEvault] = useState<typeof EVault | undefined>(undefined);

	// Handle password input change and update strength using `passwordStrength`
	const handleStrengthUpdate = (newPassphrase: string) => {
		const result = passwordStrength(newPassphrase);
		if (newPassphrase.length > 0) setPassphraseStrength(result.id);
		else setPassphraseStrength(-1);
		if (passphraseStrength < 3) setShouldWarnStrength(true);
	};

	//Handles form submissions
	const handleSubmit = async (e: React.FormEvent) => {
		//Prevent the default form submission behavior
		e.preventDefault();

		// Take the user back to the login page
		history.push("/login");
		window.location.reload(); // Remove this when Zustand is implemented
	};

	//Encrypts the vault
	const handleEncrypt = async () => {
		//Prevent encryptions with blank passwords
		if (!passphrase) {
			toast.error("Please enter a passphrase to encrypt the vault with.");
			return;
		}

		//Warn users that their passphrase is not secure enough if it is
		if (shouldWarnStrength) {
			toast.warn(
				"Your passphrase strength is weak. Consider using a better passphrase or press the 'Encrypt' button again to continue anyways."
			);
			setShouldWarnStrength(false);
			return;
		}

		toast.success("Vault was encrypted successfully!" + vault.toString());
	};

	//Holds the form content to render
	const formContent = (
		<>
			<p className="subtitle top">
				Your account and vault have been successfully created. Your vault ID is{" "}
				<code>{vault.id}</code>. To complete registration, you must encrypt your vault.
			</p>

			{/* Passphrase security */}
			{secType === VaultSecurityTypes.PASSPHRASE && (
				<>
					<PassInput
						pass={passphrase}
						setPass={setPassphrase}
						onUpdate={handleStrengthUpdate}
					/>
					{/* Password strength feedback */}
					<PassStrength strength={passphraseStrength} />
				</>
			)}

			<br />
			<br />

			{/* Pre-encryption vault buttons */}
			{!evault && (
				<IonButton
					className="icon-btn"
					shape="round"
					expand="full"
					onClick={handleEncrypt}>
					<span>Encrypt</span>
					<IonIcon icon={lockClosedOutline}></IonIcon>
				</IonButton>
			)}

			{/* Continue Button * /}
			<IonButton shape="round" expand="full" type="submit" className="continue-button">
				Continue
			</IonButton>
			{*/}
		</>
	);

	//Render the fragment
	return (
		<LRContainer title="Account Created" content={formContent} onSubmit={handleSubmit} />
	);
};

export default PostRegister;
