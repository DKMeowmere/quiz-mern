import express from "express"
import cors from "cors"
import env from "../config/envVariables.js"
import quizRouter from "../routes/quiz.js"
import userRouter from "../routes/user.js"
import morgan from "morgan"
import { setupCustomRequest } from "../middlewares/setupCustomRequest.js"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

function createServer() {
	const app = express()

	const __filename = fileURLToPath(import.meta.url)
	const __dirname = dirname(__filename)

	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())
	app.use(
		cors({
			methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "HEAD"],
			allowedHeaders: ["Content-Type", "Authorization"],
			origin: [env.CLIENT_APP_URL],
		})
	)
	env.NODE_ENV !== "test" && app.use(morgan("dev"))
	app.use((req, res, next) => setupCustomRequest(req, res, next))

	app.use("/healthcheck", (req, res) => res.status(200))
	app.use("/api/quiz", quizRouter)
	app.use("/api/user", userRouter)
	app.use("/static", express.static(path.join(__dirname, "../static")))
	// if (env.NODE_ENV !== "development") {
	app.use(express.static(path.join(__dirname, "../client")))

	app.use((req, res) => {
		res.status(200).sendFile(path.join(__dirname, "../client/index.html"))
	})
	// }

	return app
}

export default createServer
