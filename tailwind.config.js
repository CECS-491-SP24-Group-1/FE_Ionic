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
