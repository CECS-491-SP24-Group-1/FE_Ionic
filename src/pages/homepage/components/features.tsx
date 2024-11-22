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
		<section className="bg-primary py-16 text-textPrimary">
			<div className="container mx-auto px-6">
				{/* Section Header */}
				<div className="text-center">
					<h2 className="text-4xl font-bold text-textPrimary lg:text-5xl lg:tracking-tight">
						Key Features of Wraith Web
					</h2>
					<p className="mt-4 text-lg text-textSecondary">
						Explore the powerful features that make Wraith Web your go-to app for secure
						and seamless communication.
					</p>
				</div>

				{/* Features Grid */}
				<div className="mt-16 grid gap-16 sm:grid-cols-2 md:grid-cols-3">
					{features.map((item, index) => (
						<div key={index} className="flex items-start gap-4">
							{/* Icon */}
							<div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent p-3 text-backgroundHighlight">
								<IonIcon icon={item.icon} className="h-6 w-6" />
							</div>
							{/* Feature Content */}
							<div>
								<h3 className="text-lg font-semibold text-textPrimary">{item.title}</h3>
								<p className="mt-2 leading-relaxed text-textSecondary">
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
