import { useRef, useState } from "react";
import { IonInput, IonButton, IonItem, IonLabel, IonText } from "@ionic/react";
import axios from "axios";
import { toast } from "react-toastify";

import PostRegister from "./PostRegister";
import LRContainer from "./components/LRContainer";
import { swallowError } from "@/util/http_util";

import { HttpResponse } from "@ptypes/http_response";
import { RegisteredUser } from "@ptypes/response_types";
import { RegisteringUser } from "@ptypes/request_types";

import { faker } from "@faker-js/faker"; //TODO: temp

import "./LoginRegister.scss";

interface RegisterProps {
	togglePage: () => void;
}

const Register: React.FC<RegisterProps> = ({ togglePage }) => {
	//State stuff
	const [keystore, setKeyStore] = useState<InstanceType<typeof KeyStore> | null>(null);
	const vault = useRef<InstanceType<typeof Vault>>(Vault.newBlank());

	//Form data
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [showFingerprint, setShowFingerprint] = useState(false);
	const [isKGBtnDisabled, setIsKGBtnDisabled] = useState(false);
	const [isContinuePressed, setIsContinuePressed] = useState(false);

	//Handles keystore generation
	const handleKeygen = () => {
		//Create a new keystore object
		const ks = new KeyStore();

		//Assign values and show the fingerprint
		setKeyStore(ks);
		setShowFingerprint(true);

		//Set the keystore in the vault
		vault.current.kstore = ks.toJSObject();

		//Disable the button
		setIsKGBtnDisabled(true);
	};

	//Handles form submissions
	const handleSubmit = async (e: React.FormEvent) => {
		//Prevent the default form submission behavior
		e.preventDefault();

		//console.log("kstore content: ", vault.kstore)

		//Check if there is a keystore present
		if (keystore === null) {
			toast.error("No keystore found. Please generate one before continuing.");
			return;
		}

		const payload: RegisteringUser = {
			username: username,
			email: email,
			pubkey: keystore.pk
		};

		try {
			//Send the request
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/auth/register`,
				payload
			);
			const respPayload: HttpResponse<RegisteredUser> = response.data;
			if (!respPayload.payloads) {
				throw new Error("server response has no payload");
			}
			const user = respPayload.payloads[0];

			//Add the response data to the vault plus extras
			vault.current.subject = user.id;
			vault.current.dev_ident = window.navigator.userAgent;

			//Report the creation of the account
			toast.success(`Successfully created user ${user.username} <${user.id}>`);
			setIsContinuePressed(true);
		} catch (error: any) {
			const rtext = swallowError(error);
			console.error("Error creating account:", rtext);
			toast.error(`Failed to create account: ${rtext}`);
		}
	};

	//TODO: temp
	const handleFakeData = async (e: React.FormEvent) => {
		//Generate a fake username and email
		const username = faker.internet.userName();
		const email = `${username}@localhost.com`;

		//Set form data
		setUsername(username);
		setEmail(email);

		//Generate a keystore and submit the form
		await handleKeygen();
		document.getElementById("continueBtn")?.click();
	};

	//Holds the form content to render
	const formContent = (
		<>
			{/* Username Input */}
			<IonItem>
				<IonLabel position="stacked">
					Username {username === "" && <span className="required"></span>}
				</IonLabel>
				<IonInput
					value={username}
					onIonChange={(e: CustomEvent) => setUsername(e.detail.value!)}
					required
				/>
			</IonItem>

			{/* Email Input */}
			<IonItem>
				<IonLabel position="stacked">
					Email {email === "" && <span className="required"></span>}
				</IonLabel>
				<IonInput
					type="email"
					value={email}
					onIonChange={(e: CustomEvent) => setEmail(e.detail.value!)}
					required
				/>
			</IonItem>

			{/* Keystore generation */}
			<IonButton
				shape="round"
				expand="full"
				id="genKSBtn"
				onClick={handleKeygen}
				disabled={isKGBtnDisabled}>
				Generate KeyStore
			</IonButton>

			<IonItem id="ksFingerprint" hidden={!showFingerprint}>
				<IonLabel position="stacked">Fingerprint</IonLabel>
				<IonInput type="text" value={keystore?.fingerprint} readonly={true} />
			</IonItem>

			{/* Continue Button */}
			<IonButton
				shape="round"
				expand="full"
				type="submit"
				className="continue-button"
				id="continueBtn">
				Continue
			</IonButton>

			{/* Fake data generator */}
			{/* TODO: temp */}
			<IonButton
				shape="round"
				expand="full"
				className="continue-button"
				onClick={handleFakeData}>
				Generate Fake Data
			</IonButton>

			{/* Footer Text */}
			<p className="fine-print">
				By registering, you agree to Wraith’s{" "}
				<IonText color="primary">Terms of Service</IonText> and{" "}
				<IonText color="primary">Privacy Policy</IonText>.
			</p>
			<p className="fine-print">
				Already have an account?&nbsp;
				<IonText color="primary" onClick={togglePage} style={{ cursor: "pointer" }}>
					Login Now
				</IonText>
				.
			</p>
		</>
	);

	//Render the fragment
	return isContinuePressed ? (
		<PostRegister vault={vault.current} togglePage={togglePage} />
	) : (
		<LRContainer title="Register" content={formContent} onSubmit={handleSubmit} />
	);
};

export default Register;
