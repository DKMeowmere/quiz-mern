import express from "express"

function createServer() {
	const app = express()

	app.use(express.json())
	app.use((req, res) => {
		res.status(404).json({ error: "not found" })
	})

	return app
}

export default createServer
