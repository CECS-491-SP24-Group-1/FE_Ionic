import React from "react";
import heroImage from "@assets/images/glock_primary.svg"; // Replace with your image path
import { IonIcon } from "@ionic/react";
import { chatbubbleEllipses, camera } from "ionicons/icons";

const Hero: React.FC = () => {
	return (
		<section className="grid lg:grid-cols-2 place-items-center pt-16 pb-8 md:pt-12 md:pb-24 bg-primary text-textPrimary">
			{/* Hero Image */}
			<div className="py-6 hidden md:block">
				<img
					src={heroImage}
					alt="Secure communication illustration"
					className="rounded-xl shadow-lg"
				/>
			</div>

			{/* Hero Text */}
			<div>
				<h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight xl:tracking-tighter">
					Experience Secure Messaging with <span className="text-accent">Wraith Web</span>
				</h1>
				<p className="text-lg mt-4 text-textSecondary max-w-xl">
					Wraith Web provides private, end-to-end encrypted messaging and a secure camera,
					ensuring your privacy is always protected.
				</p>
				<div className="mt-6 flex flex-col sm:flex-row gap-3">
					{/* Start Messaging Button */}
					<button
						className="px-6 py-3 bg-accent text-backgroundHighlight font-semibold rounded-full shadow-lg hover:scale-105 transform transition-transform flex items-center gap-2"
						onClick={() => (window.location.href = "/chat")} // Replace with your router link
					>
						<IonIcon icon={chatbubbleEllipses} className="w-5 h-5" />
						Start Messaging
					</button>
					{/* Open Camera Button */}
					<button
						className="px-6 py-3 bg-secondary text-backgroundHighlight font-semibold rounded-full shadow-lg hover:scale-105 transform transition-transform flex items-center gap-2"
						onClick={() => (window.location.href = "/camera")} // Replace with your router link
					>
						<IonIcon icon={camera} className="w-5 h-5" />
						Open Camera
					</button>
				</div>
			</div>
		</section>
	);
};

export default Hero;
