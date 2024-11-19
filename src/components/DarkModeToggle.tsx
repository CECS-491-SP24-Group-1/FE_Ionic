import { useEffect, useState } from "react";
import { IonToggle } from "@ionic/react";

function DarkModeToggle() {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		// Initialize based on localStorage or system preference
		const savedPreference = localStorage.getItem("isDarkMode");
		if (savedPreference !== null) {
			return JSON.parse(savedPreference);
		} else {
			return (
				window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
			);
		}
	});

	useEffect(() => {
		// Update the dark mode class and save preference in localStorage
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("isDarkMode", JSON.stringify(true));
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("isDarkMode", JSON.stringify(false));
		}
	}, [isDarkMode]);

	return (
		<IonToggle
			checked={isDarkMode}
			onIonChange={(e: CustomEvent) => setIsDarkMode(e.detail.checked)}
		/>
	);
}

export default DarkModeToggle;
