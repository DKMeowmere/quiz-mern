import { Response } from "express"
import mongoose from "mongoose"
import fs from "fs/promises"
import path from "path"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import { filesValidationFailedMustBeImage } from "../../config/constants/universalErrors.js"
import {
	authNeeded,
	invalidUserId,
	userNotFound,
	userUpdateForbidden,
} from "../../config/constants/userErrors.js"
import { User } from "../../models/user.js"
import { Quiz } from "../../models/quiz.js"
import { handleControllerError } from "../../utils/handleControllerError.js"
import { removeFile } from "../../utils/removeFile.js"

export async function updateUser(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError(filesValidationFailedMustBeImage)
		}

		if (!req.user) {
			throw new CustomError(authNeeded)
		}

		const { id } = req.params
		const { name, biography } = req.body

		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError(invalidUserId)
		}

		if (req.user?._id?.toString() !== id) {
			throw new CustomError(userUpdateForbidden)
		}

		const user = await User.findById(id)

		if (!user) {
			throw new CustomError(userNotFound)
		}

		if (req.file) {
			removeFile(path.resolve(`.${user?.avatarLocation}`))

			const oldFilename = req.pathToFilesProvidedOnLastReq![0].split("/").at(-1)
			const ext = path.extname(oldFilename as string)
			const newFileName = `${path.parse(oldFilename as string).name}-${
				user._id
			}${ext}`
			const oldPath = req.pathToFilesProvidedOnLastReq![0]
			const newPath = path.resolve(`./static/uploads/user/${newFileName}`)

			await fs.rename(oldPath, newPath)

			user.avatarLocation = `/static/uploads/user/${newFileName}`
		}

		user.name = name
		user.biography = biography
		await user.save()

		const userQuizes = await Quiz.find({ creatorId: user._id })
		user.userQuizes = userQuizes
		user.password = ""

		res.json(user)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
