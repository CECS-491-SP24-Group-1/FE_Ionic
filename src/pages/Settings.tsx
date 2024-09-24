import { IonPage, IonContent } from "@ionic/react";

const Settings: React.FC = () => (
	<IonPage>
		<IonContent>
			<div style={{ padding: "1em" }}>
				<h1>Vaultlib sanity check</h1>
				<code>{vaultlib.Ed25519Keygen().fingerprint}</code>
				<p>
					FE URL: <code>{import.meta.env.VITE_API_URL}</code>
				</p>
			</div>
		</IonContent>
	</IonPage>
);

export default Settings;
