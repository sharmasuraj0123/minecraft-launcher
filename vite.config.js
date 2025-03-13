// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			// When you call /api in your React app, Vite will forward the request to the target server.
			"/deploy": {
				target: "https://agentstarterkit-launcher-api.xo.builders", // Replace with your API's URL
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/deploy/, ""),
			},
		},
	},
});
