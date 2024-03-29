import { Response } from "express"
import mongoose from "mongoose"
import path from "path"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import {
	authNeeded,
	invalidUserId,
	userNotFound,
	userUpdateForbidden,
} from "../../config/constants/userErrors.js"
import { User } from "../../models/user.js"
import { removeFile } from "../../utils/removeFile.js"
import { handleControllerError } from "../../utils/handleControllerError.js"

export async function deleteUser(req: CustomRequest, res: Response) {
	try {
		const { id } = req.params

		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError(invalidUserId)
		}

		if (!req.user) {
			throw new CustomError(authNeeded)
		}

		if (req.user._id?.toString() !== id) {
			throw new CustomError(userUpdateForbidden)
		}

		const user = await User.findByIdAndDelete(id)

		if (!user) {
			throw new CustomError(userNotFound)
		}

		removeFile(path.resolve(`./${user.avatarLocation}`))

		user.password = ""
		res.json(user)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
