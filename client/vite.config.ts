import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "url"

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		host: "0.0.0.0",
		port: 3000,
		strictPort: true,
		watch: {
			usePolling: true,
		},
	},
	build: {
		outDir: "../server/dist/client",
	},
	plugins: [react()],
	resolve: {
		alias: [
			{
				find: "@backend",
				replacement: fileURLToPath(new URL("../server", import.meta.url)),
			},
		],
	},
})
