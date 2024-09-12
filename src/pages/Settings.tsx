import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";

const Settings: React.FC = () => (
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonTitle>Settings</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent>
			<div style={{ padding: "1em" }}>
				<h1>Vaultlib sanity check</h1>
				<code>{vaultlib.Ed25519Keygen()}</code>
			</div>
		</IonContent>
	</IonPage>
);

export default Settings;
