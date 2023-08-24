import { CustomRequest } from "../../types/customRequest.js"
import { Response } from "express"
import CustomError from "../../types/customError.js"
import Quiz from "../../models/quiz.js"
import { removeFile } from "../../utils/removeFile.js"
import mongoose from "mongoose"
import {
	invalidQuestionId,
	invalidQuizId,
	questionNotFound,
	quizNotFound,
	quizUpdateForbidden,
} from "../../utils/errors/quiz.js"
import { Question } from "../../types/question.js"
import { handleControllerError } from "../../utils/handleControllerError.js"
import path from "path"

export async function deleteQuestion(req: CustomRequest, res: Response) {
	try {
		const { quizId, questionId } = req.params

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

		if (req.user!._id?.toString() !== quiz.creatorId) {
			throw new CustomError(quizUpdateForbidden)
		}

		const questionIndex = quiz.questions.findIndex(
			question => question._id?.toString() === questionId
		)

		if (questionIndex === -1) {
			throw new CustomError(questionNotFound)
		}
		const question: Question = quiz.questions[questionIndex]

		question.fileLocation &&
			removeFile(path.resolve(`.${question.fileLocation}`))

		question.answers.forEach(answer => {
			answer.fileLocation && removeFile(path.resolve(`.${answer.fileLocation}`))
		})

		quiz.questions.splice(questionIndex, 1)
		await quiz.save()

		res.json(question)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
