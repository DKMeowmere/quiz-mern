import mongoose from "mongoose"
import { Response } from "express"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import {
	invalidUserId,
	userNotFound,
} from "../../config/constants/userErrors.js"
import { User } from "../../models/user.js"
import { Quiz } from "../../models/quiz.js"
import { handleControllerError } from "../../utils/handleControllerError.js"

export async function getUser(req: CustomRequest, res: Response) {
	try {
		const { id } = req.params

		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError(invalidUserId)
		}

		const user = await User.findById(id)

		if (!user) {
			throw new CustomError(userNotFound)
		}

		const userQuizes = await Quiz.find({ creatorId: id })
		user.userQuizes = userQuizes
		user.password = ""

		res.json(user)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
