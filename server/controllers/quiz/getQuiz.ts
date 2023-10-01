import { Response } from "express"
import mongoose from "mongoose"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import {
	invalidQuizId,
	quizNotFound,
} from "../../config/constants/quizErrors.js"
import { Quiz } from "../../models/quiz.js"
import { handleControllerError } from "../../utils/handleControllerError.js"

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
