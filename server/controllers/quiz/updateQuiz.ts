import { Response } from "express"
import fs from "fs/promises"
import path from "path"
import mongoose from "mongoose"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import { filesValidationFailedMustBeImageOrAudio } from "../../config/constants/universalErrors.js"
import { userNotFound } from "../../config/constants/userErrors.js"
import {
	invalidQuizId,
	noQuizTitle,
	quizNotFound,
	quizUpdateForbidden,
} from "../../config/constants/quizErrors.js"
import { Quiz } from "../../models/quiz.js"
import { handleControllerError } from "../../utils/handleControllerError.js"

export async function updateQuiz(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError(filesValidationFailedMustBeImageOrAudio)
		}

		if (!req.user) {
			throw new CustomError(userNotFound)
		}

		const { id } = req.params
		const { title, description } = req.body

		if (!title) {
			throw new CustomError(noQuizTitle)
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
		}

		const updatedQuiz = await Quiz.findByIdAndUpdate(
			id,
			{
				title,
				description,
			},
			{ new: true }
		)

		res.json(updatedQuiz)
	} catch (err) {
		await handleControllerError(req, res, err)
	}
}
