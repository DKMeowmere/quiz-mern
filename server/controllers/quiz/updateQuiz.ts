import { Response } from "express"
import fs from "fs/promises"
import path from "path"
import mongoose from "mongoose"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import { filesValidationFailedMustBeImage } from "../../config/constants/universalErrors.js"
import { userNotFound } from "../../config/constants/userErrors.js"
import {
	invalidQuizId,
	quizNotFound,
	quizUpdateForbidden,
} from "../../config/constants/quizErrors.js"
import { Quiz } from "../../models/quiz.js"
import { handleControllerError } from "../../utils/handleControllerError.js"
import { quizOnlySchema } from "../../types/quiz.js"

export async function updateQuiz(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError(filesValidationFailedMustBeImage)
		}

		if (!req.user) {
			throw new CustomError(userNotFound)
		}

		const { id } = req.params
		const { title, description } = req.body
		const result = quizOnlySchema.safeParse(req.body)

		if (!result.success) {
			throw new CustomError({ message: result.error.message, statusCode: 400 })
		}

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

		if (req.file) {
			const prevFilePath = req.file.path
			const newFileName = `${quiz._id}${path.extname(req.file.originalname)}`
			const absolutePathToFile = path.resolve(
				`./static/uploads/quiz/${newFileName}`
			)
			await fs.rename(prevFilePath, absolutePathToFile)
			quiz.fileLocation = `/static/uploads/quiz/${newFileName}`
		}

		quiz.title = title
		quiz.description = description

		await quiz.save()
		res.json(quiz)
	} catch (err) {
		await handleControllerError(req, res, err)
	}
}
