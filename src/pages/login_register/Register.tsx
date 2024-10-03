import { useState } from "react";
import { IonInput, IonButton, IonItem, IonLabel, IonText } from "@ionic/react";
import axios from "axios";
import { IonRouterLink } from "@ionic/react";
import { toast } from "react-toastify";

import LRContainer from "./LRContainer";
import { prettyError } from "../../util/http_util";

import "./LoginRegister.scss";

const Register: React.FC = () => {
	//State stuff
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [keystore, setKeyStore] = useState<InstanceType<typeof KeyStore> | null>(null);
	const [showFingerprint, setShowFingerprint] = useState(false);
	const [isKGBtnDisabled, setIsKGBtnDisabled] = useState(false);

	//Handles keystore generation
	const handleKeygen = () => {
		//Create a new keystore object
		const ks = new KeyStore();

		//Assign values and show the fingerprint
		setKeyStore(ks);
		setShowFingerprint(true);

		//Disable the button
		setIsKGBtnDisabled(true);
	};

	//Handles form submissions
	const handleSubmit = async (e: React.FormEvent) => {
		//Prevent the default form submission behavior
		e.preventDefault();

		//Check if there is a keystore present
		if (keystore === null) {
			toast.error("No keystore found. Please generate one before continuing.", {});
			return;
		}

		const payload = {
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

			//Report the creation of the account
			const user: any = response.data.payloads[0];
			toast.success(`Successfully created user ${user.username} <${user.id}>`);
			console.log(user);
		} catch (error: any) {
			//Check if the error has a response section
			let rtext = "";
			if (error.response !== undefined) {
				const response: HttpResponse<any> = error.response.data;
				rtext = prettyError(response);
			} else {
				rtext = error.message;
			}

			//Log the error
			console.error("Error creating account:", rtext);
			toast.error(`Failed to create account: ${rtext}`);
		}
	};

	//Holds the form content to render
	const formContent = (
		<>
			{/* Username Input */}
			<IonItem>
				<IonLabel position="stacked">
					Username {username === "" && <span style={{ color: "red" }}>*</span>}
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
					Email {email === "" && <span style={{ color: "red" }}>*</span>}
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
			<IonButton shape="round" expand="full" type="submit" className="continue-button">
				Continue
			</IonButton>

			{/* Footer Text */}
			<p className="fine-print">
				By registering, you agree to Wraith’s{" "}
				<IonText color="primary">Terms of Service</IonText> and{" "}
				<IonText color="primary">Privacy Policy</IonText>.
			</p>
			<p className="fine-print">
				Already have an account?&nbsp;
				<IonRouterLink
					color="primary"
					routerLink="/login"
					style={{ textDecoration: "none" }}>
					Login Now
				</IonRouterLink>
				.
			</p>
		</>
	);

	//Render the fragment
	return <LRContainer title="Register" content={formContent} onSubmit={handleSubmit} />;
};

export default Register;
