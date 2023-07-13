import { CustomRequest } from "../types/customRequest.js"
import { Response } from "express"
import { Quiz as QuizType, quizSchema } from "../types/quiz.js"
import CustomError from "../types/customError.js"
import Quiz from "../models/quiz.js"
import { removeFile } from "../utils/removeFile.js"
import fs from "fs/promises"
import path from "path"
import { HydratedDocument } from "mongoose"
import mongoose from "mongoose"
import { handleControllerError } from "../utils/handleControllerError.js"

export async function getQuizes(req: CustomRequest, res: Response) {
	try {
		const { limit, creatorId } = req.query
		const queryFilter = creatorId ? { creatorId } : {}
		const quizes = await Quiz.find(queryFilter)
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
		await handleControllerError(req, res, err)
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

		if (!req.user) {
			throw new CustomError({
				message: "nie znaleziono użytkownika",
				statusCode: 401,
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

		const quiz = await Quiz.create({ ...body, creatorId: req.user._id })

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
		await handleControllerError(req, res, err)
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
		await handleControllerError(req, res, err)
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

		if (!req.user) {
			throw new CustomError({
				message: "nie znaleziono użytkownika",
				statusCode: 401,
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

		const quiz = await Quiz.findById(id)

		if (!quiz) {
			throw new CustomError({
				message: "Nie znaleziono quizu",
				statusCode: 404,
			})
		}

		if (quiz.creatorId !== req.user._id?.toString()) {
			throw new CustomError({
				message:
					"Nie możesz zaaktualizować quizu, który nie jest przypisany do twojego konta",
				statusCode: 403,
			})
		}

		quiz.title = body.title
		quiz.questions = body.questions
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
		await handleControllerError(req, res, err)
	}
}

export async function deleteQuiz(req: CustomRequest, res: Response) {
	try {
		if (!req.user) {
			throw new CustomError({
				message: "nie znaleziono użytkownika",
				statusCode: 401,
			})
		}

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

		if (quiz.creatorId !== req.user._id?.toString()) {
			throw new CustomError({
				message:
					"Nie możesz usunąć quizu, który nie jest przypisany do twojego konta",
				statusCode: 403,
			})
		}

		await Quiz.findByIdAndDelete(id)
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
		await handleControllerError(req, res, err)
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
