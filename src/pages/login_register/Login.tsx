import { useState } from "react";
import { IonInput, IonIcon, IonButton, IonItem, IonLabel, IonText } from "@ionic/react";
import { arrowForwardOutline, lockClosedOutline, saveOutline } from "ionicons/icons";

import LRContainer from "./components/LRContainer";
import { prettyError } from "../../util/http_util";

import "./LoginRegister.scss";
import PassInput from "./components/PassInput";
import { LS_EVAULT_KEY } from "@/constants/WebStorageKeys";

/** Holds the types of security that the vault is to be encrypted with. */
enum VaultSecurityTypes {
	PASSPHRASE
}

interface LoginProps {
	togglePage: () => void;
}

const Login: React.FC<LoginProps> = ({ togglePage }) => {
	//State stuff
	const [hasEVault, setHasEVault] = useState(EVault.inLStore(LS_EVAULT_KEY));

	const [secType, setSecType] = useState<VaultSecurityTypes>(
		VaultSecurityTypes.PASSPHRASE
	);

	const [passphrase, setPassphrase] = useState(""); //State for passphrases

	//Handles form submissions
	const handleSubmit = async (e: React.FormEvent) => {
		//Prevent the default form submission behavior
		e.preventDefault();

		// Handle the form submission logic
	};

	const formNoEVault = (
		<>
			<p className="subtitle top">
				No vault was found in local storage. Please import a vault or click&nbsp;
				<IonText color="primary" onClick={togglePage} style={{ cursor: "pointer" }}>
					here&nbsp;
				</IonText>
				to create an account.
			</p>

			<IonButton shape="round" className="icon-btn">
				<span>Restore Your Vault</span>
				<IonIcon icon={saveOutline}></IonIcon>
			</IonButton>
		</>
	);

	const formEVault = (
		<>
			<p className="subtitle top">
				An exsisting vault was found, please enter your credentials to unlock it. Use the
				same passphrase you used to encrypt the vault.
			</p>

			{/* Passphrase security */}
			{secType === VaultSecurityTypes.PASSPHRASE && (
				<>
					<PassInput pass={passphrase} setPass={setPassphrase} />
				</>
			)}

			{/* Pre-encryption vault buttons */}
			<IonButton className="icon-btn bottommost-button" shape="round" expand="full">
				<span>Decrypt</span>
				<IonIcon icon={lockClosedOutline}></IonIcon>
			</IonButton>
		</>
	);

	const formVault = (
		<>
			<p className="subtitle top">
				Your vault was succefully decrypted, please click the button below to initiate the
				login process.
			</p>

			<IonButton shape="round" className="icon-btn">
				<span>Login</span>
				<IonIcon icon={saveOutline}></IonIcon>
			</IonButton>
		</>
	);

	//Holds the form content to render
	const formContent = (
		<>
			{/* Continue Button */}
			<IonButton shape="round" expand="full" type="submit" className="continue-button">
				Continue
			</IonButton>
		</>
	);

	//Render the fragment
	return <LRContainer title="Login" content={formVault} onSubmit={handleSubmit} />;
};

export default Login;
