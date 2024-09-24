import { IonPage, IonContent } from "@ionic/react";

const Settings: React.FC = () => {
	const myobj = NewMyObject("this is a test");

	return (
		<IonPage>
			<IonContent>
				<div style={{ padding: "1em" }}>
					<h1>Vaultlib sanity check</h1>
					<code>{vaultlib.NewKeyStore().fingerprint}</code>
					<p>
						FE URL: <code>{import.meta.env.VITE_API_URL}</code>
						<br></br>
						<code>{myobj.foo}</code>
						<br></br>
						<code>{myobj.getFoo()}</code>
					</p>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Settings;
