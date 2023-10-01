import { Response } from "express"
import mongoose from "mongoose"
import path from "path"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import { Question } from "../../types/question.js"
import {
	answerNotFound,
	invalidAnswerId,
	invalidQuestionId,
	invalidQuizId,
	minimumNumberOfAnswersExceeded,
	questionHasNotTrueAnswer,
	questionNotFound,
	quizNotFound,
	quizUpdateForbidden,
} from "../../config/constants/quizErrors.js"
import { Quiz } from "../../models/quiz.js"
import { removeFile } from "../../utils/removeFile.js"
import { handleControllerError } from "../../utils/handleControllerError.js"
import { hasTrueAnswer } from "../../utils/quiz/hasTrueAnswer.js"

export async function deleteAnswer(req: CustomRequest, res: Response) {
	try {
		const { quizId, questionId, answerId } = req.params

		if (!mongoose.isValidObjectId(quizId)) {
			throw new CustomError(invalidQuizId)
		}

		if (!mongoose.isValidObjectId(questionId)) {
			throw new CustomError(invalidQuestionId)
		}

		if (!mongoose.isValidObjectId(answerId)) {
			throw new CustomError(invalidAnswerId)
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

		const answerIndex = question.answers.findIndex(
			answer => answer._id?.toString() === answerId
		)

		if (answerIndex === -1) {
			throw new CustomError(answerNotFound)
		}

		const answer = question.answers[answerIndex]

		if (question.answers.length === 2) {
			throw new CustomError(minimumNumberOfAnswersExceeded)
		}

		question.answers.splice(answerIndex, 1)

		if (!hasTrueAnswer(question.answers)) {
			throw new CustomError(questionHasNotTrueAnswer())
		}

		answer.fileLocation && removeFile(path.resolve(`.${answer.fileLocation}`))
		await quiz.save()

		res.json(answer)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
