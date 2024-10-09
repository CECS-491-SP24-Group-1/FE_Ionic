import { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonInput, IonButton, IonItem, IonLabel, IonText } from "@ionic/react";
import axios from "axios";
import { IonRouterLink } from "@ionic/react";
import { toast } from "react-toastify";

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

	//Handles form submissions
	const handleSubmit = async (e: React.FormEvent) => {
		//Prevent the default form submission behavior
		e.preventDefault();

		// Take the user back to the login page
		history.push("/login");
		window.location.reload(); // Remove this when Zustand is implemented
	};

	//Holds the form content to render
	const formContent = (
		<>
			{/* Username Input */}
			<IonItem>
				<IonLabel position="stacked">
					Passphrase {passphrase === "" && <span style={{ color: "red" }}>*</span>}
				</IonLabel>
				<IonInput
					value={passphrase}
					onIonChange={(e: CustomEvent) => setPassphrase(e.detail.value!)}
					required
				/>
			</IonItem>

			{/* Continue Button */}
			<IonButton shape="round" expand="full" type="submit" className="continue-button">
				Continue
			</IonButton>
		</>
	);

	//Render the fragment
	return <LRContainer title="Account Created" content={formContent} onSubmit={handleSubmit} />;
};

export default PostRegister;
