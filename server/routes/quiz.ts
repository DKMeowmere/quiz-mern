import express from "express"
import multer from "multer"
import path from "path"
import { CustomRequest } from "../types/customRequest"
import {
	createQuiz,
	deleteQuiz,
	getQuiz,
	getQuizes,
	updateQuiz,
} from "../controllers/quiz"

const router = express.Router()
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
		const allowedFilesExtensions = [".jpg", ".jpeg", ".png", ".mp3"]
		const fileExtension = path.extname(file.originalname)

		if (file.originalname.includes("/")) {
			req.isFilesValidationPassed = false
			callback(null, false)
			return
		}

		if (allowedFilesExtensions.includes(fileExtension)) {
			req.pathToFilesProvidedOnLastReq?.push(
				path.resolve(`./static/uploads/quiz/${file.originalname}`)
			)
			callback(null, true)
			return
		}

		req.isFilesValidationPassed = false
		callback(null, false)
	},
})

router.route("/").get(getQuizes).post(upload.array("files"), createQuiz)
router
	.route("/:id")
	.get(getQuiz)
	.patch(upload.array("files"), updateQuiz)
	.delete(deleteQuiz)
export default router