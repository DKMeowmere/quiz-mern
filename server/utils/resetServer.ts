import User from "../models/user.js"
import Quiz from "../models/quiz.js"
import { CustomRequest } from "../types/customRequest.js"
import { Response } from "express"
import fs from "fs/promises"
import { removeFile } from "./removeFile.js"

export default async function resetServerAndDb(
	req: CustomRequest,
	res: Response
) {
	await User.deleteMany({})
	await Quiz.deleteMany({})

	const userFileList = await fs.readdir("./static/uploads/user")
	const quizFileList = await fs.readdir("./static/uploads/quiz")

	userFileList.forEach(async file => {
		if (file === ".gitkeep") {
			return
		}
		await removeFile(`./static/uploads/user/${file}`)
	})

	quizFileList.forEach(async file => {
		if (file === ".gitkeep") {
			return
		}
		await removeFile(`./static/uploads/quiz/${file}`)
	})

	res.json({ message: "server reseted" })
}
