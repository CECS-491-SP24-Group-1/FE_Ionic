import React from "react";
import heroImage from "@assets/images/glock_primary.svg"; // Replace with your image path
import { IonIcon } from "@ionic/react";
import { chatbubbleEllipses, camera } from "ionicons/icons";
import { useHistory } from "react-router-dom";

const Hero: React.FC = () => {
	const history = useHistory();

	// Navigation Function
	const navigate = (path: string) => {
		history.push(path);
	};

	return (
		<section className="grid place-items-center pb-12 pl-24 pr-24 pt-24 lg:grid-cols-2">
			{/* Hero Text */}
			<div className="order-last lg:order-first">
				<h1 className="text-5xl font-bold lg:text-6xl lg:tracking-tight xl:text-7xl xl:tracking-tighter">
					Experience Secure Messaging with{" "}
					<span className="text-accent dark:text-textAccent-light">Wraith Web</span>
				</h1>
				<p className="mt-4 max-w-xl text-lg font-medium text-textSecondary dark:text-textSecondary-light">
					Wraith Web provides private, end-to-end encrypted messaging and a secure camera,
					ensuring your privacy is always protected.
				</p>
				<div className="mt-6 flex flex-col gap-3 sm:flex-row">
					{/* Start Messaging Button */}
					<button
						className="flex transform items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-backgroundHighlight shadow-lg transition-transform hover:scale-105 dark:bg-accent-light dark:text-backgroundHighlight-light"
						onClick={() => navigate("/chat")} // Navigate to Chat Page
					>
						<IonIcon icon={chatbubbleEllipses} className="h-5 w-5" />
						Start Messaging
					</button>
					{/* Open Camera Button */}
					<button
						className="flex transform items-center gap-2 rounded-full bg-secondary-light px-6 py-3 font-semibold text-backgroundHighlight shadow-lg transition-transform hover:scale-105 dark:bg-secondary dark:text-backgroundHighlight-light"
						onClick={() => navigate("/camera")} // Navigate to Camera Page
					>
						<IonIcon icon={camera} className="h-5 w-5" />
						Open Camera
					</button>
				</div>
			</div>

			{/* Hero Image */}
			<div className="py-6 dark:invert">
				<img src={heroImage} alt="Secure communication illustration" />
			</div>
		</section>
	);
};

export default Hero;
