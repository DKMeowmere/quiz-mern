import { config } from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import { Env } from "../types/env"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config({ path: path.join(__dirname, `./env/.env.${process.env.NODE_ENV}`) })

//put your development.env, production.env, test.env in env dir
// type in /types/env

if (!process.env.PORT) {
	throw new Error("PORT env variable is undefined")
}
if (!process.env.MONGO_URI) {
	throw new Error("MONGO_URI env variable is undefined")
}
if (!process.env.TOKEN_SECRET) {
	throw new Error("TOKEN_SECRET env variable is undefined")
}
if (!process.env.CLIENT_APP_URL) {
	throw new Error("CLIENT_APP_URL env variable is undefined")
}

const env: Env = {
	PORT: process.env.PORT,
	MONGO_URI: process.env.MONGO_URI,
	TOKEN_SECRET: process.env.TOKEN_SECRET,
	CLIENT_APP_URL: process.env.CLIENT_APP_URL,
}

export default env
