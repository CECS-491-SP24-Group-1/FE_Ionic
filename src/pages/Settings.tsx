import { IonPage, IonContent } from "@ionic/react";
import { useEffect, useMemo, useState } from "react";

const Settings: React.FC = () => {
	const ks1 = useMemo(() => new KeyStore(), []);
	const ks2 = useMemo(() => new KeyStore(), []);
	const [areEqual, setAreEqual] = useState(null);

	useEffect(() => {
		setAreEqual(ks1.equals(ks2));
	}, [ks1, ks2]);

	return (
		<IonPage>
			<IonContent>
				<div style={{ padding: "1em" }}>
					<h1>Vaultlib sanity check</h1>
					{/* <code>{vaultlib.NewKeyStore().fingerprint}</code> */}
					<p>
						FE URL: <code>{import.meta.env.VITE_API_URL}</code>
						<br></br>
						eq: <code>{areEqual !== null ? areEqual.toString() : "<wait>"}</code>
						<br></br>
						<br></br>
					</p>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Settings;
