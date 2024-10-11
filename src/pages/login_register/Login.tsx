import { useState } from "react";
import { IonInput, IonButton, IonItem, IonLabel, IonText } from "@ionic/react";

import LRContainer from "./components/LRContainer";
import { prettyError } from "../../util/http_util";

import "./LoginRegister.scss";
import PassInput from "./components/PassInput";

interface LoginProps {
	togglePage: () => void;
}

const Login: React.FC<LoginProps> = ({ togglePage }) => {
	//State stuff
	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");

	//Handles form submissions
	const handleSubmit = async (e: React.FormEvent) => {
		//Prevent the default form submission behavior
		e.preventDefault();

		// Handle the form submission logic
	};

	//Holds the form content to render
	const formContent = (
		<>
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

			{/* Passphrase Input */}
			<PassInput pass={pass} setPass={setPass} />

			{/* Continue Button */}
			<IonButton shape="round" expand="full" type="submit" className="continue-button">
				Continue
			</IonButton>

			<p className="fine-print">
				No account?&nbsp;
				<IonText color="primary" onClick={togglePage} style={{ cursor: "pointer" }}>
					Register now
				</IonText>
				.
			</p>
		</>
	);

	//Render the fragment
	return <LRContainer title="Login" content={formContent} onSubmit={handleSubmit} />;
};

export default Login;
