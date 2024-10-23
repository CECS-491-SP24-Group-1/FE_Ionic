import React from "react";
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonText,
	IonButton,
	IonFooter
} from "@ionic/react";

const LandingPage: React.FC = () => (
	<IonPage>
		{/* Header */}
		<IonHeader>
			<IonToolbar>
				<IonTitle>Wraith</IonTitle>
			</IonToolbar>
		</IonHeader>

		{/* Content */}
		<IonContent className="ion-padding">
			{/* Hero Section */}
			<div className="hero">
				<IonText color="primary">
					<h1>Welcome to Wraith!</h1>
				</IonText>
				<IonText>
					<p>Discover the amazing features we offer to make your experience better.</p>
				</IonText>
				<IonButton expand="full" routerLink="/features">
					Learn More
				</IonButton>
			</div>

			{/* Features Section */}
			<div id="features" className="section">
				<IonText>
					<h2>Features</h2>
					<p>Explore our awesome features that can help you achieve your goals faster.</p>
				</IonText>
			</div>

			{/* About Section */}
			<div id="about" className="section">
				<IonText>
					<h2>About Us</h2>
					<p>We are dedicated to providing top-notch services that satisfy your needs.</p>
				</IonText>
			</div>

			{/* Contact Section */}
			<div id="contact" className="section">
				<IonText>
					<h2>Contact Us</h2>
					<p>Have questions? Get in touch with us anytime.</p>
				</IonText>
			</div>
		</IonContent>

		{/* Footer */}
		<IonFooter>
			<IonToolbar>
				<IonText className="footer-text">© 2024 MyLanding. All rights reserved.</IonText>
			</IonToolbar>
		</IonFooter>
	</IonPage>
);

export default LandingPage;
