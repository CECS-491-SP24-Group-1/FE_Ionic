import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonText,
	IonButton
} from "@ionic/react";
import logo from "@assets/images/glock_primary.svg";
import "./Home.scss";

const Home: React.FC = () => (
	<IonPage>
		<IonContent>
			{/* Welcome Message */}
			<IonText className="heading" color="primary">
				<img src={logo} alt="Wraith Logo" className="logo" />
				<h1>Wraith</h1>
			</IonText>

			<IonText className="infoText">
				<p>Use the tabs below to navigate between different sections of the app.</p>
			</IonText>
		</IonContent>
	</IonPage>
);

export default Home;
