import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";

const Settings: React.FC = () => (
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonTitle>Settings</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent>{/* Settings content goes here */}</IonContent>
	</IonPage>
);

export default Settings;
