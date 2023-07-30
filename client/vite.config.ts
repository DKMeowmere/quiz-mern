import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		host: "0.0.0.0",
		port: 3000,
		strictPort: true,
		watch: {
			usePolling: true,
		},
		proxy: {
			"/api": {
				target: "https:/127.0.0.1:4000",
				changeOrigin: true,
				secure: false,
				ws: true,
			},
		},
	},
	build: {
		outDir: "../server/dist/client",
	},
	plugins: [react()],
})
