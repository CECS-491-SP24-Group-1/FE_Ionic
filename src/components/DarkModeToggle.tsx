import { useEffect, useState } from "react";

function DarkModeToggle() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
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
