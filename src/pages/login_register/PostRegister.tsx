import { useState } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { toast } from "react-toastify";
import { passwordStrength } from "check-password-strength";
import { arrowForwardOutline, lockClosedOutline, saveOutline } from "ionicons/icons";
import { sprintf } from "sprintf-js";

import LRContainer from "./components/LRContainer";

import "./LoginRegister.scss";
import PassStrength from "./components/PassStrength";
import PassInput from "./components/PassInput";
import { string2File } from "@/util/io";
import { VAULT_SAVE_NAME_FMT } from "@/constants/Misc";
import useVaultStore from "@/stores/vault_store";

interface PostRegisterProps {
	vault: typeof Vault;
	togglePage: () => void; //From LRPage.tsx
}

/** Holds the types of security that the vault is to be encrypted with. */
enum VaultSecurityTypes {
	PASSPHRASE
}

const PostRegister: React.FC<PostRegisterProps> = ({ vault, togglePage }) => {
	//Form data
	const [secType, setSecType] = useState<VaultSecurityTypes>(
		VaultSecurityTypes.PASSPHRASE
	);
	const [passphrase, setPassphrase] = useState(""); //State for passphrases
	const [passphraseStrength, setPassphraseStrength] = useState(-1); // State for passphrase strength

	//State stuff
	const [shouldWarnStrength, setShouldWarnStrength] = useState(false);

	//Handles passphrase input change and update strength using `passphraseStrength`
	const handleStrengthUpdate = (newPassphrase: string) => {
		const result = passwordStrength(newPassphrase);
		if (newPassphrase.length > 0) setPassphraseStrength(result.id);
		else setPassphraseStrength(-1);
		//console.log("password:", newPassphrase, "; strength:", result.id)
		setShouldWarnStrength(result.id < 3);
	};

	//Vault state
	const { setVault, evault, setEVault } = useVaultStore((state) => ({
		setVault: state.setVault,
		evault: state.evault,
		setEVault: state.setEVault
	}));

	//Handles form submissions
	const handleSubmit = async (e: React.FormEvent) => {
		//Prevent the default form submission behavior
		e.preventDefault();

		//Take the user back to the login page
		togglePage();
		//window.location.reload();
	};

	//Encrypts the vault
	const handleEncrypt = () => {
		//Prevent encryptions with blank passphrases
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

		//Encrypt the vault and store it in localstorage
		const ev: typeof EVault = EVault.fromJSObject(vault.encryptPassphrase(passphrase));
		setEVault(ev);

		//Set the vault in the Zustand store
		setVault(vault);

		//Announce the successful encryption
		toast.success("Vault was encrypted successfully!");
	};

	//Handles vault backups.
	const handleBackup = () => {
		if (!evault) return;
		const vname = sprintf(VAULT_SAVE_NAME_FMT, evault.id);
		string2File(evault.toGob64(), vname);
	};

	//Holds the form content to render when the encrypted vault is not present
	const formContentNoEVault = (
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
					{/* Passphrase strength feedback */}
					<PassStrength strength={passphraseStrength} />
				</>
			)}
			<br />
			<p className="subtitle">
				This passphrase will be used when you login to decrypt your vault. Please take
				note of it in a secure place.{" "}
				<strong>Losing this passphrase means losing access your vault.</strong>
			</p>

			{/* Pre-encryption vault buttons */}
			<IonButton
				className="icon-btn bottommost-button"
				shape="round"
				expand="full"
				onClick={handleEncrypt}>
				<span>Encrypt</span>
				<IonIcon icon={lockClosedOutline}></IonIcon>
			</IonButton>
		</>
	);

	//Holds the form content to render when the encrypted vault is present
	const formContentEVault = (
		<>
			<p className="subtitle top">
				Your vault was encrypted successfully and persisted to your web browser's local
				storage. To ensure the safety of your vault in case this memory store drops it,{" "}
				<i>it is highly recommended to take a backup via the leftmost button.</i> This
				backup can be restored at any time before login, and is encrypted using the same
				security method set in the previous step.
			</p>
			<div className="inline-btns">
				<IonButton shape="round" className="icon-btn" onClick={handleBackup}>
					<span>Backup Your Vault</span>
					<IonIcon icon={saveOutline}></IonIcon>
				</IonButton>
				<IonButton shape="round" type="submit" className="icon-btn">
					<span>Login</span>
					<IonIcon icon={arrowForwardOutline}></IonIcon>
				</IonButton>
			</div>
		</>
	);

	//Render the fragment
	return (
		<LRContainer
			title="Account Created"
			content={evault ? formContentEVault : formContentNoEVault}
			onSubmit={handleSubmit}
		/>
	);
};

export default PostRegister;
