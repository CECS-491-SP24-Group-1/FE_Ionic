import { IonPage, IonContent } from "@ionic/react";
import { useEffect, useMemo, useState } from "react";

const Settings: React.FC = () => {
	/*
	const ks1 = useMemo(() => new KeyStore(), []);
	const ks2 = useMemo(() => new KeyStore(), []);
	const [areEqual, setAreEqual] = useState<boolean>(false);
	*/

	/*
	const x = new KeyStore();
	x.sk;
	x.
	*/

	/*
	useEffect(() => {
		setAreEqual(ks1.equals(ks2));
	}, [ks1, ks2]);
	*/

	return (
		<IonPage>
			<IonContent>
				<div style={{ padding: "1em" }}>
					<h1>Vaultlib sanity check</h1>
					{/* <code>{vaultlib.NewKeyStore().fingerprint}</code> */}
					<p>
						FE URL: <code>{import.meta.env.VITE_API_URL}</code>
						<br></br>
						{/*
						eq: <code>{areEqual.toString()}</code>
						<br></br>
						ks1 fp: <code>{ks1.fingerprint}</code>
						<br></br>
						ks2 fp: <code>{ks2.pk}</code>
						<br></br>
						*/}
					</p>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Settings;
