import { useState, useEffect } from "react";

/**
 * This hook replaces the `useColorScheme` from React Native, which detects the user's
 * system-wide color scheme (light or dark mode).
 *
 * Since React Native's API doesn't exist on the web, we use the `window.matchMedia` API,
 * which is available in modern browsers, to detect the color scheme on the web.
 *
 * This hook listens for changes to the user's system preference and updates the theme accordingly.
 */
export function useColorScheme() {
	// Initialize the color scheme based on the user's preference at the time of page load.
	const [colorScheme, setColorScheme] = useState(
		window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
	);

	useEffect(() => {
		// Set up a media query listener to detect changes in the color scheme preference.
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		// Update the state when the media query matches (i.e., when the user switches themes).
		const handleChange = (e: MediaQueryListEvent) => {
			setColorScheme(e.matches ? "dark" : "light");
		};

		// Add event listener to listen for theme changes
		mediaQuery.addEventListener("change", handleChange);

		// Cleanup event listener when component unmounts to avoid memory leaks.
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	return colorScheme; // Returns 'light' or 'dark' depending on the user's preference.
}
