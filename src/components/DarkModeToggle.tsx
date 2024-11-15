import { useEffect, useState } from "react";

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
		<button
			onClick={() => setIsDarkMode(!isDarkMode)}
			className="p-2 bg-primary text-white rounded dark:bg-primary-dark">
			Toggle Dark Mode
		</button>
	);
}

export default DarkModeToggle;
