import express from "express"
import cors from "cors"
import path from "path"
import morgan from "morgan"
import { fileURLToPath } from "url"
import { dirname } from "path"
import { env } from "../config/envVariables.js"
import { router as quizRouter } from "../routes/quiz.js"
import { router as userRouter } from "../routes/user.js"
import { setupCustomRequest } from "../middlewares/setupCustomRequest.js"
import { resetServerAndDb } from "./resetServer.js"

export function createServer() {
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

	app.use("/healthcheck", (req, res) =>
		res.json({ message: "App is up and running" })
	)
	if (env.NODE_ENV !== "production") {
		app.use("/reset", (req, res) => resetServerAndDb(req, res))
	}

	app.use("/api/quiz", quizRouter)
	app.use("/api/user", userRouter)
	app.use("/static", express.static(path.join(__dirname, "../static")))
	app.use(express.static(path.join(__dirname, "../client")))

	app.use((req, res) => {
		if (env.NODE_ENV === "production") {
			res.status(200).sendFile(path.join(__dirname, "../client/index.html"))
		} else {
			res.redirect(env.CLIENT_APP_URL)
		}
	})

	return app
}
