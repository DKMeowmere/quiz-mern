import { CustomRequest } from "../types/customRequest"
import { Response } from "express"
import { Quiz as QuizType, quizSchema } from "../types/quiz"
import CustomError from "../types/customError"
import env from "../config/envVariables"
import Quiz from "../models/quiz"
import { removeFile, removeFiles } from "../utils/removeFile"
import fs from "fs/promises"
import path from "path"
import { HydratedDocument } from "mongoose"
import mongoose from "mongoose"

export async function getQuizes(req: CustomRequest, res: Response) {
	try {
		const { limit } = req.query
		const quizes = await Quiz.find()
			.sort({ createdAt: -1 })
			.limit(parseInt(limit?.toString() || "0"))

		if (!quizes) {
			throw new CustomError({
				message: "Nie znaleziono żadnego quizu",
				statusCode: 404,
			})
		}

		res.json(quizes)
	} catch (err) {
		env.NODE_ENV === "development" && console.log(err)

		if (err instanceof CustomError) {
			res.status(err.statusCode).json({ error: err.message })
		} else {
			res.status(400).json({ error: env.UNIVERSAL_ERROR_MESSAGE })
		}
	}
}

export async function createQuiz(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError({
				message:
					"Plik nie może zawierać '/' oraz musi posiadać rozszerzenie .jpg  .jpeg, .png lub .mp3",
				statusCode: 400,
			})
		}

		const { title, questions } = req.body
		const result = quizSchema.safeParse({
			title,
			questions: JSON.parse(questions),
		})

		if (result.success === false) {
			throw new CustomError({ message: result.error.message, statusCode: 400 })
		}
		const body = result.data

		const quiz = await Quiz.create(body)

		await handleMainQuizFile(req, quiz)
		await handleQuizQuestionFiles(req, quiz)
		await handleQuizAnswerFiles(req, quiz)
		await quiz.save()
		res.status(201).json(quiz)

		req.pathToFilesProvidedOnLastReq?.forEach(async path => {
			if (!req.pathToFilesAddedOnLastReq?.includes(path)) {
				await removeFile(path)
			}
		})
	} catch (err) {
		env.NODE_ENV === "development" && console.log(err)

		if (err instanceof CustomError) {
			res.status(err.statusCode).json({ error: err.message })
		} else {
			res.status(400).json({ error: env.UNIVERSAL_ERROR_MESSAGE })
		}
		await removeFiles(req.pathToFilesProvidedOnLastReq || [])
	}
}

export async function getQuiz(req: CustomRequest, res: Response) {
	try {
		const { id } = req.params

		if (!id) {
			throw new CustomError({ message: "brak id quizu", statusCode: 400 })
		}

		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError({ message: "nie poprawne id", statusCode: 400 })
		}

		const quiz = await Quiz.findById(id)

		if (!quiz) {
			throw new CustomError({
				message: "Nie znaleziono quizu",
				statusCode: 404,
			})
		}

		res.json(quiz)
	} catch (err) {
		env.NODE_ENV === "development" && console.log(err)

		if (err instanceof CustomError) {
			res.status(err.statusCode).json({ error: err.message })
		} else {
			res.status(400).json({ error: env.UNIVERSAL_ERROR_MESSAGE })
		}
		await removeFiles(req.pathToFilesProvidedOnLastReq || [])
	}
}

export async function updateQuiz(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError({
				message:
					"Plik nie może zawierać '/' oraz musi posiadać rozszerzenie .jpg  .jpeg, .png lub .mp3",
				statusCode: 400,
			})
		}

		const { id } = req.params
		const { title, questions } = req.body

		const result = quizSchema.safeParse({
			title,
			questions: JSON.parse(questions),
		})

		if (result.success === false) {
			throw new CustomError({ message: result.error.message, statusCode: 400 })
		}
		const body = result.data

		if (!id) {
			throw new CustomError({ message: "brak id quizu", statusCode: 400 })
		}

		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError({ message: "nie poprawne id", statusCode: 400 })
		}

		const quiz = await Quiz.findByIdAndUpdate(id, body)

		if (!quiz) {
			throw new CustomError({
				message: "Nie znaleziono quizu",
				statusCode: 404,
			})
		}

		await handleMainQuizFile(req, quiz)
		await handleQuizQuestionFiles(req, quiz)
		await handleQuizAnswerFiles(req, quiz)
		await quiz.save()

		const updatedQuiz = await Quiz.findById(id)
		res.json(updatedQuiz)

		req.pathToFilesProvidedOnLastReq?.forEach(async path => {
			if (!req.pathToFilesAddedOnLastReq?.includes(path)) {
				await removeFile(path)
			}
		})
	} catch (err) {
		env.NODE_ENV === "development" && console.log(err)

		if (err instanceof CustomError) {
			res.status(err.statusCode).json({ error: err.message })
		} else {
			res.status(400).json({ error: env.UNIVERSAL_ERROR_MESSAGE })
		}
		await removeFiles(req.pathToFilesProvidedOnLastReq || [])
	}
}

export async function deleteQuiz(req: CustomRequest, res: Response) {
	try {
		const { id } = req.params

		if (!id) {
			throw new CustomError({ message: "brak id quizu", statusCode: 400 })
		}

		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError({ message: "nie poprawne id", statusCode: 400 })
		}

		const quiz = await Quiz.findByIdAndDelete(id)

		if (!quiz) {
			throw new CustomError({
				message: "Nie znaleziono quizu",
				statusCode: 404,
			})
		}

		const mainFilePath = path.resolve(`.${quiz.fileLocation}`)
		await removeFile(mainFilePath)

		for (let i = 0; i < quiz.questions.length; i++) {
			const question = quiz.questions[i]
			const questionFilePath = path.resolve(`.${question.fileLocation}`)
			question.fileLocation && (await removeFile(questionFilePath))

			for (let j = 0; j < question.answers.length; j++) {
				const answer = question.answers[j]
				const answerFilePath = path.resolve(`.${answer.fileLocation}`)
				answer.fileLocation && (await removeFile(answerFilePath))
			}
		}

		res.json(quiz)
	} catch (err) {
		env.NODE_ENV === "development" && console.log(err)

		if (err instanceof CustomError) {
			res.status(err.statusCode).json({ error: err.message })
		} else {
			res.status(400).json({ error: env.UNIVERSAL_ERROR_MESSAGE })
		}
	}
}

async function handleMainQuizFile(
	req: CustomRequest,
	quiz: HydratedDocument<QuizType>
) {
	if (quiz.fileLocation) {
		await removeFile(path.resolve(`.${quiz.fileLocation}`))
	}

	const pathToMainImage = req.pathToFilesProvidedOnLastReq?.find(path =>
		path.split("/").at(-1)?.startsWith("quiz-main")
	)

	if (!pathToMainImage) {
		throw new CustomError({
			message: "Nie znaleziono głównego zdjęcia quizu",
			statusCode: 400,
		})
	}

	const fileName = pathToMainImage.split("/").at(-1)
	const quizMainStringLength = "quiz-main-".length

	if (!fileName) {
		throw new CustomError({
			message: "Zła nazwa pliku",
			statusCode: 400,
		})
	}

	const newFileName = `${
		path.parse(fileName.slice(quizMainStringLength)).name
	}-${quiz._id}${path.extname(fileName)}`

	const absolutePathToFile = path.resolve(
		`./static/uploads/quiz/${newFileName}`
	)

	await fs.rename(pathToMainImage, absolutePathToFile)

	quiz.fileLocation = `/static/uploads/quiz/${newFileName}`
	req.pathToFilesAddedOnLastReq?.push(absolutePathToFile)
}

async function handleQuizQuestionFiles(
	req: CustomRequest,
	quiz: HydratedDocument<QuizType>
) {
	//file name should look like question-{question-number}-filename.extension
	//after renaming it should look like filename-{question-id}.extension
	if (!req.pathToFilesProvidedOnLastReq) {
		return
	}

	for (let i = 0; i < quiz.questions.length; i++) {
		const question = quiz.questions[i]
		const possibleQuestionFileTypes = ["IMAGE", "AUDIO"]

		if (!possibleQuestionFileTypes.includes(question.type)) {
			continue
		}

		const fileIndex = req.pathToFilesProvidedOnLastReq.findIndex(path =>
			path.split("/").at(-1)?.startsWith(`question-${i}`)
		)
		const file = req.pathToFilesProvidedOnLastReq[fileIndex]

		if (!file) {
			throw new CustomError({
				message: `Nie znaleziono pliku dla pytania: '${question.title}'`,
				statusCode: 400,
			})
		}

		const fileName = file.split("/").at(-1)

		if (!fileName) {
			throw new CustomError({
				message: "Zła nazwa pliku",
				statusCode: 400,
			})
		}

		const questionStringLength = "question".length
		const questionIndexLength = fileName.split("-")[1].length
		const dashNumberToTruncate = 2
		const numberToTruncate =
			questionStringLength + questionIndexLength + dashNumberToTruncate
		const filenameWithTruncatedStart = fileName.slice(numberToTruncate)

		const newFileName = `${path.parse(filenameWithTruncatedStart).name}-${
			question._id
		}${path.extname(fileName)}`

		const absolutePathToFile = path.resolve(
			`./static/uploads/quiz/${newFileName}`
		)

		if (question.fileLocation) {
			await removeFile(path.resolve(`.${question.fileLocation}`))
		}

		await fs.rename(
			req.pathToFilesProvidedOnLastReq[fileIndex],
			absolutePathToFile
		)

		question.fileLocation = `/static/uploads/quiz/${newFileName}`
		req.pathToFilesProvidedOnLastReq[fileIndex] = absolutePathToFile
		req.pathToFilesAddedOnLastReq?.push(absolutePathToFile)
	}
}

async function handleQuizAnswerFiles(
	req: CustomRequest,
	quiz: HydratedDocument<QuizType>
) {
	//file name should look like answer-{questionNumber}-{answerNumber}-filename.extension
	//after renaming it should look like filename-{answer-id}.extension
	if (!req.pathToFilesProvidedOnLastReq) {
		return
	}

	for (let i = 0; i < quiz.questions.length; i++) {
		const question = quiz.questions[i]

		for (let j = 0; j < question.answers.length; j++) {
			const answer = question.answers[j]
			const possibleAnswerFileTypes = ["IMAGE", "AUDIO"]

			if (!possibleAnswerFileTypes.includes(answer.type)) {
				continue
			}

			const fileIndex = req.pathToFilesProvidedOnLastReq.findIndex(path =>
				path.split("/").at(-1)?.startsWith(`answer-${i}-${j}`)
			)
			const file = req.pathToFilesProvidedOnLastReq[fileIndex]

			if (!file) {
				throw new CustomError({
					message: `Nie znaleziono pliku dla pytania: '${question.title} dla odpowiedzi ${answer.title}'`,
					statusCode: 400,
				})
			}

			const fileName = file.split("/").at(-1)

			if (!fileName) {
				throw new CustomError({
					message: "Zła nazwa pliku",
					statusCode: 400,
				})
			}

			const answerStringLength = "answer".length
			const questionIndexLength = fileName.split("-")[1].length
			const answerIndexLength = fileName.split("-")[2].length
			const dashNumberToTruncate = 3
			const numberToTruncate =
				answerStringLength +
				questionIndexLength +
				answerIndexLength +
				dashNumberToTruncate
			const filenameWithTruncatedStart = fileName.slice(numberToTruncate)

			const newFileName = `${path.parse(filenameWithTruncatedStart).name}-${
				answer._id
			}${path.extname(fileName)}`

			const absolutePathToFile = path.resolve(
				`./static/uploads/quiz/${newFileName}`
			)

			if (answer.fileLocation) {
				await removeFile(path.resolve(`.${answer.fileLocation}`))
			}

			await fs.rename(
				req.pathToFilesProvidedOnLastReq[fileIndex],
				absolutePathToFile
			)

			answer.fileLocation = `/static/uploads/quiz/${newFileName}`
			req.pathToFilesProvidedOnLastReq[fileIndex] = absolutePathToFile
			req.pathToFilesAddedOnLastReq?.push(absolutePathToFile)
		}
	}
}
