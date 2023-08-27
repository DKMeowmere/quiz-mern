import { defineConfig } from "cypress"
import { config } from "dotenv"

config()

export default defineConfig({
	e2e: {
		baseUrl: process.env.VITE_CLIENT_URL,
	},
	env: {
		SERVER_URL: process.env.VITE_SERVER_URL,
	},
})
