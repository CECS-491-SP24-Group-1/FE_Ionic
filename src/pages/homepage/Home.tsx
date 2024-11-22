import React from "react";
import Hero from "./components/hero";
import Features from "./components/features";
import Technologies from "./components/technologies";
import Footer from "./components/footer";
import { BackgroundBeams } from "@/components/background-beams";

const Home: React.FC = () => {
	return (
		<div className="h-screen overflow-y-auto text-textPrimary dark:text-textPrimary-light">
			{/* Hero Section */}
			<Hero />
			{/* Features Section */}
			<Features />
			{/* Technologies Section */}
			<Technologies />
			{/* Footer Section */}
			<Footer />
			{/* Background Beams */}
			<BackgroundBeams className="bg-Primary z-[-100] dark:bg-primary-light" />
		</div>
	);
};

export default Home;
