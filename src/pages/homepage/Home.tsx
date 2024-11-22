import React from "react";
import { IonPage, IonContent } from "@ionic/react";
import Hero from "./components/hero";
import Features from "./components/features";
import Technologies from "./components/technologies";
import Footer from "./components/footer";
import { BackgroundBeams } from "@/components/background-beams";

const Home: React.FC = () => {
	return (
		<IonPage>
			<IonContent
				className="h-screen overflow-y-auto text-textPrimary dark:text-textPrimary-light"
				scrollEvents={true} // Enables scroll tracking if needed
			>
				{/* Hero Section */}
				<Hero />

				{/* Features Section */}
				<Features />

				{/* Technologies Section */}
				<Technologies />

				{/* Footer Section */}
				<Footer />

				{/* Background Beams */}
				<BackgroundBeams className="z-[-100] bg-primary bg-transparent dark:bg-primary-light" />
			</IonContent>
		</IonPage>
	);
};

export default Home;
