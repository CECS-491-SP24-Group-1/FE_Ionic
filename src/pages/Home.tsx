import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonText,
	IonButton
} from "@ionic/react";

const Home: React.FC = () => (
	<IonPage>
		<IonContent className="ion-padding">
			{/* Welcome Message */}
			<IonText color="primary">
				<h1>Welcome to the App!</h1>
			</IonText>

			<IonText>
				<p>Use the tabs below to navigate between different sections of the app.</p>
			</IonText>

			{/* Button to explore other parts */}
			<IonButton expand="full" routerLink="/camera">
				Go to Camera
			</IonButton>
		</IonContent>
	</IonPage>
);

export default Home;
