import React from "react";
import Hero from "./components/hero";
import Features from "./components/features";
import Footer from "./components/footer";
import { Spotlight } from "@/components/Spotlight";

const Home: React.FC = () => {
	return (
		<div className="bg-diagonal-grid-accent h-screen overflow-y-auto text-textPrimary dark:text-textPrimary-light">
			<Spotlight className="absolute left-[60rem] top-0 z-[-1] scale-[2]" fill="white" />
			{/* Hero Section */}
			<Hero />
			{/* Features Section */}
			<Features />
			{/* Footer Section */}
			<Footer />
		</div>
	);
};

export default Home;
