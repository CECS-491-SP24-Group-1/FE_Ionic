import React, { useState } from "react";
import { IonItem, IonLabel, IonInput, IonButton, IonIcon } from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";

interface PassInputProps {
	pass: string;
	setPass: (value: string) => void;
	onUpdate?: (value: string) => void; // Optional function to call on update
	maxLen?: number;
	disable?: boolean;
}

const PassInput: React.FC<PassInputProps> = ({
	pass,
	setPass,
	onUpdate,
	maxLen,
	disable
}) => {
	const [showPassphrase, setShowPassphrase] = useState<boolean>(false);

	const togglePassphraseVisibility = () => {
		setShowPassphrase(!showPassphrase);
	};

	const handleInputChange = (event: CustomEvent) => {
		const newValue = event.detail.value!;
		setPass(newValue);
		if (onUpdate) {
			onUpdate(newValue); // Call the update function if provided
		}
	};

	return (
		<IonItem>
			<IonLabel position="stacked">
				Passphrase {pass === "" && <span className="required"></span>}
			</IonLabel>
			<IonInput
				type={showPassphrase ? "text" : "password"}
				value={pass}
				onIonInput={handleInputChange} // Use onIonInput for real-time update
				placeholder="Enter a passphrase"
				maxlength={maxLen ? maxLen : undefined}
				disabled={disable}
				required
			/>
			<IonButton slot="end" fill="clear" onClick={togglePassphraseVisibility}>
				<IonIcon icon={showPassphrase ? eyeOff : eye} />
			</IonButton>
		</IonItem>
	);
};

export default PassInput;
