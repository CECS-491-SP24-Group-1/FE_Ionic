import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const maxCacheSize = 10 * 1000000; // Increased to ~10MB

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			workbox: {
				maximumFileSizeToCacheInBytes: maxCacheSize
			},
			manifest: {
				name: "Wraith",
				short_name: "Wraith",
				start_url: "/",
				display: "standalone",
				background_color: "#ffffff",
				theme_color: "#3367D6", // Add your desired theme color here
				icons: [
					{
						src: "./public/favicon/favicon_64.png",
						sizes: "64x64",
						type: "image/png"
					},
					{
						src: "./public/favicon/favicon_128.png",
						sizes: "128x128",
						type: "image/png"
					},
					{
						src: "./public/favicon/favicon_256.png",
						sizes: "256x256",
						type: "image/png"
					},
					{
						src: "./public/favicon/favicon_512.png",
						sizes: "512x512",
						type: "image/png"
					}
				]
			}
		})
	],
	server: {
		cors: {
			origin: "*",
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true
		}
	},
	build: {
		target: "esnext",
		rollupOptions: {
			output: {
				manualChunks: {
					//Define your manual chunks here; this makes emitted JS files less heavyweight
					vendor_react: ["react", "react-dom"],
					vendor_ionic: ["@ionic/react", "@ionic/react-router"]
				}
			}
		}
	},
	optimizeDeps: {
		exclude: ["@vite/client", "@vite/env"]
	}
});
