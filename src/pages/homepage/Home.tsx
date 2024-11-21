import React from "react";
import Hero from "./components/hero"; // Adjust the import paths based on your project structure
import Features from "./components/features"; // Adjust the import paths based on your project structure
import Footer from "./components/footer"; // Adjust the import paths based on your project structure

const Home: React.FC = () => {
	return (
		<div className="bg-primary text-textPrimary overflow-y-auto h-screen">
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
