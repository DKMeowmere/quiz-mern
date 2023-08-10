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
import { questionTypeSet } from "../types/question.js"
import hasTrueAnswer from "../utils/quiz/hasTrueAnswer.js"
import { answerTypeSet } from "../types/answer.js"

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

		const { title, questions, fileLocation } = req.body

		const result = quizSchema.safeParse({
			title,
			questions: JSON.parse(questions),
			fileLocation,
		})

		if (result.success === false) {
			throw new CustomError({ message: result.error.message, statusCode: 400 })
		}
		const body = result.data

		for (let i = 0; i < body.questions.length; i++) {
			const question = body.questions[i]

			if (!hasTrueAnswer(question.answers)) {
				throw new CustomError({
					message: `Brak podpawnej odpowiedzi dla pytania: ${question.title}`,
					statusCode: 400,
				})
			}
		}

		const quiz = await Quiz.create({ ...body, creatorId: req.user._id })

		await handleMainQuizFile(req, quiz)
		await handleQuizQuestionFiles(req, quiz)
		await handleQuizAnswerFiles(req, quiz)
		await quiz.save()

		req.pathToFilesProvidedOnLastReq!.forEach(async path => {
			if (!req.pathToFilesAddedOnLastReq!.has(path)) {
				await removeFile(path)
			}
		})

		res.status(201).json(quiz)
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
		const { title } = req.body

		if (!title) {
			throw new CustomError({ message: "Brak tytułu quizu", statusCode: 400 })
		}

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

		if (req.file) {
			const prevFilePath = req.file.path
			const newFileName = `${quiz._id}${path.extname(req.file.originalname)}`
			const absolutePathToFile = path.resolve(
				`./static/uploads/quiz/${newFileName}`
			)
			await fs.rename(prevFilePath, absolutePathToFile)
		}

		const updatedQuiz = await Quiz.findByIdAndUpdate(
			id,
			{
				title,
			},
			{ new: true }
		)

		res.json(updatedQuiz)

		req.pathToFilesProvidedOnLastReq?.forEach(async path => {
			if (!req.pathToFilesAddedOnLastReq!.has(path)) {
				await removeFile(path)
			}
		})
	} catch (err) {
		await handleControllerError(req, res, err)
	}
}

export async function updateQuizQuestion(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError({
				message:
					"Plik nie może zawierać '/' oraz musi posiadać rozszerzenie .jpg  .jpeg, .png lub .mp3",
				statusCode: 400,
			})
		}

		const { quizId, questionId } = req.params
		const { title, type } = req.body

		if (!mongoose.isValidObjectId(quizId)) {
			throw new CustomError({
				message: "Niepoprawne id quizu",
				statusCode: 400,
			})
		}

		if (!mongoose.isValidObjectId(questionId)) {
			throw new CustomError({
				message: "Niepoprawne id quizu",
				statusCode: 400,
			})
		}

		if (!title) {
			throw new CustomError({ message: "Brak tytułu pytania", statusCode: 400 })
		}

		if (!questionTypeSet.has(type)) {
			throw new CustomError({
				message: "Niepoprawny typ pytania",
				statusCode: 400,
			})
		}

		const quiz = await Quiz.findById(quizId)

		if (!quiz) {
			throw new CustomError({
				message: "Nie znaleziono quizu",
				statusCode: 404,
			})
		}

		const questionIndex = quiz.questions.findIndex(
			question => question._id?.toString() === questionId
		)

		if (questionIndex === -1) {
			throw new CustomError({
				message: "Nie znaleziono pytania o podanym id",
				statusCode: 404,
			})
		}

		const question = quiz.questions[questionIndex]
		if (req.file) {
			const prevFilePath = req.file.path
			const newFileName = `${questionId}${path.extname(req.file.originalname)}`
			const absolutePathToFile = path.resolve(
				`./static/uploads/quiz/${newFileName}`
			)
			await fs.rename(prevFilePath, absolutePathToFile)
			question.fileLocation = `/static/uploads/quiz/${newFileName}`
		}

		question.title = title
		question.type = type

		if (question.type === "TEXT") {
			question.fileLocation && removeFile(question.fileLocation)
			question.fileLocation = null
		}

		await quiz.save()

		res.json(question)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}

export async function updateQuizAnswer(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError({
				message:
					"Plik nie może zawierać '/' oraz musi posiadać rozszerzenie .jpg  .jpeg, .png lub .mp3",
				statusCode: 400,
			})
		}

		const { quizId, questionId, answerId } = req.params
		const { title, type, isTrue } = req.body

		if (!mongoose.isValidObjectId(quizId)) {
			throw new CustomError({
				message: "Niepoprawne id quizu",
				statusCode: 400,
			})
		}

		if (!mongoose.isValidObjectId(questionId)) {
			throw new CustomError({
				message: "Niepoprawne id quizu",
				statusCode: 400,
			})
		}

		if (!mongoose.isValidObjectId(answerId)) {
			throw new CustomError({
				message: "Niepoprawne id odpowiedzi",
				statusCode: 400,
			})
		}

		if (!title) {
			throw new CustomError({ message: "Brak tytułu pytania", statusCode: 400 })
		}

		if (!answerTypeSet.has(type)) {
			throw new CustomError({
				message: "Niepoprawny typ pytania",
				statusCode: 400,
			})
		}

		if (isTrue !== "true" && isTrue !== "false") {
			throw new CustomError({
				message: "isTrue musi mieć wartość 'true' lub 'false'",
				statusCode: 400,
			})
		}

		const quiz = await Quiz.findById(quizId)

		if (!quiz) {
			throw new CustomError({
				message: "Nie znaleziono quizu",
				statusCode: 404,
			})
		}

		const questionIndex = quiz.questions.findIndex(
			question => question._id?.toString() === questionId
		)

		if (questionIndex === -1) {
			throw new CustomError({
				message: "Nie znaleziono pytania o podanym id",
				statusCode: 404,
			})
		}

		const question = quiz.questions[questionIndex]
		const answerIndex = question.answers.findIndex(
			answer => answer._id?.toString() === answerId
		)

		if (answerIndex === -1) {
			throw new CustomError({
				message: "Nie znaleziono odpowiedzi o podanym id",
				statusCode: 404,
			})
		}

		const answer = question.answers[answerIndex]

		const newAnswers = question.answers.map(prevAnswer =>
			prevAnswer._id?.toString() === answerId
				? { ...prevAnswer, isTrue }
				: prevAnswer
		)

		if (!hasTrueAnswer(newAnswers)) {
			throw new CustomError({
				message: `Przynajmniej jedna odpowiedź w pytaniu musi być poprawna`,
				statusCode: 400,
			})
		}

		if (req.file) {
			const prevFilePath = req.file.path
			const newFileName = `${answerId}${path.extname(req.file.originalname)}`
			const absolutePathToFile = path.resolve(
				`./static/uploads/quiz/${newFileName}`
			)
			await fs.rename(prevFilePath, absolutePathToFile)
			answer.fileLocation = `/static/uploads/quiz/${newFileName}`
		}

		answer.title = title
		answer.type = type
		answer.isTrue = isTrue

		if (answer.type === "TEXT") {
			answer.fileLocation && removeFile(answer.fileLocation)
			answer.fileLocation = null
		}
		await quiz.save()

		res.json(answer)
	} catch (err) {
		handleControllerError(req, res, err)
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

	const mainImageIndex = req.pathToFilesProvidedOnLastReq!.findIndex(path => {
		const slash = process.platform === "win32" ? "\\" : "/"
		return path.split(slash).at(-1) === quiz.fileLocation
	})

	if (mainImageIndex === -1) {
		quiz.fileLocation = "/static/uploads/defaultQuiz.jpg"
		return
	}

	const filePath = req.pathToFilesProvidedOnLastReq![mainImageIndex]
	const fileName = filePath.split("/").at(-1)

	if (!fileName) {
		throw new CustomError({ message: "Brak nazwy zdjecia", statusCode: 400 })
	}
	const fileObj = path.parse(fileName)

	const newFileName = `${quiz._id}${fileObj.ext}`

	const absolutePathToFile = path.resolve(
		`./static/uploads/quiz/${newFileName}`
	)

	await fs.rename(filePath, absolutePathToFile)

	quiz.fileLocation = `/static/uploads/quiz/${newFileName}`
	req.pathToFilesAddedOnLastReq!.add(absolutePathToFile)
}

async function handleQuizQuestionFiles(
	req: CustomRequest,
	quiz: HydratedDocument<QuizType>
) {
	for (let i = 0; i < quiz.questions.length; i++) {
		const question = quiz.questions[i]
		const possibleQuestionFileTypes = new Set(["IMAGE", "AUDIO"])

		if (!possibleQuestionFileTypes.has(question.type)) {
			continue
		}

		const fileIndex = req.pathToFilesProvidedOnLastReq!.findIndex(path => {
			const slash = process.platform === "win32" ? "\\" : "/"
			return path.split(slash).at(-1) === question.fileLocation
		})

		if (fileIndex === -1) {
			question.fileLocation = null
			continue
		}

		const file = req.pathToFilesProvidedOnLastReq![fileIndex]
		const fileName = file.split("/").at(-1)

		if (!fileName) {
			throw new CustomError({
				message: "Zła nazwa pliku",
				statusCode: 400,
			})
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
}

async function handleQuizAnswerFiles(
	req: CustomRequest,
	quiz: HydratedDocument<QuizType>
) {
	for (let i = 0; i < quiz.questions.length; i++) {
		const question = quiz.questions[i]

		for (let j = 0; j < question.answers.length; j++) {
			const answer = question.answers[j]
			const possibleAnswerFileTypes = new Set(["IMAGE", "AUDIO"])

			if (!possibleAnswerFileTypes.has(answer.type)) {
				continue
			}

			const fileIndex = req.pathToFilesProvidedOnLastReq!.findIndex(path => {
				const slash = process.platform === "win32" ? "\\" : "/"
				return path.split(slash).at(-1) === answer.fileLocation
			})
			const file = req.pathToFilesProvidedOnLastReq![fileIndex]

			if (fileIndex === -1) {
				answer.fileLocation = null
				continue
			}

			const fileName = file.split("/").at(-1)

			if (!fileName) {
				throw new CustomError({
					message: "Zła nazwa pliku",
					statusCode: 400,
				})
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
	}
}
