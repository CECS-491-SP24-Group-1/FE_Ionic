import React, { useRef, useEffect } from "react";

// Import your logos
import dockerLogo from "./logos/docker-tile.svg";
import golangLogo from "./logos/golang-icon.svg";
import ionicLogo from "./logos/ionicframework-icon.svg";
import mongodbLogo from "./logos/mongodb-icon.svg";
import reactLogo from "./logos/reactjs-icon.svg";
import redisLogo from "./logos/redis-icon.svg";
import tailwindLogo from "./logos/tailwindcss-icon.svg";
import typescriptLogo from "./logos/typescriptlang-icon.svg";
import viteLogo from "./logos/vitejsdev-icon.svg";

const logos = [
	{ src: dockerLogo, alt: "Docker" },
	{ src: golangLogo, alt: "Golang" },
	{ src: ionicLogo, alt: "Ionic" },
	{ src: mongodbLogo, alt: "MongoDB" },
	{ src: reactLogo, alt: "React" },
	{ src: redisLogo, alt: "Redis" },
	{ src: tailwindLogo, alt: "Tailwind CSS" },
	{ src: typescriptLogo, alt: "TypeScript" },
	{ src: viteLogo, alt: "Vite.js" }
];

const Technologies: React.FC = () => {
	const sliderRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Clone the logos to create an infinite loop effect
		const slider = sliderRef.current;
		if (slider) {
			const clone = slider.innerHTML;
			slider.innerHTML += clone;
		}
	}, []);

	return (
		<div className="relative overflow-hidden py-10">
			{/* Header Text */}
			<h2 className="mb-12 text-center text-2xl font-bold text-textPrimary dark:text-textPrimary-light">
				Built with modern tools and technologies
			</h2>

			{/* Gradient overlays */}
			<div className="absolute inset-y-0 left-0 z-10 w-80 bg-gradient-to-l from-transparent to-[#121212]"></div>
			<div className="absolute inset-y-0 right-0 z-10 w-80 bg-gradient-to-r from-transparent to-[#121212]"></div>

			{/* Sliding logos */}
			<div ref={sliderRef} className="logos-slide relative whitespace-nowrap">
				{logos.map((logo, index) => (
					<img
						key={index}
						src={logo.src}
						alt={logo.alt}
						className="mx-10 inline-block h-12"
					/>
				))}
			</div>
		</div>
	);
};

export default Technologies;
