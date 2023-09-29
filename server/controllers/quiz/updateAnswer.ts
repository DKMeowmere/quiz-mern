import { CustomRequest } from "../../types/customRequest.js"
import { Response } from "express"
import CustomError from "../../types/customError.js"
import Quiz from "../../models/quiz.js"
import { removeFile } from "../../utils/removeFile.js"
import fs from "fs/promises"
import path from "path"
import mongoose from "mongoose"
import { handleControllerError } from "../../utils/handleControllerError.js"
import hasTrueAnswer from "../../utils/quiz/hasTrueAnswer.js"
import { answerTypeSet } from "../../types/answer.js"
import { filesValidationFailedMustBeImageOrAudio } from "../../utils/errors/universal.js"
import {
	answerNotFound,
	invalidAnswerId,
	invalidQuestionId,
	invalidQuizId,
	isTrueMustBeBoolean,
	noQuestionTitle,
	questionHasNotTrueAnswer,
	questionNotFound,
	quizNotFound,
	quizUpdateForbidden,
	wrongAnswerType,
} from "../../utils/errors/quiz.js"
import { userNotFound } from "../../utils/errors/user.js"

export async function updateAnswer(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError(filesValidationFailedMustBeImageOrAudio)
		}

		if (!req.user) {
			throw new CustomError(userNotFound)
		}

		const { quizId, questionId, answerId } = req.params
		const { title, type, isTrue } = req.body

		if (!mongoose.isValidObjectId(quizId)) {
			throw new CustomError(invalidQuizId)
		}

		if (!mongoose.isValidObjectId(questionId)) {
			throw new CustomError(invalidQuestionId)
		}

		if (!mongoose.isValidObjectId(answerId)) {
			throw new CustomError(invalidAnswerId)
		}

		if (!title) {
			throw new CustomError(noQuestionTitle)
		}

		if (!answerTypeSet.has(type)) {
			throw new CustomError(wrongAnswerType)
		}

		if (isTrue !== "true" && isTrue !== "false") {
			throw new CustomError(isTrueMustBeBoolean)
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
		const answerIndex = question.answers.findIndex(
			answer => answer._id?.toString() === answerId
		)

		if (answerIndex === -1) {
			throw new CustomError(answerNotFound)
		}

		const answer = question.answers[answerIndex]

		const newAnswers = question.answers.map(prevAnswer =>
			prevAnswer._id?.toString() === answerId
				? { ...prevAnswer, isTrue: JSON.parse(isTrue) }
				: prevAnswer
		)

		if (!hasTrueAnswer(newAnswers)) {
			throw new CustomError(questionHasNotTrueAnswer())
		}

		if (req.file) {
			const prevFilePath = req.file.path
			const newFileName = `${answerId}${path.extname(req.file.originalname)}`
			const absolutePathToFile = path.resolve(
				`./static/uploads/quiz/${newFileName}`
			)
			await fs.rename(prevFilePath, absolutePathToFile)
			answer.fileLocation = `/static/uploads/quiz/${newFileName}`
		}

		answer.title = title
		answer.type = type
		answer.isTrue = isTrue

		if (answer.type === "TEXT") {
			answer.fileLocation && removeFile(path.resolve(`.${answer.fileLocation}`))
			answer.fileLocation = null
		}
		await quiz.save()

		res.json(answer)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
