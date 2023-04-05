import morgan from "morgan"
import createServer from "./utils/createServer"
import mongoose from "mongoose"
import env from "./config/envVariables"

async function start() {
	try {
		const app = createServer()
		app.use(morgan("dev"))
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
