// src/components/DarkModeToggle.tsx
import React, { useState, useEffect } from "react";
import { IonToggle } from "@ionic/react";

const DarkModeToggle: React.FC = () => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
		const savedPreference = localStorage.getItem("isDarkMode");
		if (savedPreference !== null) {
			return JSON.parse(savedPreference) as boolean;
		}
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	});

	// Update the dark mode class and localStorage whenever isDarkMode changes
	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
	}, [isDarkMode]);

	return (
		<div>
			<IonToggle
				checked={isDarkMode}
				onIonChange={(e: CustomEvent) => setIsDarkMode(e.detail.checked)}
			/>
		</div>
	);
};

export default DarkModeToggle;
