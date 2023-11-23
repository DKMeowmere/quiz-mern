import { Response } from "express"
import mongoose from "mongoose"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import { questionSchema } from "../../types/question.js"
import {
	invalidQuizId,
	questionHasNotTrueAnswer,
	quizNotFound,
	quizUpdateForbidden,
} from "../../config/constants/quizErrors.js"
import { userNotFound } from "../../config/constants/userErrors.js"
import { filesValidationFailedMustBeImageOrAudio } from "../../config/constants/universalErrors.js"
import { Quiz } from "../../models/quiz.js"
import { handleControllerError } from "../../utils/handleControllerError.js"
import { hasTrueAnswer } from "../../utils/quiz/hasTrueAnswer.js"
import { createAnswerFile, createQuestionFile } from "./fileCreationUtils.js"
import { removeUnusedFiles } from "../../utils/removeUnusedFiles.js"

export async function createQuestion(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError(filesValidationFailedMustBeImageOrAudio)
		}

		if (!req.user) {
			throw new CustomError(userNotFound)
		}

		const { title, fileLocation, answers, type } = req.body
		const { id } = req.params

		const result = questionSchema.safeParse({
			title,
			fileLocation,
			answers: JSON.parse(answers),
			type,
		})
		if (result.success === false) {
			throw new CustomError({ message: result.error.message, statusCode: 400 })
		}

		const question = result.data
		question._id = new mongoose.Types.ObjectId().toString()

		if (!hasTrueAnswer(question.answers)) {
			throw new CustomError(questionHasNotTrueAnswer())
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

		await createQuestionFile(req, question)

		for (let i = 0; i < question.answers.length; i++) {
			const answer = question.answers[i]
			answer._id = new mongoose.Types.ObjectId().toString()
			await createAnswerFile(req, answer)
		}

		quiz.questions.push(question)
		await quiz.save()

		await removeUnusedFiles(req)

		res.status(201).json(question)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
