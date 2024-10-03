//TODO: move to container page for registration/signup

import { useState } from "react";
import {
	IonPage,
	IonContent,
	IonInput,
	IonButton,
	IonItem,
	IonLabel,
	IonText
} from "@ionic/react";
import "./LoginRegister.scss";
import axios from "axios";
import { IonRouterLink } from "@ionic/react";
import LRLogo from "./LRLogo";
import { toast } from "react-toastify";

import { prettyError } from "../../util/http_util";

const Register: React.FC = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [keystore, setKeyStore] = useState<InstanceType<typeof KeyStore> | null>(null);
	const [showFingerprint, setShowFingerprint] = useState(false);
	const [isKGBtnDisabled, setIsKGBtnDisabled] = useState(false);

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
			toast.info(`Successfully created user ${user.username} <${user.id}>`);
			console.log(user);
		} catch (error: any) {
			const response: HttpResponse<any> = error.response.data;
			console.error("Error creating account:", prettyError(response));
			toast.error(`Failed to create account: ${prettyError(response)}`);
		}
	};

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

	return (
		<IonPage>
			<IonContent className="registration-page">
				<LRLogo></LRLogo>
				<div className="registration-container">
					<h2>Create an account</h2>

					{/* Registration Form */}
					<form onSubmit={handleSubmit}>
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
						<IonButton
							shape="round"
							expand="full"
							type="submit"
							className="continue-button">
							Continue
						</IonButton>

						{/* Footer Text */}
						<p className="terms-text">
							By registering, you agree to Wraith’s{" "}
							<IonText color="primary">Terms of Service</IonText> and{" "}
							<IonText color="primary">Privacy Policy</IonText>.
						</p>
						<p className="login-text">
							Already have an account?&nbsp;
							<IonRouterLink
								color="primary"
								routerLink="/login"
								style={{ textDecoration: "none" }}>
								Login Now
							</IonRouterLink>
							.
						</p>
					</form>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Register;
