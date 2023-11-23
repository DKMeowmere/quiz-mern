import { Response } from "express"
import fs from "fs/promises"
import path from "path"
import mongoose from "mongoose"
import { CustomRequest } from "../../types/customRequest"
import { CustomError } from "../../types/customError.js"
import { answerSchema } from "../../types/answer.js"
import {
	questionNotFound,
	quizNotFound,
	quizUpdateForbidden,
	maximumNumberOfAnswersExceeded,
	invalidQuestionId,
	invalidQuizId,
} from "../../config/constants/quizErrors.js"
import { filesValidationFailedMustBeImageOrAudio } from "../../config/constants/universalErrors.js"
import { Quiz } from "../../models/quiz.js"
import { handleControllerError } from "../../utils/handleControllerError.js"

export async function createAnswer(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError(filesValidationFailedMustBeImageOrAudio)
		}

		const { quizId, questionId } = req.params
		const { title, type, isTrue } = req.body

		const result = answerSchema.safeParse({
			title,
			type,
			isTrue: JSON.parse(isTrue),
		})

		if (result.success === false) {
			throw new CustomError({ message: result.error.message, statusCode: 400 })
		}

		const answer = result.data
		answer._id = new mongoose.Types.ObjectId().toString()

		if (!mongoose.isValidObjectId(quizId)) {
			throw new CustomError(invalidQuizId)
		}

		if (!mongoose.isValidObjectId(questionId)) {
			throw new CustomError(invalidQuestionId)
		}

		const quiz = await Quiz.findById(quizId)

		if (!quiz) {
			throw new CustomError(quizNotFound)
		}

		if (quiz.creatorId !== req.user!._id?.toString()) {
			throw new CustomError(quizUpdateForbidden)
		}

		const questionIndex = quiz.questions.findIndex(
			question => question._id?.toString() === questionId
		)

		if (questionIndex === -1) {
			throw new CustomError(questionNotFound)
		}

		const question = quiz.questions[questionIndex]

		if (question.answers.length === 4) {
			throw new CustomError(maximumNumberOfAnswersExceeded)
		}

		if (req.file) {
			const prevFilePath = req.file.path
			const newFileName = `${questionId}${path.extname(req.file.originalname)}`
			const absolutePathToFile = path.resolve(
				`./static/uploads/quiz/${newFileName}`
			)
			await fs.rename(prevFilePath, absolutePathToFile)
			question.fileLocation = `/static/uploads/quiz/${newFileName}`
		}

		question.answers.push(answer)
		await quiz.save()

		res.status(201).json(answer)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
