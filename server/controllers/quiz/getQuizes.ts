import { Response } from "express"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import { quizNotFound } from "../../config/constants/quizErrors.js"
import { Quiz } from "../../models/quiz.js"
import { handleControllerError } from "../../utils/handleControllerError.js"

export async function getQuizes(req: CustomRequest, res: Response) {
	try {
		const { limit, creatorId } = req.query
		const queryFilter = creatorId ? { creatorId } : {}
		const quizes = await Quiz.find(queryFilter)
			.sort({ createdAt: -1 })
			.limit(parseInt(limit?.toString() || "0"))

		if (!quizes) {
			throw new CustomError(quizNotFound)
		}

		res.json(quizes)
	} catch (err) {
		await handleControllerError(req, res, err)
	}
}
