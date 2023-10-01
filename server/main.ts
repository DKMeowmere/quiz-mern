import mongoose from "mongoose"
import { env } from "./config/envVariables.js"
import { createServer } from "./utils/createServer.js"

async function start() {
	try {
		const app = createServer()
		mongoose.set("strictQuery", false)
		await mongoose.connect(env.MONGO_URI)
		console.log("Connected to db")
		app.listen(env.PORT)
		console.log(`Listening on port: ${env.PORT}`)
	} catch (err) {
		console.log(err)
	}
}
start()
