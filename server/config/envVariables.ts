import { config } from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import { envSchema } from "../types/env"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config({ path: path.join(__dirname, `./env/.env.${process.env.NODE_ENV}`) })

//put your development.env, production.env, test.env in env dir
// type in /types/env

const unvalidatedEnv = {
	PORT: process.env.PORT,
	MONGO_URI: process.env.MONGO_URI,
	TOKEN_SECRET: process.env.TOKEN_SECRET,
	CLIENT_APP_URL: process.env.CLIENT_APP_URL,
}

const env = envSchema.parse(unvalidatedEnv)

export default env
