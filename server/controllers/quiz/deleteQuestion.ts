import { Response } from "express"
import mongoose from "mongoose"
import path from "path"
import { CustomRequest } from "../../types/customRequest.js"
import { Question } from "../../types/question.js"
import { CustomError } from "../../types/customError.js"
import {
	invalidQuestionId,
	invalidQuizId,
	minimumNumberOfQustionsExceeded,
	questionNotFound,
	quizNotFound,
	quizUpdateForbidden,
} from "../../config/constants/quizErrors.js"
import { Quiz } from "../../models/quiz.js"
import { removeFile } from "../../utils/removeFile.js"
import { handleControllerError } from "../../utils/handleControllerError.js"

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

    if (quiz.questions.length === 1) {
			throw new CustomError(minimumNumberOfQustionsExceeded)
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
