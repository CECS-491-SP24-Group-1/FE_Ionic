/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontSize: {
				"2xs": ["0.625rem", "0.75rem"],
				"3xs": ["0.5rem", "0.5rem"]
			}
		}
	},
	plugins: []
};

module.exports = {
	darkMode: "class", // Enable dark mode using the 'dark' class
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#3880ff", // Light mode primary background color
					dark: "#428cff" // Dark mode primary background color
				},
				secondary: {
					DEFAULT: "#3dc2ff", // Light mode secondary background color
					dark: "#50c8ff" // Dark mode secondary background color
				},
				textPrimary: {
					DEFAULT: "#1a1a1a", // Light mode primary text color (dark gray)
					dark: "#f5f5f5" // Dark mode primary text color (light gray)
				},
				textSecondary: {
					DEFAULT: "#4b5563", // Light mode secondary text color (gray)
					dark: "#9ca3af" // Dark mode secondary text color (lighter gray)
				}
			}
		}
	},
	plugins: []
};
