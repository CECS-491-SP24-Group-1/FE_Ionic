// Ionic imports
import { useEffect, useRef, useState } from "react";
import { IonIcon, IonButton, IonText, IonLoading } from "@ionic/react";
import { downloadOutline, lockOpenOutline, logInOutline } from "ionicons/icons";
import { toast } from "react-toastify";

import LRContainer from "./components/LRContainer";
import { swallowError } from "@/util/http_util";

// Webstorage imports
import "./LoginRegister.scss";
import PassInput from "./components/PassInput";
import { LS_EVAULT_KEY, SS_VAULT_KEY } from "@/constants/WebStorageKeys";
import { VAULT_FILE_EXT } from "@/constants/Misc";
import FileInput from "@/components/misc/FileInput";

//Vaultstore and http response imputs
import { readText } from "@/util/io";
import { Auth, LoginReq } from "@ptypes/response_types";
import credAxios from "@/util/axios_with_creds";
import { HttpResponse } from "@ptypes/http_response";
import { PKCRequest, PKCSignedRequest } from "@ptypes/request_types";
import useVaultStore from "@/stores/vault_store";
import useLoginGateStore from "@/stores/login_gate";
import { addMiscCookies } from "@/util/manage_misc_cookies";
import { es } from "@faker-js/faker/.";

/** Holds the types of security that the vault is to be encrypted with. */
enum VaultSecurityTypes {
	PASSPHRASE
}

interface VaultState {
	hasEVault: boolean;
	hasVault: boolean;
	vaultFile: File | null;
	//evault: typeof EVault | null;
}

interface LoginProps {
	togglePage: () => void;
}

const Login: React.FC<LoginProps> = ({ togglePage }) => {
	//Login gate store
	const { setShouldLogin } = useLoginGateStore((state) => ({
		setShouldLogin: state.setShouldLogin
	}));

	//Holds the form to render and a ref to only load it once
	const [form, setForm] = useState<JSX.Element | null>(null);

	//Local vault state
	const [vaultState, setVaultState] = useState<VaultState>({
		hasEVault: EVault.inLStore(LS_EVAULT_KEY),
		hasVault: Vault.inSStore(SS_VAULT_KEY),
		vaultFile: null
		//evault: null
	});
	const loadedEVault = useRef<boolean>(false);
	const loadedVault = useRef<boolean>(false);

	//Vault store
	const {
		vault,
		setVault,
		vaultFromSS,
		evault,
		setEVault,
		evaultFromLS,
		setSalt,
		setEKey,
		setCanReencrypt
	} = useVaultStore((state) => ({
		vault: state.vault,
		setVault: state.setVault,
		vaultFromSS: state.vaultFromSS,
		evault: state.evault,
		setEVault: state.setEVault,
		evaultFromLS: state.evaultFromLS,
		setSalt: state.setSalt,
		setEKey: state.setEKey,
		setCanReencrypt: state.setCanReencrypt
	}));

	//Misc state stuff
	const [secType, setSecType] = useState<VaultSecurityTypes>(
		VaultSecurityTypes.PASSPHRASE
	);
	const [passphrase, setPassphrase] = useState(""); //State for passphrases
	const disablePassphraseInput = useRef<boolean>(false);

	// Loading spinner
	const [loading, setLoading] = useState(false);
	//Invokes the form loader
	useEffect(() => {
		console.log("setForm called");
		setForm(pickForm());
	}, [vaultState, passphrase, vault, evault]);

	/*
	useEffect(() => {
		console.log("Vault updated:", vault);
	}, [vault]);
	*/

	//Picks the correct form to render
	const pickForm = (): JSX.Element => {
		//console.log("loadedVaultRef = ", loadedVault.current)
		//console.log("evault in ls:", vaultState.hasEVault)
		//console.log("vault in ss:", vaultState.hasVault)

		//Check for a vault
		if (vaultState.hasVault === true) {
			//Check if the vault is already loaded in memory
			if (vault && vault !== null) {
				console.log("vault exists in zustand. lets go");
				return formVault;
			}

			//Try to deserialize the vault
			if (!loadedVault.current) {
				if (vaultFromSS()) {
					//Alert the user
					toast.success("Successfully deserialized vault from sessionstorage.");

					//Mark the vault as loaded
					loadedVault.current = true;

					//Show the vault form
					return formVault;
				}
			}
		}

		//Check for an encrypted vault
		else if (vaultState.hasEVault === true) {
			//Check if the encrypted vault is already loaded in memory
			if (evault) return formEVault;

			//Try to deserialize the encrypted vault
			if (!loadedEVault.current) {
				if (evaultFromLS()) {
					//Alert the user
					toast.success("Successfully deserialized encrypted vault from localstorage.");

					//Mark the evault as loaded
					loadedEVault.current = true;

					//Show the encrypted vault form
					return formEVault;
				}
			}
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
			toast.error("No encrypted vault file found. Please choose one before continuing.");
			return;
		}

		//Begin loading the vault
		try {
			//Load the vault contents into a string and parse it into an evault object
			const vaultContent: string = await readText(vaultState.vaultFile);
			const loaded = EVault.fromGob64(vaultContent);

			//Persist the encrypted vault to localstorage via Zustand
			//loaded.toLStore(LS_EVAULT_KEY);
			setEVault(loaded);

			//Update the vault state
			setVaultState((prevState) => ({
				...prevState,
				evault: loaded,
				hasEVault: true
			}));
		} catch (e: any) {
			toast.error(e.message);
		}
	};

	//Handles vault decryption
	const handleDecrypt = async () => {
		//Prevent decryptions with blank passphrases
		if (disablePassphraseInput.current) return;
		if (!passphrase) {
			toast.error("Please enter the passphrase you used to encrypt the vault.");
			return;
		}

		//Attempt to decrypt the vault
		if (!evault) return; //This shouldn't be hit
		disablePassphraseInput.current = true;
		setLoading(true); // Show the spinner

		try {
			//Get the salt from the encrypted vault and a new one for re-encryption
			const dsalt = evault.salt;
			const esalt = vaultlib.argonSalt();

			//Run Argon2id twice: once to decrypt the vault and again to get a re-encryption key
			const dkey = await vaultlib.argon2id(passphrase, dsalt);
			const ekey = await vaultlib.argon2id(passphrase, esalt);

			//Decrypt the vault
			const decrypted = Vault.fromJSObject(await evault.decryptPassphrasePrecomp(dkey));
			disablePassphraseInput.current = false;

			//Store the re-encryption salt and key in Zustand for later
			setSalt(esalt);
			setEKey(ekey);

			//Store the vault in the vault store
			setVault(decrypted);
			setCanReencrypt(true);

			//Update the local state
			setVaultState((prevState) => ({
				...prevState,
				hasVault: true
			}));

			setLoading(false); // Hide spinner
		} catch (e: any) {
			toast.error(
				"The passphrase you entered was incorrect or an error occurred. Check the console for more details."
			);
			console.error(e.message);
			disablePassphraseInput.current = false;
			
		}
	};

	//Handles login attempts
	const handleLogin = async (e: React.FormEvent) => {
		//Prevent the default form submission behavior
		e.preventDefault();
		if (!vault) return;

		//Get the user's ID and keystore from the vault
		const uid = vault.subject;
		const ks: typeof KeyStore = KeyStore.fromJSObject(vault.kstore);

		//Construct the login request
		const loginReq: PKCRequest = {
			id: uid,
			pk: ks.pk
		};

		//Step 1: Acquire a login request token
		let token = "";
		try {
			//Issue the request; token refreshes can occur here
			const response: HttpResponse<LoginReq | Auth> = (
				await credAxios.post(`${import.meta.env.VITE_API_URL}/auth/login_req`, loginReq)
			).data;
			const payload = response!.payloads![0];
			console.log("S1 response:", response);

			//Check if the response if of type `Auth`; this indicates a refreshed session
			//TS has no way to get the keys of interfaces, unfortunately
			const isRefreshResp = ["id", "username"].every((key) => key in payload);
			if (isRefreshResp) {
				//Skip the rest of the process; jump straight to the homepage
				addMiscCookies((payload as Auth).id, (payload as Auth).username);
				console.log("Detected token refresh. Re-routing...");
				setShouldLogin(false);
				//window.location.reload();
				return;
			}

			//Pull the token out of the response; guaranteed to be non-null
			token = (payload as LoginReq).token;
		} catch (e: any) {
			const etext = swallowError(e);
			console.error(etext);
			toast.error(etext);
			return;
		}

		//Sign the token using the keystore's private key
		const signature = ks.sign(token);

		//Construct the login verification request
		const loginVReq: PKCSignedRequest = {
			id: uid,
			pk: ks.pk,
			token: token,
			signature: signature
		};

		//Step 2: Acquire an access token; first logins also verify ownership of the SK
		//The user is auto-redirected at this point
		try {
			//Issue the request
			const response: HttpResponse<Auth> = (
				await credAxios.post(
					`${import.meta.env.VITE_API_URL}/auth/login_verify`,
					loginVReq
				)
			).data;
			console.log("S2 response:", response);

			//Pull the response data out; guaranteed to be non-null
			const udata = response!.payloads![0]!;
			addMiscCookies(udata.id, udata.username);
			toast.success(`Successfully logged in as ${udata.username} <id: ${udata.id}>.`);
		} catch (e: any) {
			const etext = swallowError(e);
			console.error(etext);
			toast.error(etext);
			return;
		}

		//Redirect to the homepage
		setShouldLogin(false);
		//history.push("/home");
		//window.location.reload();
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
				<PassInput
					pass={passphrase}
					setPass={setPassphrase}
					disable={disablePassphraseInput.current}
				/>
			)}

			{/* Pre-decryption vault buttons */}
			<IonButton
				className="icon-btn bottommost-button"
				shape="round"
				expand="full"
				onClick={handleDecrypt}>
				<span>Decrypt</span>
				<IonIcon icon={lockOpenOutline}></IonIcon>
			</IonButton>
		</>
	);

	//Form contents to show when a vault is present and ready to use.
	const formVault = (
		<>
			<p className="subtitle top">
				Your vault is decrypted and ready to use. Please click the button below to
				initiate the login process.
			</p>

			<IonButton shape="round" className="icon-btn continue-button" type="submit">
				<span>Login to Wraith</span>
				<IonIcon icon={logInOutline}></IonIcon>
			</IonButton>
		</>
	);

	return (
		<>
		  <IonLoading isOpen={loading} message="Decrypting the vault, please wait..." />
		  {form && <LRContainer title="Login" content={form} onSubmit={handleLogin} />}
		</>
	  );
};

export default Login;
