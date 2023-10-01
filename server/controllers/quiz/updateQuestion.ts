import { Response } from "express"
import fs from "fs/promises"
import path from "path"
import mongoose from "mongoose"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import { questionTypeSet } from "../../types/question.js"
import { userNotFound } from "../../config/constants/userErrors.js"
import { filesValidationFailedMustBeImageOrAudio } from "../../config/constants/universalErrors.js"
import {
	invalidQuestionId,
	invalidQuizId,
	noQuestionTitle,
	questionNotFound,
	quizNotFound,
	quizUpdateForbidden,
	wrongQuestionType,
} from "../../config/constants/quizErrors.js"
import { Quiz } from "../../models/quiz.js"
import { removeFile } from "../../utils/removeFile.js"
import { handleControllerError } from "../../utils/handleControllerError.js"

export async function updateQuestion(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError(filesValidationFailedMustBeImageOrAudio)
		}

		if (!req.user) {
			throw new CustomError(userNotFound)
		}

		const { quizId, questionId } = req.params
		const { title, type } = req.body

		if (!mongoose.isValidObjectId(quizId)) {
			throw new CustomError(invalidQuizId)
		}

		if (!mongoose.isValidObjectId(questionId)) {
			throw new CustomError(invalidQuestionId)
		}

		if (!title) {
			throw new CustomError(noQuestionTitle)
		}

		if (!questionTypeSet.has(type)) {
			throw new CustomError(wrongQuestionType)
		}

		const quiz = await Quiz.findById(quizId)

		if (!quiz) {
			throw new CustomError(quizNotFound)
		}

		if (quiz.creatorId !== req.user._id?.toString()) {
			throw new CustomError(quizUpdateForbidden)
		}

		const questionIndex = quiz.questions.findIndex(
			question => question._id?.toString() === questionId
		)

		if (questionIndex === -1) {
			throw new CustomError(questionNotFound)
		}

		const question = quiz.questions[questionIndex]

		if (req.file) {
			const prevFilePath = req.file.path
			const newFileName = `${questionId}${path.extname(req.file.originalname)}`
			const absolutePathToFile = path.resolve(
				`./static/uploads/quiz/${newFileName}`
			)
			await fs.rename(prevFilePath, absolutePathToFile)
			question.fileLocation = `/static/uploads/quiz/${newFileName}`
		}

		question.title = title
		question.type = type

		if (question.type === "TEXT") {
			question.fileLocation &&
				(await removeFile(path.resolve(`.${question.fileLocation}`)))
			question.fileLocation = null
		}

		await quiz.save()

		res.json(question)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
