/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class", // Enable dark mode using the 'class' strategy
	theme: {
		extend: {
			fontSize: {
				"2xs": ["0.625rem", "0.75rem"],
				"3xs": ["0.5rem", "0.5rem"]
			},
			colors: {
				// Dark mode as default
				primary: {
					DEFAULT: "#1e1e2f", // Default dark mode primary background color
					light: "#f0f4f8" // Light mode primary background color
				},
				secondary: {
					DEFAULT: "#2a2a3c", // Default dark mode secondary background color
					light: "#e2e8f0" // Light mode secondary background color
				},
				accent: {
					DEFAULT: "#60a5fa", // Default dark mode accent color
					light: "#3b82f6" // Light mode accent color
				},

				// Text colors
				textPrimary: {
					DEFAULT: "#d1d5db", // Default dark mode primary text color (soft white)
					light: "#1a1a1a" // Light mode primary text color (dark gray)
				},
				textSecondary: {
					DEFAULT: "#9ca3af", // Default dark mode secondary text color (lighter gray)
					light: "#4b5563" // Light mode secondary text color (gray for subtext)
				},
				textAccent: {
					DEFAULT: "#60a5fa", // Default dark mode accent text color (lighter blue)
					light: "#3b82f6" // Light mode accent text color (blue for actionable text)
				},

				// Border colors
				borderPrimary: {
					DEFAULT: "#1e1e1e", // Default dark mode border color (dark gray)
					light: "#d1d6de" // Light mode border color (soft gray)
				},
				borderAccent: {
					DEFAULT: "#60a5fa", // Default dark mode accent border color (lighter blue)
					light: "#3b82f6" // Light mode accent border color (blue)
				},

				// Background highlights (e.g., for cards or elevated sections)
				backgroundHighlight: {
					DEFAULT: "#373740", // Default dark mode highlight background (slightly lighter gray)
					light: "#ffffff" // Light mode highlight background (pure white)
				},

				// Muted colors for placeholders, disabled states, etc.
				muted: {
					DEFAULT: "#6b7280", // Default dark mode muted color (dark gray)
					light: "#9ca3af" // Light mode muted color (medium gray)
				}
			},
			animation: {
				spotlight: "spotlight 2s ease .75s 1 forwards"
			},
			keyframes: {
				spotlight: {
					"0%": {
						opacity: 0,
						transform: "translate(-72%, -62%) scale(0.5)"
					},
					"100%": {
						opacity: 1,
						transform: "translate(-50%,-40%) scale(1)"
					}
				}
			}
		}
	},
	plugins: []
};
