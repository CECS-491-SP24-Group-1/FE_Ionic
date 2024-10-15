import { useEffect, useRef, useState } from "react";
import { IonInput, IonIcon, IonButton, IonItem, IonLabel, IonText } from "@ionic/react";
import { downloadOutline, lockOpenOutline, logInOutline } from "ionicons/icons";

import LRContainer from "./components/LRContainer";
import { prettyError } from "@/util/http_util";

import "./LoginRegister.scss";
import PassInput from "./components/PassInput";
import { LS_EVAULT_KEY, SS_VAULT_KEY } from "@/constants/WebStorageKeys";
import { VAULT_FILE_EXT } from "@/constants/Misc";
import FileInput from "@/components/misc/FileInput";
import { toast } from "react-toastify";
import { readText } from "@/util/io";

/** Holds the types of security that the vault is to be encrypted with. */
enum VaultSecurityTypes {
	PASSPHRASE
}

interface VaultState {
	hasEVault: boolean;
	hasVault: boolean;
	vaultFile: File | null;
	evault: typeof EVault | null;
	vault: typeof Vault | null;
}

interface LoginProps {
	togglePage: () => void;
}

const Login: React.FC<LoginProps> = ({ togglePage }) => {
	//Holds the form to render and a ref to only load it once
	const [form, setForm] = useState<JSX.Element | null>(null);
	const formPickedRef = useRef(false);

	//Vault state
	const [vaultState, setVaultState] = useState<VaultState>({
		hasEVault: EVault.inLStore(LS_EVAULT_KEY),
		hasVault: Vault.inLStore(SS_VAULT_KEY),
		vaultFile: null,
		evault: null,
		vault: null
	});

	//Misc state stuff
	const [secType, setSecType] = useState<VaultSecurityTypes>(
		VaultSecurityTypes.PASSPHRASE
	);
	const [passphrase, setPassphrase] = useState(""); //State for passphrases

	// Added useEffect to listen for vaultState changes
	useEffect(() => {
		// Whenever vaultState changes, re-pick the form
		setForm(pickForm());
	}, [vaultState]);

	//Invokes the form loader only once
	useEffect(() => {
		if (!formPickedRef.current) {
			setForm(pickForm());
			formPickedRef.current = true;
		}
	}, []);

	//Picks the correct form to render
	const pickForm = (): JSX.Element => {
		console.log("booby");
		//Check for a vault
		if (vaultState.hasVault) {
			return formVault;
		}

		//Check for an encrypted vault
		else if (vaultState.hasEVault) {
			//Check if the encrypted vault is already loaded in memory
			if (vaultState.evault) return formEVault;

			//Try to deserialize the encrypted vault
			try {
				const loaded = EVault.fromLStore(LS_EVAULT_KEY);
				setVaultState((prevState) => ({
					...prevState,
					evault: loaded
				}));
				toast.success("Successfully deserialized encrypted vault from localstorage.");
				return formEVault;
			} catch (e) {} //Fail silently
		}

		//By default, assume no vault exists
		return formNoEVault;
	};

	//Handles file picking
	const handleFileSelect = (file: File | null) => {
		setVaultState((prevState) => ({
			...prevState,
			vaultFile: file
		}));
	};

	//Handles loading encrypted vaults
	const handleLoadEVault = async () => {
		//Do not proceed unless a vault file is selected
		console.log("vault file:", vaultState.vaultFile);
		if (!vaultState.vaultFile) {
			toast.error(
				"No encrypted vault file found. Please choose one before continuing.",
				{}
			);
			return;
		}

		//Begin loading the vault
		try {
			//Load the vault contents into a string and parse it into a vault object
			const vaultContent: string = await readText(vaultState.vaultFile);
			const loaded = EVault.fromGob64(vaultContent);

			//Persist the encrypted vault to localstorage
			loaded.toLStore(LS_EVAULT_KEY);

			//Update the vault state
			setVaultState((prevState) => ({
				...prevState,
				evault: loaded,
				hasEVault: true
			}));
		} catch (e: any) {
			toast.error(e.message, {});
		}
	};

	//Handles login attempts
	const handleLogin = async (e: React.FormEvent) => {
		//Prevent the default form submission behavior
		e.preventDefault();

		// Handle the form submission logic
	};

	//Form contents to show when an encrypted vault is not present.
	const formNoEVault = (
		<>
			<p className="subtitle top">
				No vault was found in local storage. Please import a vault or&nbsp;
				<IonText color="primary" onClick={togglePage} style={{ cursor: "pointer" }}>
					click here
				</IonText>
				&nbsp;to create an account.
			</p>

			<FileInput onFileSelect={handleFileSelect} acceptedExts={[VAULT_FILE_EXT]} />

			<IonButton
				className="icon-btn"
				shape="round"
				expand="full"
				onClick={handleLoadEVault}>
				<span>Restore Your Vault</span>
				<IonIcon icon={downloadOutline}></IonIcon>
			</IonButton>
		</>
	);

	//Form contents to show when an encrypted vault is present, but not decrypted.
	const formEVault = (
		<>
			<p className="subtitle top">
				An existing vault was found. Please enter your credentials to decrypt it. Use the
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
				<IonIcon icon={lockOpenOutline}></IonIcon>
			</IonButton>
		</>
	);

	//Form contents to show when a vault is present and ready to use.
	const formVault = (
		<>
			<p className="subtitle top">
				Your vault was successfully decrypted. Please click the button below to initiate
				the login process.
			</p>

			<IonButton shape="round" className="icon-btn continue-button" type="submit">
				<span>Login</span>
				<IonIcon icon={logInOutline}></IonIcon>
			</IonButton>
		</>
	);

	//Render the fragment
	return form && <LRContainer title="Login" content={form} onSubmit={handleLogin} />;
};

export default Login;
