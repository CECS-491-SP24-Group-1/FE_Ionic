import React from "react";
import {
	IonPage,
	IonContent,
	IonGrid,
	IonRow,
	IonCol,
	IonImg,
	IonText,
	IonFooter,
	IonIcon
} from "@ionic/react";
import wraithmockup from "@/assets/images/wraith-mockup.png";
import { shieldCheckmarkOutline, lockClosedOutline, eyeOutline } from "ionicons/icons";

const AboutPage: React.FC = () => {
	return (
		<IonPage>
			{/* Main Content */}
			<IonContent className="bg-primary text-textPrimary dark:bg-primary-light dark:text-textPrimary-light">
				{/* Intro Section */}
				<div className="bg-secondary px-4 py-10 dark:bg-secondary-light">
					<IonGrid className="mx-auto max-w-7xl items-center">
						<IonRow className="flex items-center">
							{/* Left Column: Text */}
							<IonCol size="12" sizeLg="6" className="text-start">
								<IonText>
									<h1 className="mb-4 text-4xl font-bold text-textPrimary dark:text-textPrimary-light">
										About Us
									</h1>
									<p className="text-lg text-textSecondary dark:text-textSecondary-light">
										Privacy isn't just a feature—it's our foundation. We are redefining
										how you connect and communicate by combining cutting-edge encryption
										with a seamless user experience.
									</p>
								</IonText>
							</IonCol>

							{/* Right Column: Image */}
							<IonCol size="12" sizeLg="6" className="flex justify-center">
								<IonImg
									src={wraithmockup}
									alt="Wraith App Mockup"
									className="w-auto max-w-lg rounded-lg shadow-lg"
								/>
							</IonCol>
						</IonRow>
					</IonGrid>
				</div>

				{/* Mission and Story Section */}
				<IonGrid className="mx-auto bg-primary px-12 py-12 dark:bg-primary-light">
					<IonRow>
						<IonCol size="12" sizeLg="6">
							<IonText>
								<h2 className="mb-3 text-2xl font-bold text-textPrimary dark:text-textPrimary-light">
									Our Mission
								</h2>
								<p className="leading-relaxed text-textSecondary dark:text-textSecondary-light">
									Our mission is simple: to provide a space where you can communicate
									freely, knowing your privacy is protected at the highest level. We
									believe that everyone has the right to private conversations without
									compromise.
								</p>
							</IonText>
						</IonCol>

						<IonCol size="12" sizeLg="6">
							<IonText>
								<h2 className="mb-3 text-2xl font-bold text-textPrimary dark:text-textPrimary-light">
									Our Story
								</h2>
								<p className="leading-relaxed text-textSecondary dark:text-textSecondary-light">
									Wraith was created by a team of privacy advocates and technologists
									dedicated to protecting your digital rights. In a world where data is
									currency, we are committed to ensuring that your personal information
									remains yours—always.
								</p>
							</IonText>
						</IonCol>
					</IonRow>
				</IonGrid>

				{/* Why Choose Wraith Section */}
				<div className="bg-secondary py-12 dark:bg-secondary-light">
					<IonGrid className="mx-auto max-w-5xl px-4">
						<IonRow>
							<IonCol size="12">
								<IonText>
									<h2 className="mb-6 text-center text-2xl font-bold text-textPrimary dark:text-textPrimary-light">
										Why Choose Wraith?
									</h2>
								</IonText>
							</IonCol>
						</IonRow>
						<IonRow>
							{/* Top-of-the-Line Encryption */}
							<IonCol
								size="12"
								sizeMd="6"
								sizeLg="4"
								className="text-center text-textSecondary dark:text-textSecondary-light">
								<IonIcon
									icon={shieldCheckmarkOutline}
									className="mx-auto mb-4 h-12 w-12 text-accent dark:text-accent-light"></IonIcon>
								<IonText>
									<p>
										<strong>Top-of-the-Line Encryption:</strong> Your messages are
										protected with industry-leading protocols.
									</p>
								</IonText>
							</IonCol>

							{/* Zero Data Collection */}
							<IonCol
								size="12"
								sizeMd="6"
								sizeLg="4"
								className="text-center text-textSecondary dark:text-textSecondary-light">
								<IonIcon
									icon={lockClosedOutline}
									className="mx-auto mb-4 h-12 w-12 text-accent dark:text-accent-light"
								/>
								<IonText>
									<p>
										<strong>Zero Data Collection:</strong> We don't store your data, and
										we never will.
									</p>
								</IonText>
							</IonCol>

							{/* Transparency */}
							<IonCol
								size="12"
								sizeMd="6"
								sizeLg="4"
								className="text-center text-textSecondary dark:text-textSecondary-light">
								<IonIcon
									icon={eyeOutline}
									className="mx-auto mb-4 h-12 w-12 text-accent dark:text-accent-light"></IonIcon>
								<IonText>
									<p>
										<strong>Transparency:</strong> Our code and encryption practices are
										designed to be trustworthy and resilient.
									</p>
								</IonText>
							</IonCol>
						</IonRow>
					</IonGrid>
				</div>
			</IonContent>

			{/* Footer Section */}
			<IonFooter>
				<div className="bg-primary py-8 text-center text-textSecondary dark:bg-primary-light dark:text-textSecondary-light">
					<IonText>
						<p>
							Have questions or feedback? Reach out to us and help shape the future of
							secure communication.
						</p>
					</IonText>
				</div>
			</IonFooter>
		</IonPage>
	);
};

export default AboutPage;
