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
		<section className="py-16 bg-primary text-textPrimary">
			<div className="container mx-auto px-6">
				{/* Section Header */}
				<div className="text-center">
					<h2 className="text-4xl lg:text-5xl font-bold lg:tracking-tight text-textPrimary">
						Key Features of Wraith Web
					</h2>
					<p className="text-lg mt-4 text-textSecondary">
						Explore the powerful features that make Wraith Web your go-to app for secure
						and seamless communication.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid sm:grid-cols-2 md:grid-cols-3 mt-16 gap-16">
					{features.map((item, index) => (
						<div key={index} className="flex gap-4 items-start">
							{/* Icon */}
							<div className="mt-1 bg-accent rounded-full p-3 w-12 h-12 shrink-0 flex items-center justify-center text-backgroundHighlight">
								<IonIcon icon={item.icon} className="w-6 h-6" />
							</div>
							{/* Feature Content */}
							<div>
								<h3 className="font-semibold text-lg text-textPrimary">{item.title}</h3>
								<p className="text-textSecondary mt-2 leading-relaxed">
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
