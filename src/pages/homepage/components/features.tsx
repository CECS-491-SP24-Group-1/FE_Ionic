import React from "react";
import { IonIcon } from "@ionic/react";
import { lockClosed, camera, globeOutline } from "ionicons/icons";

const features = [
	{
		title: "End-to-End Encryption",
		description:
			"Your messages are secured with state-of-the-art encryption, ensuring privacy and security for every conversation.",
		icon: lockClosed
	},
	{
		title: "Secure Camera",
		description:
			"Capture and share moments safely with our encrypted camera feature. Your media stays private and protected.",
		icon: camera
	},
	{
		title: "Global Access",
		description:
			"Connect with anyone, anywhere in the world, with seamless and secure communication.",
		icon: globeOutline
	}
];

const Features: React.FC = () => {
	return (
		<section className="bg-primary bg-opacity-40 py-16 text-textPrimary dark:bg-primary-light dark:text-textPrimary-light">
			<div className="container mx-auto px-6">
				{/* Section Header */}
				<div className="text-center">
					<h2 className="text-4xl font-bold lg:text-5xl lg:tracking-tight xl:tracking-tighter">
						Key Features of{" "}
						<span className="text-accent dark:text-textAccent-light">Wraith Web</span>
					</h2>
					<p className="mt-4 text-lg font-medium text-textSecondary dark:text-textSecondary-light">
						Explore the powerful features that make Wraith Web your go-to app for secure
						and seamless communication.
					</p>
				</div>

				{/* Features Grid */}
				<div className="mt-16 grid gap-12 sm:grid-cols-2 md:grid-cols-3">
					{features.map((item, index) => (
						<div
							key={index}
							className="flex transform items-start gap-4 rounded-lg bg-backgroundHighlight p-6 shadow-lg transition-transform hover:scale-105 dark:bg-backgroundHighlight-light">
							{/* Icon */}
							<div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-backgroundHighlight dark:bg-accent-light dark:text-backgroundHighlight-light">
								<IonIcon icon={item.icon} className="h-6 w-6" />
							</div>
							{/* Feature Content */}
							<div>
								<h3 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-light">
									{item.title}
								</h3>
								<p className="mt-2 leading-relaxed text-textSecondary dark:text-textSecondary-light">
									{item.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;
