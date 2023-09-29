import fs from "fs/promises"
import path from "path"
import { HydratedDocument } from "mongoose"
import { CustomRequest } from "../../types/customRequest.js"
import { Quiz as QuizType } from "../../types/quiz.js"
import CustomError from "../../types/customError.js"
import { Question } from "../../types/question.js"
import { Answer } from "../../types/answer.js"
import { removeFile } from "../../utils/removeFile.js"
import { invalidFileName } from "../../utils/errors/universal.js"

export async function createMainQuizFile(
	req: CustomRequest,
	quiz: HydratedDocument<QuizType>
) {
	const fileIndex = req.pathToFilesProvidedOnLastReq!.findIndex(path => {
		const slash = process.platform === "win32" ? "\\" : "/"
		return path.split(slash).at(-1) === quiz.fileLocation
	})

	if (fileIndex === -1) {
		quiz.fileLocation = "/static/defaultQuiz.jpg"
		return
	}

	const filePath = req.pathToFilesProvidedOnLastReq![fileIndex]
	const fileName = filePath.split("/").at(-1)

	if (!fileName) {
		throw new CustomError(invalidFileName)
	}
	const { ext } = path.parse(fileName)

	const possibleExtensions = new Set([".jpg", ".png", ".jpeg"])

	if (!possibleExtensions.has(ext)) {
		quiz.fileLocation = "/static/uploads/defaultQuiz.jpg"
		return
	}

	const newFileName = `${quiz._id}${ext}`

	const absolutePathToFile = path.resolve(
		`./static/uploads/quiz/${newFileName}`
	)

	await fs.rename(filePath, absolutePathToFile)

	quiz.fileLocation = `/static/uploads/quiz/${newFileName}`
	req.pathToFilesAddedOnLastReq!.add(absolutePathToFile)
}

export async function createQuestionFile(
	req: CustomRequest,
	question: Question
) {
	const possibleQuestionFileTypes = new Set(["IMAGE", "AUDIO"])

	if (!possibleQuestionFileTypes.has(question.type)) {
		question.type = "TEXT"
		question.fileLocation = null
		return
	}

	const fileIndex = req.pathToFilesProvidedOnLastReq!.findIndex(path => {
		const slash = process.platform === "win32" ? "\\" : "/"
		return path.split(slash).at(-1) === question.fileLocation
	})

	if (fileIndex === -1) {
		question.type = "TEXT"
		question.fileLocation = null
		return
	}

	const file = req.pathToFilesProvidedOnLastReq![fileIndex]
	const fileName = file.split("/").at(-1)

	if (!fileName) {
		throw new CustomError(invalidFileName)
	}

	const fileObj = path.parse(fileName)
	const newFileName = `${question._id}${fileObj.ext}`

	const absolutePathToFile = path.resolve(
		`./static/uploads/quiz/${newFileName}`
	)

	await fs.rename(
		req.pathToFilesProvidedOnLastReq![fileIndex],
		absolutePathToFile
	)

	question.fileLocation = `/static/uploads/quiz/${newFileName}`
	req.pathToFilesProvidedOnLastReq![fileIndex] = absolutePathToFile
	req.pathToFilesAddedOnLastReq!.add(absolutePathToFile)
}

export async function createAnswerFile(req: CustomRequest, answer: Answer) {
	const possibleAnswerFileTypes = new Set(["IMAGE", "AUDIO"])

	if (!possibleAnswerFileTypes.has(answer.type)) {
		answer.type = "TEXT"
		answer.fileLocation = null
		return
	}

	const fileIndex = req.pathToFilesProvidedOnLastReq!.findIndex(path => {
		const slash = process.platform === "win32" ? "\\" : "/"
		return path.split(slash).at(-1) === answer.fileLocation
	})
	const file = req.pathToFilesProvidedOnLastReq![fileIndex]

	if (fileIndex === -1) {
		answer.type = "TEXT"
		answer.fileLocation = null
		return
	}

	const fileName = file.split("/").at(-1)

	if (!fileName) {
		throw new CustomError(invalidFileName)
	}

	const newFileName = `${answer._id}${path.extname(fileName)}`

	const absolutePathToFile = path.resolve(
		`./static/uploads/quiz/${newFileName}`
	)

	if (answer.fileLocation) {
		await removeFile(path.resolve(`.${answer.fileLocation}`))
	}

	await fs.rename(
		req.pathToFilesProvidedOnLastReq![fileIndex],
		absolutePathToFile
	)

	answer.fileLocation = `/static/uploads/quiz/${newFileName}`
	req.pathToFilesProvidedOnLastReq![fileIndex] = absolutePathToFile
	req.pathToFilesAddedOnLastReq!.add(absolutePathToFile)
}
