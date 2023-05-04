import express from "express"
import multer from "multer"
import path from "path"
import { CustomRequest } from "../types/customRequest"
import {
	deleteUser,
	getUser,
	getUsers,
	login,
	signUp,
	updateUser,
} from "../controllers/user"
import { requireAuth } from "../middlewares/auth"

const router = express.Router()

const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, "static/uploads/user/")
	},
	filename(req: CustomRequest, file, callback) {
		callback(null, file.originalname)
	},
})

const upload = multer({
	storage,
	limits: { fileSize: 1024 * 1024 * 1024 * 5 },
	fileFilter(req: CustomRequest, file, callback) {
		const allowedFileExtensions = [".jpg", ".jpeg", ".png"]
		const fileExtension = path.extname(file.originalname)

		if (allowedFileExtensions.includes(fileExtension)) {
			req.pathToFilesProvidedOnLastReq?.push(
				path.resolve(`./static/uploads/user/${file.originalname}`)
			)
			callback(null, true)
			return
		}

		callback(null, false)
		req.isFilesValidationPassed = false
	},
})

router.route("/").get(getUsers).post(upload.single("avatar"), signUp)
router.route("/login").post(login)
router
	.route("/:id")
	.get(getUser)
	.patch(requireAuth, upload.single("avatar"), updateUser)
	.delete(requireAuth, deleteUser)
export default router
