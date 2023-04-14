import express from "express"
import cors from "cors"
import env from "../config/envVariables"
import quizRouter from "../routes/quiz"
import morgan from "morgan"
import { setupCustomRequest } from "../middlewares/setupCustomRequest"

function createServer() {
	const app = express()

	app.use(express.json())
	app.use("/static", express.static("static"))
	app.use(
		cors({
			methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "HEAD"],
			allowedHeaders: ["Content-Type", "Authorization"],
			origin: [env.CLIENT_APP_URL],
		})
	)
	app.use(morgan("dev"))
	app.use((req, res, next) => setupCustomRequest(req, res, next))

	app.use("/api/quiz", quizRouter)

	app.use((req, res) => {
		res.status(404).json({ error: "not found" })
	})

	return app
}

export default createServer
