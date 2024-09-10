import {useState, useEffect} from "react";
import {Colors} from "../constants/Colors"; // Adjust the path based on your project structure

/**
 * This hook is used to retrieve the appropriate color based on the current theme (light/dark).
 *
 * It works by:
 * 1. Detecting the current theme (light or dark) using the `useColorScheme` hook (ported for web).
 * 2. Checking if the component has passed custom `light` or `dark` colors via props.
 * 3. If no custom colors are passed, it defaults to the color values from the global `Colors` object.
 */
export function useThemeColor(
	props: {light?: string; dark?: string},
	colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
	// Ported useColorScheme hook using window.matchMedia for web
	const [theme, setTheme] = useState<"light" | "dark">(
		window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
	);

	useEffect(() => {
		// Listen for changes in the color scheme preference (light or dark)
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e: MediaQueryListEvent) => {
			setTheme(e.matches ? "dark" : "light");
		};

		mediaQuery.addEventListener("change", handleChange);

		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	// Get the color from props or fallback to Colors object based on the current theme
	const colorFromProps = props[theme];

	// If a color is passed via props, use it; otherwise, use the color from the Colors object
	if (colorFromProps) {
		return colorFromProps;
	} else {
		return Colors[theme][colorName];
	}
}
