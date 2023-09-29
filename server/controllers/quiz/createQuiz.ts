import { CustomRequest } from "../../types/customRequest.js"
import { Response } from "express"
import { quizSchema } from "../../types/quiz.js"
import CustomError from "../../types/customError.js"
import Quiz from "../../models/quiz.js"
import { handleControllerError } from "../../utils/handleControllerError.js"
import hasTrueAnswer from "../../utils/quiz/hasTrueAnswer.js"
import {
	createAnswerFile,
	createMainQuizFile,
	createQuestionFile,
} from "./fileCreationUtils.js"
import { filesValidationFailedMustBeImageOrAudio } from "../../utils/errors/universal.js"
import { userNotFound } from "../../utils/errors/user.js"
import { questionHasNotTrueAnswer } from "../../utils/errors/quiz.js"
import { removeUnusedFiles } from "../../utils/removeUnusedFiles.js"

export async function createQuiz(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError(filesValidationFailedMustBeImageOrAudio)
		}

		if (!req.user) {
			throw new CustomError(userNotFound)
		}

		const { title, questions, fileLocation, description } = req.body
		const result = quizSchema.safeParse({
			title,
			questions: JSON.parse(questions),
			fileLocation,
			description,
		})

		if (result.success === false) {
			throw new CustomError({ message: result.error.message, statusCode: 400 })
		}
		const body = result.data

		for (let i = 0; i < body.questions.length; i++) {
			const question = body.questions[i]

			if (!hasTrueAnswer(question.answers)) {
				throw new CustomError(questionHasNotTrueAnswer(question.title))
			}
		}

		const quiz = await Quiz.create({ ...body, creatorId: req.user._id })

		await createMainQuizFile(req, quiz)

		for (let i = 0; i < quiz.questions.length; i++) {
			const question = quiz.questions[i]
			await createQuestionFile(req, question)

			for (let j = 0; j < question.answers.length; j++) {
				const answer = question.answers[j]
				await createAnswerFile(req, answer)
			}
		}
		await quiz.save()

		await removeUnusedFiles(req)

		res.status(201).json(quiz)
	} catch (err) {
		await handleControllerError(req, res, err)
	}
}
