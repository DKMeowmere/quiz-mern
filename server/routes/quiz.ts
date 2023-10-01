import express from "express"
import multer from "multer"
import path from "path"
import { CustomRequest } from "../types/customRequest.js"
import { requireAuth } from "../middlewares/auth.js"
import { getQuiz } from "../controllers/quiz/getQuiz.js"
import { getQuizes } from "../controllers/quiz/getQuizes.js"
import { createQuiz } from "../controllers/quiz/createQuiz.js"
import { updateQuiz } from "../controllers/quiz/updateQuiz.js"
import { deleteQuiz } from "../controllers/quiz/deleteQuiz.js"
import { updateQuestion } from "../controllers/quiz/updateQuestion.js"
import { updateAnswer } from "../controllers/quiz/updateAnswer.js"
import { createAnswer } from "../controllers/quiz/createAnswer.js"
import { deleteAnswer } from "../controllers/quiz/deleteAnswer.js"
import { createQuestion } from "../controllers/quiz/createQuestion.js"
import { deleteQuestion } from "../controllers/quiz/deleteQuestion.js"

export const router = express.Router()
const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, "static/uploads/quiz")
	},
	filename(req, file, callback) {
		//file name will change after creating quiz knowing id
		callback(null, file.originalname)
	},
})

const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	fileFilter(req: CustomRequest, file, callback) {
		const allowedFileExtensions = [".jpg", ".jpeg", ".png", ".mp3"]
		const fileExtension = path.extname(file.originalname)

		if (!req.isFilesValidationPassed) {
			return callback(null, false)
		}

		if (file.originalname.includes("/")) {
			req.isFilesValidationPassed = false
			return callback(null, false)
		}

		if (!allowedFileExtensions.includes(fileExtension)) {
			req.isFilesValidationPassed = false
			return callback(null, false)
		}

		req.pathToFilesProvidedOnLastReq?.push(
			path.resolve(`./static/uploads/quiz/${file.originalname}`)
		)
		return callback(null, true)
	},
})

router
	.route("/")
	.get(getQuizes)
	.post(requireAuth, upload.array("files"), createQuiz)
router
	.route("/:id")
	.get(getQuiz)
	.post(requireAuth, upload.array("files"), createQuestion)
	.patch(requireAuth, upload.single("file"), updateQuiz)
	.delete(requireAuth, deleteQuiz)
router
	.route("/:quizId/:questionId")
	.post(requireAuth, upload.single("file"), createAnswer)
	.patch(requireAuth, upload.single("file"), updateQuestion)
	.delete(requireAuth, deleteQuestion)
router
	.route("/:quizId/:questionId/:answerId")
	.patch(requireAuth, upload.single("file"), updateAnswer)
	.delete(requireAuth, deleteAnswer)
