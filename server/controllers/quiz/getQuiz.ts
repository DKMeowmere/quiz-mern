import { CustomRequest } from "../../types/customRequest.js"
import { Response } from "express"
import CustomError from "../../types/customError.js"
import Quiz from "../../models/quiz.js"
import mongoose from "mongoose"
import { handleControllerError } from "../../utils/handleControllerError.js"
import { invalidQuizId, quizNotFound } from "../../utils/errors/quiz.js"

export async function getQuiz(req: CustomRequest, res: Response) {
	try {
		const { id } = req.params

		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError(invalidQuizId)
		}

		const quiz = await Quiz.findById(id)

		if (!quiz) {
			throw new CustomError(quizNotFound)
		}

		res.json(quiz)
	} catch (err) {
		await handleControllerError(req, res, err)
	}
}
