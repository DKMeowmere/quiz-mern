import path from "path"
import mongoose from "mongoose"
import { Response } from "express"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import { userNotFound } from "../../config/constants/userErrors.js"
import {
	invalidQuizId,
	quizNotFound,
	quizUpdateForbidden,
} from "../../config/constants/quizErrors.js"
import { Quiz } from "../../models/quiz.js"
import { removeFile } from "../../utils/removeFile.js"
import { handleControllerError } from "../../utils/handleControllerError.js"

export async function deleteQuiz(req: CustomRequest, res: Response) {
	try {
		if (!req.user) {
			throw new CustomError(userNotFound)
		}

		const { id } = req.params

		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError(invalidQuizId)
		}
		const quiz = await Quiz.findById(id)

		if (!quiz) {
			throw new CustomError(quizNotFound)
		}

		if (quiz.creatorId !== req.user._id?.toString()) {
			throw new CustomError(quizUpdateForbidden)
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
