import { useState } from "react";
import { IonInput, IonButton, IonItem, IonLabel, IonText } from "@ionic/react";
import axios from "axios";
import { IonRouterLink } from "@ionic/react";
import { toast } from "react-toastify";

import LRContainer from "./LRContainer";
import { prettyError } from "../../util/http_util";

import "./LoginRegister.scss";

const PostRegister: React.FC = () => {
	//State stuff
	const [username, setUsername] = useState("");
	const [keystore, setKeyStore] = useState<InstanceType<typeof KeyStore> | null>(null); //TODO: zustand store here

	//Handles form submissions
	const handleSubmit = async (e: React.FormEvent) => {
		//Prevent the default form submission behavior
		e.preventDefault();
	}

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

			{/* Continue Button */}
			<IonButton shape="round" expand="full" type="submit" className="continue-button">
				Continue
			</IonButton>
		</>
	);

	//Render the fragment
	return <LRContainer title="Register" content={formContent} onSubmit={handleSubmit} />;
};

export default PostRegister;
